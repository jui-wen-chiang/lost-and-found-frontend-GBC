import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const mockSlots = {
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
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: 8 }}>Schedule Appointment</h2>
      <p style={{ color: "#666" }}>
        Choose a pickup time for item <strong>{itemId || "N/A"}</strong>.
      </p>

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          display: "grid",
          gap: 20,
        }}
      >
        <div>
          <label style={{ fontWeight: 700 }}>Select Date</label>
          <select
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTime("");
              setError("");
            }}
            style={{
              display: "block",
              marginTop: 8,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
              width: "100%",
              maxWidth: 320,
            }}
          >
            {dates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontWeight: 700 }}>Available Time Slots</label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 12,
            }}
          >
            {mockSlots[selectedDate].map((slot) => {
              const active = selectedTime === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => {
                    setSelectedTime(slot);
                    setError("");
                  }}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 999,
                    border: active ? "2px solid #2563eb" : "1px solid #ddd",
                    background: active ? "#eff6ff" : "#fff",
                    color: active ? "#2563eb" : "#111",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {slot}
                </button>
              );
            })}
          </div>
          {error && <div style={{ color: "#ef4444", marginTop: 10 }}>{error}</div>}
        </div>

        <div>
          <button
            type="button"
            onClick={handleContinue}
            style={{
              padding: "12px 18px",
              borderRadius: 10,
              border: "none",
              background: "#111827",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}