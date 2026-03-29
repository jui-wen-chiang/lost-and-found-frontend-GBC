import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { usePendingPosts } from "../hooks/useAdmin";

export default function AdminAuditQueuePage() {
  const { data: posts, isLoading, error } = usePendingPosts();

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Admin Audit Queue
      </Typography>

      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">Failed to load pending posts.</Alert>}

      {!isLoading && !error && (posts ?? []).length === 0 && (
        <Alert severity="info">No pending posts to review.</Alert>
      )}

      <Stack spacing={1.5} sx={{ maxWidth: 900 }}>
        {(posts ?? []).map((post) => (
          <Paper
            key={post.id}
            sx={{
              p: 2,
              borderRadius: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {post.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Type: {post.item_type} &bull; Created: {post.created_at?.slice(0, 10)}
              </Typography>
            </div>

            <Button
              component={RouterLink}
              to={`/admin/audit/${post.id}`}
              size="small"
            >
              View Details
            </Button>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
}