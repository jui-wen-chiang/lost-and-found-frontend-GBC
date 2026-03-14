import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminAuditDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleApprove = () => {
    setDecision("Approved");
    setSubmitted(true);
  };

  const handleReject = () => {
    if (!reason.trim()) return;
    setDecision("Rejected");
    setSubmitted(true);
  };

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: 8 }}>Post Audit Detail</h2>
      <p style={{ color: "#666" }}>Post ID: {id}</p>

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
        <div><strong>Item:</strong> Black Wallet</div>
        <div><strong>Description:</strong> Black leather wallet found near library entrance.</div>
        <div><strong>Location:</strong> Casa Loma</div>
        <div><strong>Submitted By:</strong> John</div>

        {!submitted ? (
          <>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handleApprove}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "none",
                  background: "#16a34a",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Approve
              </button>

              <button
                type="button"
                onClick={handleReject}
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
                Reject
              </button>
            </div>

            <div>
              <label style={{ fontWeight: 700 }}>Reason for rejection</label>
              <textarea
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason if rejecting..."
                style={{
                  width: "100%",
                  marginTop: 8,
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #ddd",
                }}
              />
            </div>
          </>
        ) : (
          <div
            style={{
              padding: 12,
              borderRadius: 10,
              background: "#f8fafc",
              fontWeight: 700,
            }}
          >
            Decision submitted: {decision}
            {decision === "Rejected" && reason ? ` — Reason: ${reason}` : ""}
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate("/admin/audit")}
          style={{
            width: "fit-content",
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Back to Queue
        </button>
      </div>
    </div>
  );
}