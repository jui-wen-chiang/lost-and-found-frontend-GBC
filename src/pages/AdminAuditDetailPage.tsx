import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function AdminAuditDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleApprove = () => {
    setDecision("Approved");
    setSubmitted(true);
  };

  const handleReject = () => {
    if (!reason.trim()) return;
    setDecision("Rejected");
    setSubmitted(true);
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 0.5 }}>
        Post Audit Detail
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Post ID: {id}
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={1.5}>
          <Typography><strong>Item:</strong> Black Wallet</Typography>
          <Typography><strong>Description:</strong> Black leather wallet found near library entrance.</Typography>
          <Typography><strong>Location:</strong> Casa Loma</Typography>
          <Typography><strong>Submitted By:</strong> John</Typography>

          {!submitted ? (
            <>
              <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleApprove}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleReject}
                >
                  Reject
                </Button>
              </Stack>

              <TextField
                label="Reason for rejection"
                multiline
                rows={4}
                size="small"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason if rejecting..."
              />
            </>
          ) : (
            <Alert
              severity={decision === "Approved" ? "success" : "error"}
              sx={{ mt: 1 }}
            >
              Decision submitted: {decision}
              {decision === "Rejected" && reason ? ` — Reason: ${reason}` : ""}
            </Alert>
          )}

          <Button
            variant="outlined"
            sx={{ width: "fit-content" }}
            onClick={() => navigate("/admin/audit")}
          >
            Back to Queue
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}