"use client";

import { useMemo, useState } from "react";
import { extendMembership } from "@/lib/firebase";
import { formatDateTime } from "@/lib/datetime";

const MONTH_OPTIONS = [1, 3, 12];

export default function ExtendMembershipModal({
  isOpen,
  onClose,
  session,
}) {
  const [monthsAdded, setMonthsAdded] = useState(1);
  const [receiptRef, setReceiptRef] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState(null);

  const currentExpiry = session?.membershipSnapshot?.expiresAt ?? null;

  const normalizedReceiptRef = receiptRef.trim();
  const isReceiptValid = normalizedReceiptRef.length >= 3;

  const title = useMemo(() => {
    return session?.userSnapshot?.displayName || "Unnamed member";
  }, [session]);

  if (!isOpen || !session) return null;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isReceiptValid) {
      setSubmitError("Please enter a valid POS receipt reference.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const data = await extendMembership({
        userId: session.userId,
        monthsAdded,
        receiptRef: normalizedReceiptRef,
      });

      setResult(data);
    } catch (error) {
      console.error("Failed to extend membership:", error);

      setSubmitError(
        error?.message || "Could not extend membership. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setMonthsAdded(1);
    setReceiptRef("");
    setSubmitError("");
    setResult(null);
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.7)",
        display: "grid",
        placeItems: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          borderRadius: "16px",
          border: "1px solid #333",
          background: "#111",
          color: "#fff",
          padding: "1.25rem",
          display: "grid",
          gap: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h3 style={{ margin: 0 }}>Extend membership</h3>
            <p style={{ margin: "0.4rem 0 0 0", opacity: 0.85 }}>
              {title}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            style={{
              border: "1px solid #444",
              background: "transparent",
              color: "inherit",
              borderRadius: "8px",
              padding: "0.45rem 0.7rem",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>

        {result ? (
          <div
            style={{
              display: "grid",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                border: "1px solid #1f7a1f",
                background: "rgba(31,122,31,0.12)",
                borderRadius: "12px",
                padding: "0.9rem",
              }}
            >
              <p style={{ margin: 0, fontWeight: 700 }}>
                Membership updated successfully.
              </p>
              <p style={{ margin: "0.5rem 0 0 0" }}>
                Added <strong>{result.monthsAdded}</strong> month
                {result.monthsAdded > 1 ? "s" : ""}.
              </p>
              <p style={{ margin: "0.35rem 0 0 0" }}>
                New expiry:{" "}
                <strong>{formatDateTime(new Date(result.newExpiry))}</strong>
              </p>
              <p style={{ margin: "0.35rem 0 0 0" }}>
                Receipt ref: <strong>{result.receiptRef}</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              style={{
                border: "1px solid #444",
                background: "transparent",
                color: "inherit",
                borderRadius: "10px",
                padding: "0.7rem 1rem",
                cursor: "pointer",
              }}
            >
              Done
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gap: "1rem",
            }}
          >
            <div
              style={{
                border: "1px solid #2d2d2d",
                borderRadius: "12px",
                padding: "0.9rem",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <p style={{ margin: 0 }}>
                <strong>Current expiry:</strong> {formatDateTime(currentExpiry)}
              </p>
            </div>

            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label htmlFor="monthsAdded">
                <strong>Add months</strong>
              </label>
              <select
                id="monthsAdded"
                value={monthsAdded}
                onChange={(event) => setMonthsAdded(Number(event.target.value))}
                disabled={submitting}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: "1px solid #444",
                  background: "transparent",
                  color: "inherit",
                }}
              >
                {MONTH_OPTIONS.map((value) => (
                  <option key={value} value={value} style={{ color: "#000" }}>
                    {value} month{value > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label htmlFor="receiptRef">
                <strong>POS receipt ref</strong>
              </label>
              <input
                id="receiptRef"
                type="text"
                value={receiptRef}
                onChange={(event) => setReceiptRef(event.target.value)}
                disabled={submitting}
                placeholder="e.g. POS-10482"
                required
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: "1px solid #444",
                  background: "transparent",
                  color: "inherit",
                }}
              />
              <p style={{ margin: 0, opacity: 0.75, fontSize: "0.9rem" }}>
                A valid POS receipt reference is required before membership can be extended.
              </p>
            </div>

            {submitError ? (
              <p
                style={{
                  margin: 0,
                  color: "#ffb3b3",
                }}
              >
                {submitError}
              </p>
            ) : null}

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                style={{
                  border: "1px solid #444",
                  background: "transparent",
                  color: "inherit",
                  borderRadius: "10px",
                  padding: "0.7rem 1rem",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting || !isReceiptValid}
                style={{
                  border: "1px solid #444",
                  background: "rgba(255,255,255,0.08)",
                  color: "inherit",
                  borderRadius: "10px",
                  padding: "0.7rem 1rem",
                  cursor:
                    submitting || !isReceiptValid ? "not-allowed" : "pointer",
                  opacity: submitting || !isReceiptValid ? 0.6 : 1,
                }}
              >
                {submitting ? "Updating..." : "Extend membership"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}