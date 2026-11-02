import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import {
  ShieldCheck,
  Store,
  Package,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  DollarSign,
  Activity,
  Layers,
  Sparkles,
  MapPin,
  FileSpreadsheet,
  Compass,
  Star
} from "lucide-react";

export default function AdminDashboard({ setActiveTab }) {
  const { vendors, orders, reviews = [], formatPrice, showToast } = useMarketplace();

  // Metrics Calculations
  const completedOrders = orders.filter((o) => o.status === "Completed");
  const pendingOrders = orders.filter((o) => o.status === "Pending" || o.status === "Packing");
  
  const totalGMV = completedOrders.reduce((acc, o) => acc + o.total_amount, 0);
  const totalCommissionsEarned = completedOrders.reduce(
    (acc, o) => acc + (o.commission_amount || (o.total_amount * 0.1)),
    0
  );

  const pendingApprovalsCount = vendors.filter((v) => v.status === "pending_approval").length;
  const activeVendorsCount = vendors.filter((v) => v.status === "active").length;
  const verifiedVendorsCount = vendors.filter((v) => v.verified).length;

  // District distribution calculation
  const districtCounts = {};
  vendors.forEach((v) => {
    const dist = v.district || "Georgetown";
    districtCounts[dist] = (districtCounts[dist] || 0) + 1;
  });

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", color: "#0F172A", paddingBottom: "5rem" }}>
      
      {/* 1. EXECUTIVE HERO COMMAND BANNER */}
      <div
        style={{
          background: "linear-gradient(135deg, #0A1C36 0%, #172554 100%)",
          borderBottom: "1px solid rgba(245, 158, 11, 0.25)",
          padding: "3rem 1.5rem 2.5rem",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Ambient Glows */}
        <div style={{ position: "absolute", top: "-50px", right: "10%", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-50px", left: "5%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(0, 229, 201, 0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          
          {/* Top Trust & Authority Indicators */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.4)", padding: "0.35rem 0.85rem", borderRadius: "999px", color: "#FBBF24", fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <ShieldCheck size={16} /> Platform SuperAdmin Authority
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.78rem", color: "#94A3B8" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981", boxShadow: "0 0 8px #10B981" }} />
                MongoDB Atlas Synchronized
              </span>
              <span>•</span>
              <span style={{ color: "#E2E8F0" }}>Grand Cayman Standard (UTC-5)</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "2.6rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.4rem", letterSpacing: "-0.01em" }}>
                Governance & Executive Command
              </h1>
              <p style={{ color: "#94A3B8", fontSize: "1.02rem", maxWidth: "680px", lineHeight: 1.5 }}>
                Master oversight for Grand Cayman multi-vendor stores, WhatsApp orders, merchant onboarding approvals, and monthly performance reports.
              </p>
            </div>

            {/* Quick Master Shortcuts */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {pendingApprovalsCount > 0 && (
                <button
                  onClick={() => setActiveTab("admin-vendors")}
                  style={{
                    background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    padding: "0.65rem 1.25rem",
                    borderRadius: "12px",
                    border: "none",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    boxShadow: "0 4px 15px rgba(245, 158, 11, 0.4)",
                    fontSize: "0.86rem"
                  }}
                >
                  <AlertCircle size={16} />
                  <span>Review {pendingApprovalsCount} Pending Stores</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab("admin-reports")}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  padding: "0.65rem 1.25rem",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.86rem",
                  transition: "all 0.2s"
                }}
              >
                <FileSpreadsheet size={16} color="#FBBF24" />
                <span>Monthly Reports</span>
              </button>

              <button
                onClick={() => setActiveTab("admin-reviews")}
                style={{
                  background: "rgba(245, 158, 11, 0.15)",
                  color: "#FBBF24",
                  fontWeight: 700,
                  padding: "0.65rem 1.25rem",
                  borderRadius: "12px",
                  border: "1px solid rgba(245, 158, 11, 0.4)",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.86rem",
                  transition: "all 0.2s"
                }}
              >
                <Star size={16} fill="#FBBF24" />
                <span>Reviews & Ratings</span>
                {reviews.filter((r) => r.is_flagged).length > 0 && (
                  <span style={{ background: "#EF4444", color: "#FFFFFF", fontSize: "0.72rem", padding: "0.1rem 0.45rem", borderRadius: "999px", fontWeight: 800 }}>
                    {reviews.filter((r) => r.is_flagged).length} flagged
                  </span>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

      <div className="container" style={{ padding: "2.5rem 1.5rem" }}>
        
        {/* 2. EXECUTIVE METRIC KPI TILES */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
          
          {/* Card 1: Total Platform GMV */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1.5px solid #E2E8F0",
              borderRadius: "20px",
              padding: "1.75rem",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Total Marketplace GMV
              </span>
              <div style={{ background: "#F0FDFA", color: "#0D9488", width: "42px", height: "42px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #CCFBF1" }}>
                <TrendingUp size={22} />
              </div>
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.02em" }}>
              {formatPrice(totalGMV)}
            </div>
            <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem" }}>
              <span style={{ background: "#DCFCE7", color: "#15803D", padding: "0.15rem 0.5rem", borderRadius: "6px", fontWeight: 800, border: "1px solid #BBF7D0" }}>
                +14.8%
              </span>
              <span style={{ color: "#64748B" }}>Gross Island transactions</span>
            </div>
          </div>

          {/* Card 2: Platform Commission Earned */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1.5px solid #E2E8F0",
              borderRadius: "20px",
              padding: "1.75rem",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#B45309", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                10% Take-Rate Revenue
              </span>
              <div style={{ background: "#FFFBEB", color: "#D97706", width: "42px", height: "42px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #FEF3C7" }}>
                <DollarSign size={22} />
              </div>
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#B45309", letterSpacing: "-0.02em" }}>
              {formatPrice(totalCommissionsEarned)}
            </div>
            <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", color: "#64748B" }}>
              <span>Platform take-rate earned from fulfilled customer orders</span>
            </div>
          </div>

          {/* Card 3: Merchant Ecosystem */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1.5px solid #E2E8F0",
              borderRadius: "20px",
              padding: "1.75rem",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0284C7", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Merchant Network
              </span>
              <div style={{ background: "#F0F9FF", color: "#0284C7", width: "42px", height: "42px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #BAE6FD" }}>
                <Store size={22} />
              </div>
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.02em" }}>
              {vendors.length} <span style={{ fontSize: "1rem", color: "#64748B", fontWeight: 600 }}>Stores</span>
            </div>
            <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.78rem" }}>
              <span style={{ color: "#0284C7", fontWeight: 700 }}>{verifiedVendorsCount} Verified</span>
              <span style={{ color: "#CBD5E1" }}>•</span>
              <span style={{ color: pendingApprovalsCount > 0 ? "#D97706" : "#166534", fontWeight: 700 }}>
                {pendingApprovalsCount > 0 ? `${pendingApprovalsCount} Awaiting Review` : "100% Up to Date"}
              </span>
            </div>
          </div>

          {/* Card 4: Orders & Logistics Volume */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1.5px solid #E2E8F0",
              borderRadius: "20px",
              padding: "1.75rem",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Audited Orders Pipeline
              </span>
              <div style={{ background: "#FAF5FF", color: "#7C3AED", width: "42px", height: "42px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #E9D5FF" }}>
                <Package size={22} />
              </div>
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.02em" }}>
              {orders.length} <span style={{ fontSize: "1rem", color: "#64748B", fontWeight: 600 }}>Total</span>
            </div>
            <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.78rem" }}>
              <span style={{ color: "#166534", fontWeight: 700 }}>{completedOrders.length} Completed</span>
              <span style={{ color: "#CBD5E1" }}>•</span>
              <span style={{ color: "#D97706", fontWeight: 700 }}>{pendingOrders.length} In Progress</span>
            </div>
          </div>

        </div>

        {/* 3. GOVERNANCE COMMAND MATRIX */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Compass size={20} color="#D97706" /> Platform Management Portals
            </h2>
            <span style={{ fontSize: "0.8rem", color: "#64748B" }}>Select a module to govern and audit</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
            
            {/* Action 1: Stalls & Licensing */}
            <div
              onClick={() => setActiveTab("admin-vendors")}
              style={{
                background: "#FFFFFF",
                border: "1.5px solid #E2E8F0",
                borderRadius: "18px",
                padding: "1.5rem",
                cursor: "pointer",
                transition: "all 0.25s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                position: "relative"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#0D9488";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(13, 148, 136, 0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div style={{ background: "#F0FDFA", color: "#0D9488", padding: "0.6rem", borderRadius: "12px", display: "inline-flex", border: "1px solid #CCFBF1" }}>
                  <Store size={22} />
                </div>
                {pendingApprovalsCount > 0 ? (
                  <span style={{ background: "#D97706", color: "#FFFFFF", fontWeight: 800, fontSize: "0.74rem", padding: "0.2rem 0.6rem", borderRadius: "999px" }}>
                    {pendingApprovalsCount} Needs Approval
                  </span>
                ) : (
                  <span style={{ background: "#DCFCE7", color: "#15803D", fontWeight: 800, fontSize: "0.74rem", padding: "0.2rem 0.6rem", borderRadius: "999px", border: "1px solid #BBF7D0" }}>
                    All Approved
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.35rem" }}>
                Vendor Stores & Licensing
              </h3>
              <p style={{ fontSize: "0.84rem", color: "#64748B", lineHeight: 1.5, marginBottom: "1rem" }}>
                Approve new island artisan registrations, toggle verified badges, and inspect individual merchant store credentials.
              </p>
              <div style={{ color: "#0D9488", fontSize: "0.82rem", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                Manage Artisan Directory <ArrowRight size={14} />
              </div>
            </div>

            {/* Action 2: Customer Reviews Moderation */}
            <div
              onClick={() => setActiveTab("admin-reviews")}
              style={{
                background: "#FFFFFF",
                border: "1.5px solid #E2E8F0",
                borderRadius: "18px",
                padding: "1.5rem",
                cursor: "pointer",
                transition: "all 0.25s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#D97706";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(217, 119, 6, 0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div style={{ background: "#FFFBEB", color: "#D97706", padding: "0.6rem", borderRadius: "12px", display: "inline-flex", border: "1px solid #FEF3C7" }}>
                  <Star size={22} fill="#D97706" />
                </div>
                <span style={{ color: "#64748B", fontSize: "0.78rem", fontWeight: 600 }}>
                  {reviews.length} Total Reviews
                </span>
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.35rem" }}>
                Customer Reviews & Ratings
              </h3>
              <p style={{ fontSize: "0.84rem", color: "#64748B", lineHeight: 1.5, marginBottom: "1rem" }}>
                Moderate shopper feedback, inspect artisan star ratings, and remove inappropriate review content.
              </p>
              <div style={{ color: "#D97706", fontSize: "0.82rem", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                Moderate Reviews <ArrowRight size={14} />
              </div>
            </div>

            {/* Action 3: Global Orders */}
            <div
              onClick={() => setActiveTab("admin-orders")}
              style={{
                background: "#FFFFFF",
                border: "1.5px solid #E2E8F0",
                borderRadius: "18px",
                padding: "1.5rem",
                cursor: "pointer",
                transition: "all 0.25s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#0284C7";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(2, 132, 199, 0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div style={{ background: "#F0F9FF", color: "#0284C7", padding: "0.6rem", borderRadius: "12px", display: "inline-flex", border: "1px solid #BAE6FD" }}>
                  <Package size={22} />
                </div>
                <span style={{ color: "#64748B", fontSize: "0.78rem", fontWeight: 600 }}>
                  Island-wide Dispatch
                </span>
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.35rem" }}>
                Global Order & Transaction Stream
              </h3>
              <p style={{ fontSize: "0.84rem", color: "#64748B", lineHeight: 1.5, marginBottom: "1rem" }}>
                Inspect live statuses, filter by vendor or district, track payment states, and download CSV summaries.
              </p>
              <div style={{ color: "#0284C7", fontSize: "0.82rem", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                Inspect Orders Stream <ArrowRight size={14} />
              </div>
            </div>

            {/* Action 4: Monthly Financial Reports */}
            <div
              onClick={() => setActiveTab("admin-reports")}
              style={{
                background: "#FFFFFF",
                border: "1.5px solid #E2E8F0",
                borderRadius: "18px",
                padding: "1.5rem",
                cursor: "pointer",
                transition: "all 0.25s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#15803D";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(21, 128, 61, 0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div style={{ background: "#DCFCE7", color: "#15803D", padding: "0.6rem", borderRadius: "12px", display: "inline-flex", border: "1px solid #BBF7D0" }}>
                  <TrendingUp size={22} />
                </div>
                <span style={{ background: "#DCFCE7", color: "#15803D", fontSize: "0.74rem", fontWeight: 800, padding: "0.2rem 0.5rem", borderRadius: "6px", border: "1px solid #BBF7D0" }}>
                  CSV Export
                </span>
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.35rem" }}>
                District Revenue & Analytics
              </h3>
              <p style={{ fontSize: "0.84rem", color: "#64748B", lineHeight: 1.5, marginBottom: "1rem" }}>
                District-by-district sales volume, automated month-end settlement statements, and Cayman tax-free summaries.
              </p>
              <div style={{ color: "#15803D", fontSize: "0.82rem", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                Generate Financial Reports <ArrowRight size={14} />
              </div>
            </div>

          </div>
        </div>

        {/* 4. REAL-TIME AUDIT STREAM */}
        <div style={{ background: "#FFFFFF", borderRadius: "20px", border: "1.5px solid #E2E8F0", padding: "1.75rem", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A" }}>Recent Global Marketplace Stream</h3>
              <p style={{ fontSize: "0.82rem", color: "#64748B" }}>Chronological record of orders placed across Grand Cayman stores</p>
            </div>
            <button
              onClick={() => setActiveTab("admin-orders")}
              style={{ background: "#F8FAFC", border: "1px solid #CBD5E1", color: "#475569", padding: "0.4rem 0.85rem", borderRadius: "8px", fontSize: "0.8rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.3rem", fontWeight: 700 }}
            >
              <span>Full Order Ledger</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#475569", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  <th style={{ padding: "0.85rem 1rem" }}>Order ID</th>
                  <th style={{ padding: "0.85rem 1rem" }}>Method</th>
                  <th style={{ padding: "0.85rem 1rem" }}>Store</th>
                  <th style={{ padding: "0.85rem 1rem" }}>Customer</th>
                  <th style={{ padding: "0.85rem 1rem" }}>Total</th>
                  <th style={{ padding: "0.85rem 1rem" }}>Platform 10%</th>
                  <th style={{ padding: "0.85rem 1rem", textAlign: "right" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "#0F172A" }}>{o.id}</td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <span style={{
                        background: o.type === "PICKUP" ? "#F0FDFA" : "#FFFBEB",
                        color: o.type === "PICKUP" ? "#0D9488" : "#B45309",
                        border: `1px solid ${o.type === "PICKUP" ? "#CCFBF1" : "#FEF3C7"}`,
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        padding: "0.2rem 0.55rem",
                        borderRadius: "6px"
                      }}>
                        {o.type === "PICKUP" ? "Store Pickup" : "Courier COD"}
                      </span>
                    </td>
                    <td style={{ padding: "0.85rem 1rem", color: "#334155", fontWeight: 600 }}>{o.vendor_name}</td>
                    <td style={{ padding: "0.85rem 1rem", color: "#64748B" }}>{o.customer_name}</td>
                    <td style={{ padding: "0.85rem 1rem", fontWeight: 800, color: "#0F172A" }}>${(o.total_amount || 0).toFixed(2)} KYD</td>
                    <td style={{ padding: "0.85rem 1rem", color: "#15803D", fontWeight: 700 }}>+${(o.commission_amount || (o.total_amount * 0.1) || 0).toFixed(2)} KYD</td>
                    <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
                      <span style={{
                        background: o.status === "Completed" ? "#DCFCE7" : "#FEF3C7",
                        color: o.status === "Completed" ? "#15803D" : "#B45309",
                        border: `1px solid ${o.status === "Completed" ? "#BBF7D0" : "#FDE68A"}`,
                        fontSize: "0.74rem",
                        fontWeight: 800,
                        padding: "0.2rem 0.6rem",
                        borderRadius: "6px"
                      }}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
