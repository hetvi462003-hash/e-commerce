import React, { useState, useEffect } from "react";
import {
  X,
  Copy,
  Check,
  Printer,
  ShieldCheck,
  MapPin,
  Clock,
  QrCode,
  Truck,
  DollarSign,
  Package,
  Phone,
  ArrowRight,
  CheckCircle2,
  Store
} from "lucide-react";
import { useMarketplace } from "../context/MarketplaceContext";

export default function QrCodeModal({ order, onClose }) {
  const { formatPrice } = useMarketplace();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState("47h 59m 40s");

  useEffect(() => {
    if (!order || order.type !== "PICKUP") return;
    const holdEnd = order.hold_until
      ? new Date(order.hold_until).getTime()
      : Date.now() + 48 * 3600 * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, holdEnd - now);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${mins}m ${secs}s`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [order]);

  if (!order) return null;

  const isPickup = order.type === "PICKUP";

  const copyPin = () => {
    if (order.pin_code) {
      navigator.clipboard.writeText(order.pin_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(5, 11, 20, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem"
      }}
      onClick={onClose}
    >
      <div
        className="modal-animate"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF",
          borderRadius: "28px",
          maxWidth: "500px",
          width: "100%",
          maxHeight: "92vh",
          overflowY: "auto",
          padding: "2.25rem",
          boxShadow: "0 25px 60px -10px rgba(0,0,0,0.4), 0 0 40px rgba(0, 229, 201, 0.15)",
          textAlign: "center",
          position: "relative",
          border: "1px solid rgba(226, 232, 240, 0.8)"
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            background: "#F1F5F9",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#64748B",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          title="Close Pass"
        >
          <X size={18} />
        </button>

        {isPickup ? (
          /* =========================================================================
             FLOW B: 48-HOUR RESERVE FOR STORE PICKUP DIGITAL PASS
             ========================================================================= */
          <>
            {/* Digital Pass Header Icon */}
            <div
              style={{
                background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
                width: "64px",
                height: "64px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#B45309",
                margin: "0 auto 1.25rem auto",
                boxShadow: "0 8px 20px rgba(245, 158, 11, 0.25)"
              }}
            >
              <QrCode size={34} />
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                color: "#00B49F",
                fontSize: "0.76rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.25rem"
              }}
            >
              <ShieldCheck size={14} />
              <span>OFFICIAL DIGITAL PASS • GRAND CAYMAN</span>
            </div>

            <h3 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0A1C36", marginBottom: "0.3rem" }}>
              Reserve for Pickup Pass
            </h3>
            <p style={{ color: "#64748B", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
              Order <strong>#{order.id}</strong> • {order.vendor_name}
            </p>

            {/* 4-DIGIT PIN CARD (Apple Wallet / Boarding Pass Style) */}
            <div
              style={{
                background: "linear-gradient(135deg, #050B14 0%, #0A1C36 100%)",
                color: "#FFFFFF",
                borderRadius: "20px",
                padding: "1.5rem",
                marginBottom: "1.25rem",
                boxShadow: "0 12px 28px rgba(10, 28, 54, 0.35)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                position: "relative"
              }}
            >
              <div
                style={{
                  fontSize: "0.76rem",
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "0.4rem",
                  fontWeight: 700
                }}
              >
                Your 4-Digit Pickup PIN Code
              </div>

              <div
                style={{
                  fontSize: "2.8rem",
                  fontWeight: 900,
                  letterSpacing: "0.35em",
                  color: "#FBBF24",
                  textShadow: "0 2px 14px rgba(245, 158, 11, 0.5)",
                  margin: "0.3rem 0"
                }}
              >
                {order.pin_code || "----"}
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginTop: "0.6rem" }}>
                <button
                  onClick={copyPin}
                  style={{
                    background: "rgba(255, 255, 255, 0.12)",
                    color: "#FFFFFF",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                    padding: "0.35rem 0.95rem",
                    borderRadius: "999px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    cursor: "pointer"
                  }}
                >
                  {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                  {copied ? "Copied to Clipboard!" : "Copy PIN"}
                </button>
              </div>
            </div>

            {/* QR Code SVG Visualizer */}
            <div
              style={{
                background: "#F8FAFC",
                border: "2px solid #E2E8F0",
                borderRadius: "20px",
                padding: "1.25rem",
                display: "inline-block",
                marginBottom: "1.25rem",
                boxShadow: "inset 0 2px 6px rgba(0,0,0,0.03)"
              }}
            >
              <svg width="130" height="130" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" fill="white" />
                {/* Outer Position Markers */}
                <rect x="5" y="5" width="28" height="28" rx="4" fill="#0A1C36" />
                <rect x="9" y="9" width="20" height="20" rx="2" fill="white" />
                <rect x="13" y="13" width="12" height="12" rx="1" fill="#00B49F" />

                <rect x="67" y="5" width="28" height="28" rx="4" fill="#0A1C36" />
                <rect x="71" y="9" width="20" height="20" rx="2" fill="white" />
                <rect x="75" y="13" width="12" height="12" rx="1" fill="#00B49F" />

                <rect x="5" y="67" width="28" height="28" rx="4" fill="#0A1C36" />
                <rect x="9" y="71" width="20" height="20" rx="2" fill="white" />
                <rect x="13" y="75" width="12" height="12" rx="1" fill="#00B49F" />

                {/* Pattern Elements */}
                <rect x="38" y="8" width="6" height="6" fill="#0A1C36" />
                <rect x="48" y="8" width="12" height="6" fill="#00B49F" />
                <rect x="38" y="20" width="12" height="6" fill="#0A1C36" />
                <rect x="54" y="20" width="6" height="12" fill="#00B49F" />
                <rect x="8" y="38" width="6" height="12" fill="#0A1C36" />
                <rect x="20" y="38" width="12" height="6" fill="#00B49F" />
                <rect x="38" y="38" width="24" height="24" rx="4" fill="#0A1C36" />
                <rect x="68" y="38" width="6" height="6" fill="#0A1C36" />
                <rect x="80" y="38" width="12" height="12" fill="#00B49F" />
                <rect x="38" y="68" width="12" height="6" fill="#0A1C36" />
                <rect x="54" y="68" width="12" height="12" fill="#00B49F" />
                <rect x="70" y="68" width="14" height="6" fill="#0A1C36" />
                <rect x="38" y="84" width="6" height="10" fill="#0A1C36" />
                <rect x="48" y="84" width="18" height="10" fill="#00B49F" />
                <rect x="72" y="84" width="22" height="10" fill="#0A1C36" />
              </svg>

              <div style={{ fontSize: "0.74rem", color: "#64748B", fontWeight: 700, marginTop: "0.5rem" }}>
                Scan at Stall Counter or Present 4-Digit PIN
              </div>
            </div>

            {/* Store Location & Live Countdown */}
            <div
              style={{
                background: "#F1F5F9",
                borderRadius: "16px",
                padding: "1rem 1.15rem",
                fontSize: "0.85rem",
                textAlign: "left",
                marginBottom: "1.25rem"
              }}
            >
              <div style={{ display: "flex", gap: "0.6rem", color: "#1E293B", marginBottom: "0.5rem" }}>
                <MapPin size={17} color="#00B49F" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>
                  <strong>Pickup Location:</strong> {order.pickup_location || "Physical Artisan Stall, Grand Cayman"}
                </span>
              </div>
              <div style={{ display: "flex", gap: "0.6rem", color: "#B45309" }}>
                <Clock size={17} style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>
                  <strong>Hold Window:</strong> Reserved for {timeLeft}
                </span>
              </div>
            </div>
          </>
        ) : (
          /* =========================================================================
             FLOW A: CASH ON DELIVERY (COD) COURIER CONFIRMATION SLIP
             ========================================================================= */
          <>
            {/* Courier Confirmation Header Icon */}
            <div
              style={{
                background: "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)",
                width: "64px",
                height: "64px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#065F46",
                margin: "0 auto 1.25rem auto",
                boxShadow: "0 8px 20px rgba(16, 185, 129, 0.25)"
              }}
            >
              <Truck size={34} />
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                color: "#059669",
                fontSize: "0.76rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.25rem"
              }}
            >
              <CheckCircle2 size={14} />
              <span>ISLAND COURIER DISPATCH • GRAND CAYMAN</span>
            </div>

            <h3 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0A1C36", marginBottom: "0.3rem" }}>
              Island Delivery Confirmed!
            </h3>
            <p style={{ color: "#64748B", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
              Order <strong>#{order.id}</strong> • {order.vendor_name}
            </p>

            {/* COD Cash Payable Highlight Box */}
            <div
              style={{
                background: "linear-gradient(135deg, #064E3B 0%, #065F46 100%)",
                color: "#FFFFFF",
                borderRadius: "20px",
                padding: "1.4rem",
                marginBottom: "1.25rem",
                boxShadow: "0 12px 28px rgba(6, 78, 59, 0.3)",
                border: "1px solid rgba(167, 243, 208, 0.2)",
                textAlign: "center"
              }}
            >
              <div
                style={{
                  fontSize: "0.76rem",
                  color: "#A7F3D0",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "0.35rem",
                  fontWeight: 700
                }}
              >
                Cash Due to Delivery Courier on Arrival
              </div>

              <div
                style={{
                  fontSize: "2.4rem",
                  fontWeight: 900,
                  color: "#34D399",
                  textShadow: "0 2px 14px rgba(52, 211, 153, 0.4)",
                  margin: "0.2rem 0"
                }}
              >
                {formatPrice(order.total_amount)}
              </div>

              <p style={{ fontSize: "0.8rem", color: "#E6FFFA", margin: "0.4rem 0 0 0", opacity: 0.9 }}>
                💵 Cash on Delivery (Pay driver in cash: $KYD or $USD upon arrival)
              </p>
            </div>

            {/* Delivery Destination & Contact Details */}
            <div
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "16px",
                padding: "1.1rem 1.25rem",
                fontSize: "0.85rem",
                textAlign: "left",
                marginBottom: "1.25rem"
              }}
            >
              <div style={{ display: "flex", gap: "0.6rem", color: "#1E293B", marginBottom: "0.65rem" }}>
                <MapPin size={17} color="#059669" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <strong style={{ color: "#0F172A", display: "block" }}>Deliver To:</strong>
                  <span style={{ color: "#475569" }}>
                    {order.delivery_address || "Seven Mile Beach, Grand Cayman"}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.6rem", color: "#1E293B", marginBottom: "0.65rem" }}>
                <Phone size={17} color="#059669" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <strong style={{ color: "#0F172A", display: "block" }}>Customer Phone:</strong>
                  <span style={{ color: "#475569" }}>
                    {order.customer_phone || "+1 (345) 926-5544"} ({order.customer_name || "Customer"})
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.6rem", color: "#0284C7" }}>
                <Clock size={17} style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <strong style={{ color: "#0369A1", display: "block" }}>Estimated Island Delivery:</strong>
                  <span style={{ color: "#0284C7" }}>Within 24 - 48 Hours via Island Logistics</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          <button
            onClick={() => window.print()}
            className="btn-outline"
            style={{
              width: "100%",
              padding: "0.85rem",
              fontSize: "0.92rem",
              borderRadius: "14px",
              fontWeight: 800,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem"
            }}
          >
            <Printer size={16} /> {isPickup ? "Print or Save Pickup Pass (PDF)" : "Print Courier Delivery Slip (PDF)"}
          </button>

          <button
            onClick={onClose}
            className="btn-primary"
            style={{
              width: "100%",
              padding: "0.85rem",
              fontSize: "0.92rem",
              borderRadius: "14px",
              fontWeight: 800,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem"
            }}
          >
            Track Status in My Orders <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
