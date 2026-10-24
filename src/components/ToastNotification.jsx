import React from "react";
import { useMarketplace } from "../context/MarketplaceContext";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function ToastNotification() {
  const { toast } = useMarketplace();

  if (!toast) return null;

  const isError = toast.type === "error";
  const isWarning = toast.type === "warning";

  const bg = isError ? "#FEE2E2" : isWarning ? "#FEF3C7" : "#ECFDF5";
  const border = isError ? "#FCA5A5" : isWarning ? "#FDE68A" : "#A7F3D0";
  const textColor = isError ? "#991B1B" : isWarning ? "#92400E" : "#065F46";
  const Icon = isError ? AlertCircle : isWarning ? Info : CheckCircle2;

  return (
    <div
      className="animate-fade-in"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        background: bg,
        border: `1.5px solid ${border}`,
        color: textColor,
        padding: "0.85rem 1.25rem",
        borderRadius: "14px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        maxWidth: "420px",
        fontSize: "0.9rem",
        fontWeight: 600
      }}
    >
      <Icon size={20} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{toast.text}</span>
    </div>
  );
}
