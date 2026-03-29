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
import { useCreateAppointment } from "../hooks/useAppointments";

function getUpcomingSlots(): Record<string, string[]> {
  const slots: Record<string, string[]> = {};
  const times = [
    ["10:00 AM", "11:00 AM", "1:00 PM"],
    ["9:30 AM", "12:00 PM", "2:30 PM"],
    ["10:30 AM", "1:30 PM", "3:00 PM"],
  ];
  for (let i = 0; i < 3; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const key = d.toISOString().slice(0, 10);
    slots[key] = times[i];
  }
  return slots;
}

function toISODateTime(date: string, time12: string): string {
  const [timePart, meridiem] = time12.split(" ");
  let [h, m] = timePart.split(":").map(Number);
  if (meridiem === "PM" && h !== 12) h += 12;
  if (meridiem === "AM" && h === 12) h = 0;
  return `${date}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
}

export default function AppointmentSchedulerPage() {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const createAppointment = useCreateAppointment();

  const defaultSlots = useMemo(() => getUpcomingSlots(), []);
  const dates = useMemo(() => Object.keys(defaultSlots), [defaultSlots]);
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedTime, setSelectedTime] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!selectedTime) {
      setError("Please select a time slot.");
      return;
    }

    const scheduled_at = toISODateTime(selectedDate, selectedTime);

    createAppointment.mutate(
      { claim: Number(itemId), scheduled_at },
      {
        onSuccess: () => {
          navigate("/appointments/confirm", {
            state: {
              itemId,
              date: selectedDate,
              time: selectedTime,
              location: "Casa Loma Campus Security Office",
            },
          });
        },
        onError: () => {
          setError("Failed to schedule appointment. Please try again.");
        },
      }
    );
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
              {defaultSlots[selectedDate].map((slot) => {
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
            <Button variant="contained" onClick={handleContinue} disabled={createAppointment.isPending}>
              {createAppointment.isPending ? "Scheduling…" : "Continue"}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}