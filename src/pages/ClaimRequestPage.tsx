import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCreateClaim } from "../hooks/useClaims";

export default function ClaimRequestPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const createClaim = useCreateClaim();

  const initial = useMemo(
    () => ({
      fullName: "",
      studentId: "",
      email: "",
      phone: "",
      description: "",
      verificationAnswer: "",
    }),
    []
  );

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ status: string; message: string } | null>(null);

  const setField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.studentId.trim()) e.studentId = "Student ID is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email.";

    if (!form.description.trim()) e.description = "Please describe the item.";
    if (!form.verificationAnswer.trim())
      e.verificationAnswer = "Please answer the verification question.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    if (!validate()) return;

    const message = [
      `Name: ${form.fullName}`,
      `Student ID: ${form.studentId}`,
      `Email: ${form.email}`,
      form.phone ? `Phone: ${form.phone}` : '',
      `Description: ${form.description}`,
      `Verification: ${form.verificationAnswer}`,
    ].filter(Boolean).join('\n');

    createClaim.mutate(
      { item: Number(itemId), message },
      {
        onSuccess: () => {
          setResult({
            status: "Pending",
            message: "Claim request submitted. Status: Pending.",
          });
        },
        onError: (err: unknown) => {
          const detail =
            (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
            "Something went wrong submitting your request.";
          setResult({ status: "Rejected", message: detail });
        },
      }
    );
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 0.5 }}>
        Claim Request
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Item ID: <strong>{itemId}</strong>
      </Typography>

      <Paper
        component="form"
        onSubmit={onSubmit}
        sx={{ p: 3, borderRadius: 3 }}
      >
        <Stack spacing={2}>
          <TextField
            label="Full Name"
            required
            size="small"
            value={form.fullName}
            onChange={(e) => setField("fullName", e.target.value)}
            error={!!errors.fullName}
            helperText={errors.fullName}
          />

          <TextField
            label="Student ID"
            required
            size="small"
            value={form.studentId}
            onChange={(e) => setField("studentId", e.target.value)}
            placeholder="e.g., 101234567"
            error={!!errors.studentId}
            helperText={errors.studentId}
          />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Email"
                required
                size="small"
                fullWidth
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Phone"
                size="small"
                fullWidth
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="optional"
              />
            </Grid>
          </Grid>

          <TextField
            label="Describe the item"
            required
            size="small"
            multiline
            rows={4}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Color, brand, unique marks, contents, etc."
            error={!!errors.description}
            helperText={errors.description}
          />

          <TextField
            label="Verification Question (example)"
            required
            size="small"
            value={form.verificationAnswer}
            onChange={(e) => setField("verificationAnswer", e.target.value)}
            placeholder="What is one unique detail only you know?"
            error={!!errors.verificationAnswer}
            helperText={errors.verificationAnswer}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={createClaim.isPending}
          >
            {createClaim.isPending ? "Submitting..." : "Submit Claim Request"}
          </Button>

          {result && (
            <Alert
              severity={result.status === "Rejected" ? "error" : "info"}
              icon={false}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={result.status}
                  size="small"
                  color={result.status === "Rejected" ? "error" : "warning"}
                />
                <Typography variant="body2">{result.message}</Typography>
              </Stack>
            </Alert>
          )}

          <Stack direction="row" spacing={1.5}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button variant="outlined" onClick={() => navigate("/claims")}>
              View My Claims
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}