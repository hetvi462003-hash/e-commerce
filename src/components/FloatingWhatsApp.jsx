import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { CENTRAL_MARKETPLACE_WHATSAPP, CENTRAL_MARKETPLACE_PHONE_DISPLAY } from "../context/MarketplaceContext";

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);

  const defaultMessage = "Hello CaymanBazaar team! I am browsing the island marketplace and would like some assistance.";
  const waUrl = `https://wa.me/${CENTRAL_MARKETPLACE_WHATSAPP}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end"
      }}
    >
      {/* Popover Card */}
      {isOpen && (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            boxShadow: "0 14px 40px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(0, 0, 0, 0.06)",
            width: "320px",
            marginBottom: "12px",
            overflow: "hidden",
            animation: "fadeIn 0.25s ease-out"
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #075E54 0%, #128C7E 50%, #25D366 100%)",
              color: "#FFFFFF",
              padding: "1rem 1.15rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div
                style={{
                  background: "#FFFFFF",
                  color: "#128C7E",
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900
                }}
              >
                <MessageCircle size={20} color="#25D366" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.92rem", lineHeight: 1.2 }}>
                  CaymanBazaar Concierge
                </div>
                <div style={{ fontSize: "0.72rem", color: "#E0F2FE", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#22C55E",
                      display: "inline-block"
                    }}
                  />
                  Online Now • Grand Cayman (345)
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "rgba(0, 0, 0, 0.2)",
                border: "none",
                color: "#FFFFFF",
                borderRadius: "50%",
                width: "26px",
                height: "26px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: "1.15rem", background: "#F8FAFC" }}>
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "14px",
                padding: "0.85rem 1rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                fontSize: "0.85rem",
                color: "#334155",
                lineHeight: 1.45,
                border: "1px solid #E2E8F0",
                marginBottom: "1rem"
              }}
            >
              👋 Hi there! Need help finding Caymanite jewelry, local rum cakes, or placing a WhatsApp order? We're here to help!
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#25D366",
                color: "#FFFFFF",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.55rem",
                padding: "0.75rem",
                borderRadius: "12px",
                fontWeight: 800,
                fontSize: "0.9rem",
                boxShadow: "0 4px 14px rgba(37, 211, 102, 0.4)",
                transition: "all 0.2s"
              }}
            >
              <MessageCircle size={18} />
              <span>Start WhatsApp Chat</span>
            </a>

            <div style={{ textAlign: "center", fontSize: "0.7rem", color: "#94A3B8", marginTop: "0.5rem" }}>
              Local Grand Cayman Support: {CENTRAL_MARKETPLACE_PHONE_DISPLAY}
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "#25D366",
          color: "#FFFFFF",
          border: "none",
          width: "58px",
          height: "58px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 24px rgba(37, 211, 102, 0.45)",
          cursor: "pointer",
          position: "relative",
          transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={30} color="#FFFFFF" />
        
        {/* Pulse Green Indicator */}
        <span
          style={{
            position: "absolute",
            top: "2px",
            right: "2px",
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            background: "#22C55E",
            border: "2px solid #FFFFFF",
            boxShadow: "0 0 8px #22C55E"
          }}
        />
      </button>
    </div>
  );
}
