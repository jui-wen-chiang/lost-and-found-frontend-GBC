import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

const mockPendingPosts = [
  { id: 201, title: "Black Wallet", user: "John", date: "2026-03-01" },
  { id: 202, title: "Blue Backpack", user: "Sara", date: "2026-03-02" },
  { id: 203, title: "Student Card", user: "Alex", date: "2026-03-02" },
];

export default function AdminAuditQueuePage() {
  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Admin Audit Queue
      </Typography>

      <Stack spacing={1.5} sx={{ maxWidth: 900 }}>
        {mockPendingPosts.map((post) => (
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
                User: {post.user} &bull; Date: {post.date}
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