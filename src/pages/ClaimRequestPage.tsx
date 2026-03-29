import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCreateClaim } from "../hooks/useClaims";
import { useItem } from "../hooks/useItems";
import { useCategories } from "../hooks/useCategories";
import { useLocations } from "../hooks/useLocations";
import { apiItemToItem } from "../types/item";

// Copy that changes based on whether the user is claiming a found item
// or offering to return a lost item.
function getPageCopy(itemType: string) {
  if (itemType === "lost") {
    return {
      title: "Return This Item",
      subtitle: "Let the owner know you've found their lost item.",
      descriptionLabel: "Where and how did you find it?",
      descriptionPlaceholder: "Describe where you found it, current condition, how to arrange return…",
      verificationLabel: "How can the owner verify you have their item?",
      verificationPlaceholder: "Describe something specific about the item only the real owner would know",
      submitLabel: "Submit Return Request",
      successMessage: "Return request submitted. Status: Pending. The owner will be notified.",
    };
  }
  return {
    title: "Claim This Item",
    subtitle: "Prove this found item belongs to you.",
    descriptionLabel: "Describe the item",
    descriptionPlaceholder: "Color, brand, unique marks, contents, etc.",
    verificationLabel: "Verification — something only the true owner would know",
    verificationPlaceholder: "e.g. what's inside the bag, a scratch on the case, a sticker, etc.",
    submitLabel: "Submit Claim Request",
    successMessage: "Claim request submitted. Status: Pending.",
  };
}

export default function ClaimRequestPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const createClaim = useCreateClaim();

  const { data: apiItem, isLoading: itemLoading } = useItem(Number(itemId));
  const { data: categories = [] } = useCategories();
  const { data: locations = [] } = useLocations();

  const item = useMemo(
    () => (apiItem ? apiItemToItem(apiItem, categories, locations) : null),
    [apiItem, categories, locations]
  );

  const copy = getPageCopy(item?.type ?? "found");

  const initial = useMemo(
    () => ({ fullName: "", studentId: "", email: "", phone: "", description: "", verificationAnswer: "" }),
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
    if (!form.description.trim()) e.description = "This field is required.";
    if (!form.verificationAnswer.trim()) e.verificationAnswer = "This field is required.";
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
      form.phone ? `Phone: ${form.phone}` : "",
      `Description: ${form.description}`,
      `Verification: ${form.verificationAnswer}`,
    ].filter(Boolean).join("\n");

    createClaim.mutate(
      { item: Number(itemId), message },
      {
        onSuccess: () => setResult({ status: "Pending", message: copy.successMessage }),
        onError: (err: unknown) => {
          const detail =
            (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
            "Something went wrong submitting your request.";
          setResult({ status: "Error", message: detail });
        },
      }
    );
  };

  if (itemLoading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
        {item && (
          <Chip
            label={item.type.toUpperCase()}
            size="small"
            color={item.type === "lost" ? "error" : "success"}
            sx={{ fontWeight: 700 }}
          />
        )}
        <Typography variant="h5">{copy.title}</Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {copy.subtitle}{" "}
        {item && <Box component="span" sx={{ fontWeight: 600 }}>"{item.title}"</Box>}
      </Typography>

      <Paper component="form" onSubmit={onSubmit} sx={{ p: 3, borderRadius: 3 }}>
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
            label={copy.descriptionLabel}
            required
            size="small"
            multiline
            rows={4}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder={copy.descriptionPlaceholder}
            error={!!errors.description}
            helperText={errors.description}
          />

          <TextField
            label={copy.verificationLabel}
            required
            size="small"
            value={form.verificationAnswer}
            onChange={(e) => setField("verificationAnswer", e.target.value)}
            placeholder={copy.verificationPlaceholder}
            error={!!errors.verificationAnswer}
            helperText={errors.verificationAnswer}
          />

          <Button type="submit" variant="contained" disabled={createClaim.isPending}>
            {createClaim.isPending ? "Submitting…" : copy.submitLabel}
          </Button>

          {result && (
            <Alert severity={result.status === "Error" ? "error" : "info"} icon={false}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={result.status}
                  size="small"
                  color={result.status === "Error" ? "error" : "warning"}
                />
                <Typography variant="body2">{result.message}</Typography>
              </Stack>
            </Alert>
          )}

          <Stack direction="row" spacing={1.5}>
            <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
            <Button variant="outlined" onClick={() => navigate("/claims")}>View My Claims</Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
