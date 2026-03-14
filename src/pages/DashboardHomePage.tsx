import { useMemo } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useItems } from "../hooks/useItems";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage, isAuthError } from "../utils/errorMessages";

export default function DashboardHomePage() {
  const { user } = useAuth();
  const { data: apiItems, isLoading, error } = useItems();

  const stats = useMemo(() => {
    const mine = (apiItems ?? []).filter((i) => i.owner === user?.id);
    return [
      { label: "Total Reports", value: mine.length },
      { label: "Pending", value: mine.filter((i) => i.status === "pending").length },
      { label: "Found", value: mine.filter((i) => i.item_type === "found").length },
      { label: "Completed", value: mine.filter((i) => i.status === "completed").length },
    ];
  }, [apiItems, user]);

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
        <Alert
          severity={isAuthError(error) ? "info" : "error"}
          action={
            isAuthError(error) ? (
              <Button color="inherit" size="small" href="/login">
                Sign In
              </Button>
            ) : undefined
          }
        >
          {getErrorMessage(error, "Failed to load dashboard data.")}
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Personal Dashboard
      </Typography>

      <Grid container spacing={2}>
        {stats.map((s) => (
          <Grid size={{ xs: 6, sm: 3 }} key={s.label}>
            <Paper sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="body2" color="text.secondary">
                {s.label}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {s.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}