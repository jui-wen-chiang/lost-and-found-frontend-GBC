import React from "react";

const lostReports = [
  { id: 1, title: "Lost Wallet", location: "Casa Loma", status: "In-progress" },
  { id: 2, title: "Lost Phone", location: "St. James", status: "Found" },
  { id: 3, title: "Lost Notebook", location: "Waterfront", status: "Expired" },
];

function StatusTag({ status }) {
  let color = "#3b82f6";

  if (status === "Found") color = "#16a34a";
  if (status === "Expired") color = "#ef4444";

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

// ✅ IMPORTANT: DEFAULT EXPORT
export default function MyLostReportsPage() {
  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ marginBottom: "16px" }}>My Lost Item Reports</h2>

      <div style={{ display: "grid", gap: "12px" }}>
        {lostReports.map((r) => (
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