import React from "react";
import { Link } from "react-router-dom";

const mockPendingPosts = [
  { id: 201, title: "Black Wallet", user: "John", date: "2026-03-01" },
  { id: 202, title: "Blue Backpack", user: "Sara", date: "2026-03-02" },
  { id: 203, title: "Student Card", user: "Alex", date: "2026-03-02" },
];

export default function AdminAuditQueuePage() {
  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ marginBottom: 16 }}>Admin Audit Queue</h2>

      <div style={{ display: "grid", gap: 12, maxWidth: 900 }}>
        {mockPendingPosts.map((post) => (
          <div
            key={post.id}
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
              <div style={{ fontWeight: 800 }}>{post.title}</div>
              <div style={{ color: "#666", fontSize: 14 }}>
                User: {post.user} • Date: {post.date}
              </div>
            </div>

            <Link to={`/admin/audit/${post.id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}