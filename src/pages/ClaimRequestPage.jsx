import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function StatusTag({ status }) {
  let color = "#f59e0b"; // Pending = orange
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

export default function ClaimRequestPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const initial = useMemo(
    () => ({
      fullName: "",
      studentId: "",
      email: "",
      phone: "",
      description: "",
      verificationAnswer: "",
    }),
    []
  );

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { status, message }

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.studentId.trim()) e.studentId = "Student ID is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email.";

    if (!form.description.trim()) e.description = "Please describe the item.";
    if (!form.verificationAnswer.trim())
      e.verificationAnswer = "Please answer the verification question.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setResult(null);

    if (!validate()) return;

    setSubmitting(true);

    try {
      // Mock submit (replace later with backend API call)
      // Example payload:
      // { itemId, ...form }
      console.log("Submitting claim request:", { itemId, ...form });

      // Simulate request delay
      await new Promise((r) => setTimeout(r, 700));

      setResult({
        status: "Pending",
        message: "Claim request submitted. Status: Pending.",
      });

      // Optional: navigate to My Claims after submit
      // navigate("/claims");
    } catch (err) {
      console.error(err);
      setResult({
        status: "Rejected",
        message: "Something went wrong submitting your request.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: 720, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 8 }}>Claim Request</h2>
      <p style={{ marginTop: 0, color: "#555" }}>
        Item ID: <strong>{itemId}</strong>
      </p>

      <form
        onSubmit={onSubmit}
        style={{
          background: "#fff",
          padding: 16,
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          display: "grid",
          gap: 12,
        }}
      >
        <div>
          <label style={{ fontWeight: 600 }}>Full Name *</label>
          <input
            value={form.fullName}
            onChange={(e) => setField("fullName", e.target.value)}
            placeholder="Your name"
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
          {errors.fullName && (
            <div style={{ color: "#ef4444", fontSize: 13 }}>{errors.fullName}</div>
          )}
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>Student ID *</label>
          <input
            value={form.studentId}
            onChange={(e) => setField("studentId", e.target.value)}
            placeholder="e.g., 101234567"
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
          {errors.studentId && (
            <div style={{ color: "#ef4444", fontSize: 13 }}>{errors.studentId}</div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ fontWeight: 600 }}>Email *</label>
            <input
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder="name@email.com"
              style={{ width: "100%", padding: 10, marginTop: 6 }}
            />
            {errors.email && (
              <div style={{ color: "#ef4444", fontSize: 13 }}>{errors.email}</div>
            )}
          </div>

          <div>
            <label style={{ fontWeight: 600 }}>Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              placeholder="optional"
              style={{ width: "100%", padding: 10, marginTop: 6 }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>Describe the item *</label>
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Color, brand, unique marks, contents, etc."
            rows={4}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
          {errors.description && (
            <div style={{ color: "#ef4444", fontSize: 13 }}>{errors.description}</div>
          )}
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>
            Verification Question * (example)
          </label>
          <input
            value={form.verificationAnswer}
            onChange={(e) => setField("verificationAnswer", e.target.value)}
            placeholder="What is one unique detail only you know?"
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
          {errors.verificationAnswer && (
            <div style={{ color: "#ef4444", fontSize: 13 }}>
              {errors.verificationAnswer}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "none",
            fontWeight: 700,
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Submitting..." : "Submit Claim Request"}
        </button>

        {result && (
          <div
            style={{
              padding: 12,
              borderRadius: 10,
              background: "#f8fafc",
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <StatusTag status={result.status} />
            <span>{result.message}</span>
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Back
          </button>

          <button
            type="button"
            onClick={() => navigate("/claims")}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            View My Claims
          </button>
        </div>
      </form>
    </div>
  );
}