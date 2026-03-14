import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export default function AppointmentConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const appointment = location.state;

  const [cancelled, setCancelled] = useState(false);

  if (!appointment) {
    return (
      <Container sx={{ py: 3 }}>
        <Typography variant="h5">No appointment data found</Typography>
        <Button
          variant="outlined"
          sx={{ mt: 1.5 }}
          onClick={() => navigate("/appointments/schedule/12")}
        >
          Go to Scheduler
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 0.5 }}>
        Appointment Confirmation
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Review and manage your appointment details.
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        {!cancelled ? (
          <Stack spacing={1.5}>
            <Typography><strong>Item ID:</strong> {appointment.itemId || "N/A"}</Typography>
            <Typography><strong>Date:</strong> {appointment.date}</Typography>
            <Typography><strong>Time:</strong> {appointment.time}</Typography>
            <Typography><strong>Location:</strong> {appointment.location}</Typography>
            <Typography sx={{ color: "success.main", fontWeight: 700 }}>
              Status: Confirmed
            </Typography>

            <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
              <Button
                variant="outlined"
                onClick={() =>
                  navigate(`/appointments/schedule/${appointment.itemId || 12}`)
                }
              >
                Modify Appointment
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => setCancelled(true)}
              >
                Cancel Appointment
              </Button>
            </Stack>
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            <Alert severity="error">Appointment Cancelled</Alert>
            <Typography variant="body2">
              You can schedule a new appointment if needed.
            </Typography>
            <Button
              variant="outlined"
              sx={{ width: "fit-content" }}
              onClick={() =>
                navigate(`/appointments/schedule/${appointment.itemId || 12}`)
              }
            >
              Schedule Again
            </Button>
          </Stack>
        )}
      </Paper>
    </Container>
  );
}