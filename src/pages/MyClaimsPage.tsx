import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Chip,
  Container,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

const statusColorMap: Record<string, "warning" | "success" | "error"> = {
  Pending: "warning",
  Approved: "success",
  Rejected: "error",
};

const mockClaims = [
  { id: 101, itemId: 12, title: "Wallet", status: "Pending" },
  { id: 102, itemId: 9, title: "Phone", status: "Approved" },
  { id: 103, itemId: 4, title: "AirPods", status: "Rejected" },
];

export default function MyClaimsPage() {
  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        My Claim Requests
      </Typography>

      <Stack spacing={1.5} sx={{ maxWidth: 720 }}>
        {mockClaims.map((c) => (
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
                {c.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Claim ID: {c.id} &bull; Item ID: {c.itemId}
              </Typography>
              <Link
                component={RouterLink}
                to={`/claims/new/${c.itemId}`}
                variant="body2"
                sx={{ mt: 0.5, display: "inline-block" }}
              >
                Open claim form
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