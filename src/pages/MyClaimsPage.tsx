import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Chip,
  CircularProgress,
  Container,
  Link,
  Paper,
  Stack,
  Typography,
  Alert,
} from "@mui/material";
import { useMyClaims } from "../hooks/useClaims";

const statusColorMap: Record<string, "warning" | "success" | "error" | "info"> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
  completed: "info",
};

export default function MyClaimsPage() {
  const { data: claims, isLoading, error } = useMyClaims();

  if (isLoading) {
    return (
      <Container sx={{ py: 3, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 3 }}>
        <Alert severity="error">Failed to load claims.</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        My Claim Requests
      </Typography>

      {(!claims || claims.length === 0) && (
        <Alert severity="info">You have no claim requests yet.</Alert>
      )}

      <Stack spacing={1.5} sx={{ maxWidth: 720 }}>
        {(claims ?? []).map((c) => (
          <Paper
            key={c.id}
            sx={{
              p: 2,
              borderRadius: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Claim #{c.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Item ID: {c.item} &bull; {new Date(c.created_at).toLocaleDateString()}
              </Typography>
              <Link
                component={RouterLink}
                to={`/items/${c.item}`}
                variant="body2"
                sx={{ mt: 0.5, display: "inline-block" }}
              >
                View item
              </Link>
            </Box>

            <Chip
              label={c.status}
              size="small"
              color={statusColorMap[c.status] ?? "default"}
            />
          </Paper>
        ))}
      </Stack>
    </Container>
  );
}