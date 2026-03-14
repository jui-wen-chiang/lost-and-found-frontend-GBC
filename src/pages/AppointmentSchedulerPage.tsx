import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";

const mockSlots: Record<string, string[]> = {
  "2026-03-10": ["10:00 AM", "11:00 AM", "1:00 PM"],
  "2026-03-11": ["9:30 AM", "12:00 PM", "2:30 PM"],
  "2026-03-12": ["10:30 AM", "1:30 PM", "3:00 PM"],
};

export default function AppointmentSchedulerPage() {
  const navigate = useNavigate();
  const { itemId } = useParams();

  const dates = useMemo(() => Object.keys(mockSlots), []);
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedTime, setSelectedTime] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!selectedTime) {
      setError("Please select a time slot.");
      return;
    }

    navigate("/appointments/confirm", {
      state: {
        itemId,
        date: selectedDate,
        time: selectedTime,
        location: "Casa Loma Campus Security Office",
      },
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 0.5 }}>
        Schedule Appointment
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Choose a pickup time for item <strong>{itemId || "N/A"}</strong>.
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Select Date
            </Typography>
            <FormControl size="small" sx={{ minWidth: 240 }}>
              <Select
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime("");
                  setError("");
                }}
              >
                {dates.map((date) => (
                  <MenuItem key={date} value={date}>
                    {date}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Available Time Slots
            </Typography>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              {mockSlots[selectedDate].map((slot) => {
                const active = selectedTime === slot;
                return (
                  <Chip
                    key={slot}
                    label={slot}
                    variant={active ? "filled" : "outlined"}
                    color={active ? "primary" : "default"}
                    onClick={() => {
                      setSelectedTime(slot);
                      setError("");
                    }}
                    sx={{ fontWeight: 700 }}
                  />
                );
              })}
            </Stack>
            {error && (
              <Alert severity="error" sx={{ mt: 1.5 }}>
                {error}
              </Alert>
            )}
          </Box>

          <Box>
            <Button variant="contained" onClick={handleContinue}>
              Continue
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}