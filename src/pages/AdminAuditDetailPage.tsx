import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useItem } from "../hooks/useItems";
import { useApprovePost, useRejectPost } from "../hooks/useAdmin";

export default function AdminAuditDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const numId = Number(id);

  const { data: item, isLoading, error: fetchError } = useItem(numId);
  const approvePost = useApprovePost();
  const rejectPost = useRejectPost();

  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");

  const handleApprove = () => {
    approvePost.mutate(numId, {
      onSuccess: () => setDecision("Approved"),
    });
  };

  const handleReject = () => {
    if (!reason.trim()) return;
    rejectPost.mutate(
      { id: numId, reason },
      { onSuccess: () => setDecision("Rejected") }
    );
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (fetchError || !item) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Alert severity="error">Failed to load post details.</Alert>
      </Container>
    );
  }

  const submitted = !!decision;

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
          <Typography><strong>Item:</strong> {item.title}</Typography>
          <Typography><strong>Description:</strong> {item.description}</Typography>
          <Typography><strong>Type:</strong> {item.item_type}</Typography>
          <Typography><strong>Status:</strong> {item.status}</Typography>

          {!submitted ? (
            <>
              <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleApprove}
                  disabled={approvePost.isPending}
                >
                  {approvePost.isPending ? "Approving…" : "Approve"}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleReject}
                  disabled={rejectPost.isPending}
                >
                  {rejectPost.isPending ? "Rejecting…" : "Reject"}
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