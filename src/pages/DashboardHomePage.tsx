import { useMemo } from "react";
import { CircularProgress, Alert, Button } from "@mui/material";
import { useItems } from "../hooks/useItems";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage, isAuthError } from "../utils/errorMessages";

export default function DashboardHomePage() {
  const { user } = useAuth();
  const { data: apiItems, isLoading, error } = useItems();

  const stats = useMemo(() => {
    const mine = (apiItems ?? []).filter((i) => i.owner === user?.id);
    return [
      { label: "Total Reports", value: mine.length },
      { label: "Pending", value: mine.filter((i) => i.status === "pending").length },
      { label: "Found", value: mine.filter((i) => i.item_type === "found").length },
      { label: "Completed", value: mine.filter((i) => i.status === "completed").length },
    ];
  }, [apiItems, user]);

  if (isLoading) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert severity={isAuthError(error) ? 'info' : 'error'}
          action={isAuthError(error) ? <Button color="inherit" size="small" href="/login">Sign In</Button> : undefined}
        >
          {getErrorMessage(error, 'Failed to load dashboard data.')}
        </Alert>
      </div>
    );
  }

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