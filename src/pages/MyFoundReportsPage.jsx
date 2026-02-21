import React from "react";

const foundReports = [
  { id: 1, title: "Found Keys", location: "Casa Loma", status: "Pending Claim" },
  { id: 2, title: "Found Jacket", location: "St. James", status: "Returned" },
];

function StatusTag({ status }) {
  const color = status === "Returned" ? "#16a34a" : "#f59e0b";

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "999px",
        background: `${color}15`,
        color,
        fontWeight: 600,
        fontSize: "12px",
      }}
    >
      {status}
    </span>
  );
}

// ✅ IMPORTANT: default export
export default function MyFoundReportsPage() {
  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ marginBottom: "16px" }}>My Found Item Reports</h2>

      <div style={{ display: "grid", gap: "12px" }}>
        {foundReports.map((r) => (
          <div
            key={r.id}
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "16px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>{r.title}</div>
              <div style={{ color: "#666", fontSize: "14px" }}>
                Location: {r.location}
              </div>
            </div>

            <StatusTag status={r.status} />
          </div>
        ))}
      </div>
    </div>
  );
}