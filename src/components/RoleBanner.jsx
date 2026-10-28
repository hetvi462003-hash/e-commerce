import React, { useState, useEffect } from "react";
import { useMarketplace } from "../context/MarketplaceContext";
import {
  Store,
  ShieldCheck,
  User,
  Clock,
  ExternalLink,
  LogOut,
  ChevronDown
} from "lucide-react";

export default function RoleBanner({ setActiveTab }) {
  const {
    userRole,
    setUserRole,
    activeVendorId,
    setActiveVendorId,
    vendors,
    activeVendor,
    currency,
    setCurrency,
    showToast,
    openAuthModal,
    isCustomerLoggedIn,
    customerDisplayName,
    clearCustomerSession
  } = useMarketplace();

  const [caymanTime, setCaymanTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: "America/Cayman",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      };
      try {
        setCaymanTime(new Intl.DateTimeFormat("en-US", options).format(now));
      } catch (e) {
        setCaymanTime("08:15 AM EST");
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    setUserRole("customer");
    if (setActiveTab) setActiveTab("home");
    showToast("Logged out to public marketplace.");
  };

  const handleViewCustomerStore = () => {
    setUserRole("customer");
    if (setActiveTab) setActiveTab("home");
  };

  const openAuth = (role) => {
    openAuthModal(role);
  };

  // 1. CUSTOMER TOP UTILITY BAR (100% Real, Clean, No Demo Badges)
  if (userRole === "customer") {
    return (
      <div
          style={{
            background: "#040912",
            color: "#94A3B8",
            padding: "0.42rem 1.75rem",
            fontSize: "0.78rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            position: "relative",
            zIndex: 101
          }}
        >
          <div
            className="container"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem"
            }}
          >
            {/* Left: Island Info */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#00E5C9", fontWeight: 700 }}>
                <span className="pulse-dot"></span>
                <span>Grand Cayman Island Marketplace</span>
              </div>

              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "#64748B" }}>
                <Clock size={12} color="#F59E0B" />
                <span>Island Time: <strong style={{ color: "#E2E8F0" }}>{caymanTime || "11:35 AM EST"}</strong></span>
              </div>

              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "#64748B" }}>
                <span>☀️ 29°C Seven Mile Beach</span>
              </div>
            </div>

            {/* Right: Currency Toggle & Real Portal Links */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              {/* Currency Toggle */}
              <div
                style={{
                  display: "inline-flex",
                  background: "rgba(255, 255, 255, 0.06)",
                  padding: "2px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.1)"
                }}
              >
                <button
                  onClick={() => setCurrency("KYD")}
                  style={{
                    background: currency === "KYD" ? "rgba(0, 229, 201, 0.2)" : "transparent",
                    color: currency === "KYD" ? "#00E5C9" : "#64748B",
                    padding: "0.2rem 0.55rem",
                    borderRadius: "6px",
                    fontSize: "0.72rem",
                    fontWeight: currency === "KYD" ? 800 : 600,
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  KYD ($)
                </button>
                <button
                  onClick={() => setCurrency("USD")}
                  style={{
                    background: currency === "USD" ? "rgba(0, 229, 201, 0.2)" : "transparent",
                    color: currency === "USD" ? "#00E5C9" : "#64748B",
                    padding: "0.2rem 0.55rem",
                    borderRadius: "6px",
                    fontSize: "0.72rem",
                    fontWeight: currency === "USD" ? 800 : 600,
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  USD ($)
                </button>
              </div>

              {/* Persistent Customer Account / Sign In */}
              {isCustomerLoggedIn ? (
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                  <button
                    id="customer-account-btn"
                    onClick={() => setActiveTab && setActiveTab("my-orders")}
                    style={{
                      background: "rgba(0, 229, 201, 0.12)",
                      border: "1px solid rgba(0, 229, 201, 0.35)",
                      color: "#00E5C9",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      padding: "0.25rem 0.75rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      transition: "all 0.2s"
                    }}
                    title="View My Orders & Account"
                  >
                    <User size={13} color="#00E5C9" />
                    <span>Hi, {customerDisplayName}</span>
                  </button>
                  <button
                    id="customer-signout-btn"
                    onClick={() => {
                      clearCustomerSession();
                      if (setActiveTab) setActiveTab("home");
                    }}
                    style={{
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#CBD5E1",
                      fontSize: "0.74rem",
                      fontWeight: 600,
                      padding: "0.25rem 0.55rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      transition: "all 0.2s"
                    }}
                    title="Sign Out"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#FF6B6B";
                      e.currentTarget.style.borderColor = "rgba(255, 107, 107, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#CBD5E1";
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    }}
                  >
                    <LogOut size={12} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  id="customer-signin-btn"
                  onClick={() => openAuth("customer")}
                  style={{
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "#FFFFFF",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    padding: "0.25rem 0.75rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem"
                  }}
                >
                  <User size={13} color="#00E5C9" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
    );
  }

  // 2. VENDOR AUTHENTIC MERCHANT BAR (When logged in as Merchant)
  if (userRole === "vendor") {
    return (
      <div
        style={{
          background: "linear-gradient(90deg, #06152B 0%, #082142 100%)",
          color: "#E2E8F0",
          padding: "0.5rem 1.75rem",
          fontSize: "0.82rem",
          borderBottom: "1px solid rgba(0, 229, 201, 0.25)",
          position: "relative",
          zIndex: 101,
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem"
          }}
        >
          {/* Left: Merchant Stall Identity */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", color: "#00E5C9", fontWeight: 800 }}>
              <Store size={16} />
              <span>Merchant Workspace</span>
            </div>

            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", background: "rgba(0, 229, 201, 0.08)", border: "1px solid rgba(0, 229, 201, 0.25)", padding: "0.25rem 0.75rem", borderRadius: "8px" }}>
              <span style={{ color: "#94A3B8", fontSize: "0.76rem" }}>My Stall:</span>
              <span style={{ color: "#FFFFFF", fontSize: "0.78rem", fontWeight: 700 }}>
                {activeVendor?.stall_number ? `${activeVendor.stall_number} • ` : ""}{activeVendor?.store_name} ({activeVendor?.district})
              </span>
              {activeVendor?.status === "pending_approval" && (
                <span style={{ background: "#F59E0B", color: "#000", fontSize: "0.68rem", fontWeight: 800, padding: "0.1rem 0.4rem", borderRadius: "4px" }}>
                  Pending Review
                </span>
              )}
            </div>
          </div>

          {/* Right: Balance & Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
              Take-Rate: <strong style={{ color: "#00E5C9" }}>{Number((activeVendor?.commission_rate || 0.1) * 100).toFixed(0)}% Flat</strong>
            </div>

            <button
              onClick={handleViewCustomerStore}
              style={{
                background: "rgba(0, 229, 201, 0.12)",
                border: "1px solid rgba(0, 229, 201, 0.35)",
                color: "#00E5C9",
                padding: "0.3rem 0.8rem",
                borderRadius: "8px",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem"
              }}
            >
              <span>View Customer Storefront</span>
              <ExternalLink size={13} />
            </button>

            <button
              onClick={handleLogout}
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#EF4444",
                padding: "0.3rem 0.8rem",
                borderRadius: "8px",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem"
              }}
            >
              <LogOut size={13} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. ADMIN AUTHENTIC CONSOLE BAR (When logged in as Admin)
  return (
    <div
      style={{
        background: "linear-gradient(90deg, #1C1004 0%, #2A1705 100%)",
        color: "#FBBF24",
        padding: "0.5rem 1.75rem",
        fontSize: "0.82rem",
        borderBottom: "1px solid rgba(245, 158, 11, 0.3)",
        position: "relative",
        zIndex: 101,
        boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem"
        }}
      >
        {/* Left: Admin Identity */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", color: "#FBBF24", fontWeight: 800 }}>
            <ShieldCheck size={16} />
            <span>Platform Admin Console</span>
          </div>
          <span style={{ color: "#94A3B8", fontSize: "0.75rem" }}>
            Grand Cayman Marketplace Operational • SuperAdmin Session
          </span>
        </div>

        {/* Right: Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <button
            onClick={handleViewCustomerStore}
            style={{
              background: "rgba(245, 158, 11, 0.15)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              color: "#FBBF24",
              padding: "0.3rem 0.8rem",
              borderRadius: "8px",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem"
            }}
          >
            <span>View Public Marketplace</span>
            <ExternalLink size={13} />
          </button>

          <button
            onClick={handleLogout}
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#EF4444",
              padding: "0.3rem 0.8rem",
              borderRadius: "8px",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem"
            }}
          >
            <LogOut size={13} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
