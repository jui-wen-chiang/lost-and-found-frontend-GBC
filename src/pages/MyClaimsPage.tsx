import React from "react";
import { Link } from "react-router-dom";

function StatusTag({ status }: { status: string }) {
  let color = "#f59e0b";
  if (status === "Approved") color = "#16a34a";
  if (status === "Rejected") color = "#ef4444";

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "999px",
        background: `${color}15`,
        color,
        fontWeight: 700,
        fontSize: "12px",
      }}
    >
      {status}
    </span>
  );
}

const mockClaims = [
  { id: 101, itemId: 12, title: "Wallet", status: "Pending" },
  { id: 102, itemId: 9, title: "Phone", status: "Approved" },
  { id: 103, itemId: 4, title: "AirPods", status: "Rejected" },
];

export default function MyClaimsPage() {
  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ marginBottom: 16 }}>My Claim Requests</h2>

      <div style={{ display: "grid", gap: 12, maxWidth: 720 }}>
        {mockClaims.map((c) => (
          <div
            key={c.id}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 800 }}>{c.title}</div>
              <div style={{ color: "#666", fontSize: 14 }}>
                Claim ID: {c.id} • Item ID: {c.itemId}
              </div>
              <div style={{ marginTop: 6 }}>
                <Link to={`/claims/new/${c.itemId}`}>Open claim form</Link>
              </div>
            </div>

            <StatusTag status={c.status} />
          </div>
        ))}
      </div>
    </div>
  );
}