import React, { useState } from "react";
import { X, Lock, Smartphone, ArrowRight, ShieldCheck, UserCheck, Zap, Compass } from "lucide-react";
import { useMarketplace } from "../context/MarketplaceContext";

export default function CheckoutAuthModal({ isOpen, onClose, onContinueToCheckout }) {
  const { customerPhoneSession, setCustomerPhoneSession, updateCustomerProfile, showToast } = useMarketplace();
  const [phoneOrEmail, setPhoneOrEmail] = useState(customerPhoneSession || "");
  const [customerName, setCustomerName] = useState("");

  if (!isOpen) return null;

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) {
      showToast("Please enter your Phone Number or Email.", "warning");
      return;
    }

    if (updateCustomerProfile) {
      updateCustomerProfile({
        phone: phoneOrEmail.trim(),
        name: customerName.trim()
      });
    } else {
      setCustomerPhoneSession(phoneOrEmail.trim());
    }

    showToast(`Signed in as ${phoneOrEmail.trim()}! Proceeding to checkout...`, "success");
    onClose();
    onContinueToCheckout({ phone: phoneOrEmail.trim(), name: customerName.trim() });
  };

  const handleGuestCheckout = () => {
    showToast("Continuing as Fast Checkout...", "info");
    onClose();
    onContinueToCheckout({ isGuest: true, phone: phoneOrEmail.trim(), name: customerName.trim() });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(5, 11, 20, 0.8)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        padding: "1rem"
      }}
      onClick={onClose}
    >
      <div
        className="modal-animate"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "460px",
          overflow: "hidden",
          boxShadow: "0 25px 60px -10px rgba(0,0,0,0.4), 0 0 40px rgba(0, 229, 201, 0.15)",
          border: "1px solid #E2E8F0",
          position: "relative"
        }}
      >
        {/* Top Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #050B14 0%, #0A1C36 100%)",
            color: "#FFFFFF",
            padding: "1.75rem",
            position: "relative"
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#CBD5E1",
              cursor: "pointer"
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#00E5C9", fontSize: "0.76rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>
            <Lock size={13} />
            <span>Secure Island Checkout</span>
          </div>

          <h3 style={{ fontSize: "1.45rem", fontWeight: 900, margin: 0, color: "#FFFFFF", lineHeight: 1.2 }}>
            Sign In to Complete Your Order
          </h3>
          <p style={{ fontSize: "0.82rem", color: "#94A3B8", marginTop: "0.4rem", marginBottom: 0, lineHeight: 1.4 }}>
            Sign in to track your 4-digit pickup PIN code, live courier updates, and order history.
          </p>
        </div>

        {/* Form Body */}
        <div style={{ padding: "1.75rem" }}>
          
          <form onSubmit={handleSignInSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.35rem" }}>
                Mobile Number or Email *
              </label>
              <div style={{ position: "relative" }}>
                <Smartphone size={17} color="#94A3B8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  required
                  placeholder="+1 (345) 926-5544 or name@email.com"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  style={{
                    width: "100%",
                    paddingLeft: "2.4rem",
                    paddingRight: "0.85rem",
                    paddingTop: "0.75rem",
                    paddingBottom: "0.75rem",
                    borderRadius: "12px",
                    border: "1.5px solid #CBD5E1",
                    fontSize: "0.9rem"
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.35rem" }}>
                Your Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. David Sterling"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 0.85rem",
                  borderRadius: "12px",
                  border: "1.5px solid #CBD5E1",
                  fontSize: "0.9rem"
                }}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                width: "100%",
                padding: "0.85rem",
                borderRadius: "14px",
                fontSize: "0.95rem",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginTop: "0.25rem"
              }}
            >
              <UserCheck size={18} />
              <span>Sign In & Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", margin: "1.5rem 0", color: "#94A3B8", fontSize: "0.78rem", fontWeight: 700 }}>
            <div style={{ flex: 1, height: "1px", background: "#E2E8F0" }}></div>
            <span style={{ padding: "0 0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>OR FAST CHECKOUT</span>
            <div style={{ flex: 1, height: "1px", background: "#E2E8F0" }}></div>
          </div>

          {/* Continue as Guest Button */}
          <button
            type="button"
            onClick={handleGuestCheckout}
            style={{
              width: "100%",
              background: "#F8FAFC",
              border: "1.5px dashed #CBD5E1",
              color: "#334155",
              padding: "0.8rem",
              borderRadius: "14px",
              fontSize: "0.88rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#00A896";
              e.currentTarget.style.color = "#00A896";
              e.currentTarget.style.background = "#F0FDFA";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#CBD5E1";
              e.currentTarget.style.color = "#334155";
              e.currentTarget.style.background = "#F8FAFC";
            }}
          >
            <Zap size={16} color="#F59E0B" />
            <span>Continue as Guest (No Password Required)</span>
          </button>

          {/* Trust Guarantees */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginTop: "1.25rem", fontSize: "0.75rem", color: "#64748B" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
              <ShieldCheck size={14} color="#166534" /> 100% Private Data
            </span>
            <span>•</span>
            <span>🌴 Grand Cayman Local</span>
          </div>

        </div>

      </div>
    </div>
  );
}
