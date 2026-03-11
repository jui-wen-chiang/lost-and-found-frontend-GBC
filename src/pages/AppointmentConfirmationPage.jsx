import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AppointmentConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const appointment = location.state;

  const [cancelled, setCancelled] = useState(false);

  if (!appointment) {
    return (
      <div style={{ padding: "24px" }}>
        <h2>No appointment data found</h2>
        <button
          onClick={() => navigate("/appointments/schedule/12")}
          style={{
            marginTop: 12,
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Go to Scheduler
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "860px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: 8 }}>Appointment Confirmation</h2>
      <p style={{ color: "#666" }}>
        Review and manage your appointment details.
      </p>

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          display: "grid",
          gap: 14,
        }}
      >
        {!cancelled ? (
          <>
            <div><strong>Item ID:</strong> {appointment.itemId || "N/A"}</div>
            <div><strong>Date:</strong> {appointment.date}</div>
            <div><strong>Time:</strong> {appointment.time}</div>
            <div><strong>Location:</strong> {appointment.location}</div>
            <div style={{ color: "#16a34a", fontWeight: 700 }}>
              Status: Confirmed
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() =>
                  navigate(`/appointments/schedule/${appointment.itemId || 12}`)
                }
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  background: "#fff",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Modify Appointment
              </button>

              <button
                type="button"
                onClick={() => setCancelled(true)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "none",
                  background: "#ef4444",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Cancel Appointment
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ color: "#ef4444", fontWeight: 700, fontSize: 18 }}>
              Appointment Cancelled
            </div>
            <div>You can schedule a new appointment if needed.</div>

            <button
              type="button"
              onClick={() =>
                navigate(`/appointments/schedule/${appointment.itemId || 12}`)
              }
              style={{
                width: "fit-content",
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "#fff",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Schedule Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}