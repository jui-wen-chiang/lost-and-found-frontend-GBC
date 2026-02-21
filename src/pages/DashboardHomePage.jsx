import React from "react";
console.log("DashboardHomePage loaded");

export default function DashboardHomePage() {
  const stats = [
    { label: "Total Reports", value: 5 },
    { label: "In Progress", value: 2 },
    { label: "Found", value: 1 },
    { label: "Expired", value: 2 },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ marginBottom: "16px" }}>Personal Dashboard</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "16px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ fontSize: "14px", color: "#666" }}>{s.label}</div>
            <div style={{ fontSize: "28px", fontWeight: 700 }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}