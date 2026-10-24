import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import {
  ShieldCheck,
  Store,
  Wallet,
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
  Megaphone,
  FileSpreadsheet,
  AlertTriangle,
  Compass,
  Star
} from "lucide-react";

export default function AdminDashboard({ setActiveTab }) {
  const { vendors, orders, ledger, ads, reviews = [], formatPrice, showToast } = useMarketplace();

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

  const totalWalletDeposits = ledger
    .filter((l) => l.type === "CREDIT_TOPUP")
    .reduce((acc, l) => acc + l.amount, 0);

  // District distribution calculation
  const districtCounts = {};
  vendors.forEach((v) => {
    const dist = v.district || "Georgetown";
    districtCounts[dist] = (districtCounts[dist] || 0) + 1;
  });

  return (
    <div style={{ background: "#060D19", minHeight: "100vh", color: "#F8FAFC", paddingBottom: "5rem" }}>
      
      {/* 1. EXECUTIVE HERO COMMAND BANNER */}
      <div
        style={{
          background: "linear-gradient(135deg, #050B14 0%, #0B192E 50%, #0A2540 100%)",
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
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(245, 158, 11, 0.12)", border: "1px solid rgba(245, 158, 11, 0.35)", padding: "0.35rem 0.85rem", borderRadius: "999px", color: "#FBBF24", fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
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
                Master oversight for Grand Cayman multi-vendor stalls, automated 10% commission ledgers, physical 48H hold pass logistics, and merchant approvals.
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
                  <span>Review {pendingApprovalsCount} Pending Stalls</span>
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
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.86rem",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#FBBF24")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)")}
              >
                <FileSpreadsheet size={16} color="#FBBF24" />
                <span>Monthly Reports</span>
              </button>

              <button
                onClick={() => setActiveTab("admin-reviews")}
                style={{
                  background: "rgba(245, 158, 11, 0.12)",
                  color: "#FBBF24",
                  fontWeight: 700,
                  padding: "0.65rem 1.25rem",
                  borderRadius: "12px",
                  border: "1px solid rgba(245, 158, 11, 0.35)",
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
              background: "linear-gradient(135deg, rgba(15, 31, 56, 0.8) 0%, rgba(10, 20, 36, 0.95) 100%)",
              border: "1px solid rgba(0, 229, 201, 0.3)",
              borderRadius: "20px",
              padding: "1.75rem",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Total Marketplace GMV
              </span>
              <div style={{ background: "rgba(0, 229, 201, 0.15)", color: "#00E5C9", width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrendingUp size={20} />
              </div>
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
              {formatPrice(totalGMV)}
            </div>
            <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem" }}>
              <span style={{ background: "rgba(16, 185, 129, 0.2)", color: "#10B981", padding: "0.15rem 0.5rem", borderRadius: "6px", fontWeight: 800 }}>
                +14.8%
              </span>
              <span style={{ color: "#64748B" }}>Gross Island transactions</span>
            </div>
          </div>

          {/* Card 2: Platform Commission Earned */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(30, 24, 10, 0.8) 0%, rgba(18, 14, 5, 0.95) 100%)",
              border: "1px solid rgba(245, 158, 11, 0.35)",
              borderRadius: "20px",
              padding: "1.75rem",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#FBBF24", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                10% Take-Rate Revenue
              </span>
              <div style={{ background: "rgba(245, 158, 11, 0.2)", color: "#FBBF24", width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <DollarSign size={20} />
              </div>
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FBBF24", letterSpacing: "-0.02em" }}>
              {formatPrice(totalCommissionsEarned)}
            </div>
            <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", color: "#94A3B8" }}>
              <span>Auto-settled via Vendor Wallets</span>
            </div>
          </div>

          {/* Card 3: Merchant Ecosystem */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(10, 24, 40, 0.8) 0%, rgba(6, 15, 26, 0.95) 100%)",
              border: "1px solid rgba(14, 165, 233, 0.25)",
              borderRadius: "20px",
              padding: "1.75rem",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Merchant Network
              </span>
              <div style={{ background: "rgba(14, 165, 233, 0.15)", color: "#38BDF8", width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Store size={20} />
              </div>
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
              {vendors.length} <span style={{ fontSize: "1rem", color: "#64748B", fontWeight: 600 }}>Stalls</span>
            </div>
            <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.78rem" }}>
              <span style={{ color: "#38BDF8", fontWeight: 700 }}>{verifiedVendorsCount} Verified</span>
              <span style={{ color: "#475569" }}>•</span>
              <span style={{ color: pendingApprovalsCount > 0 ? "#F59E0B" : "#10B981", fontWeight: 700 }}>
                {pendingApprovalsCount > 0 ? `${pendingApprovalsCount} Awaiting Review` : "100% Up to Date"}
              </span>
            </div>
          </div>

          {/* Card 4: Orders & Logistics Volume */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(20, 16, 36, 0.8) 0%, rgba(12, 9, 22, 0.95) 100%)",
              border: "1px solid rgba(168, 85, 247, 0.25)",
              borderRadius: "20px",
              padding: "1.75rem",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#C084FC", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Audited Orders Pipeline
              </span>
              <div style={{ background: "rgba(168, 85, 247, 0.15)", color: "#C084FC", width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Package size={20} />
              </div>
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
              {orders.length} <span style={{ fontSize: "1rem", color: "#64748B", fontWeight: 600 }}>Total</span>
            </div>
            <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.78rem" }}>
              <span style={{ color: "#10B981", fontWeight: 700 }}>{completedOrders.length} Completed</span>
              <span style={{ color: "#475569" }}>•</span>
              <span style={{ color: "#F59E0B", fontWeight: 700 }}>{pendingOrders.length} In Progress</span>
            </div>
          </div>

        </div>

        {/* 3. GOVERNANCE COMMAND MATRIX */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#FFFFFF", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Compass size={20} color="#FBBF24" /> Platform Management Portals
            </h2>
            <span style={{ fontSize: "0.8rem", color: "#64748B" }}>Select a module to govern and audit</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
            
            {/* Action 1: Stalls & Licensing */}
            <div
              onClick={() => setActiveTab("admin-vendors")}
              style={{
                background: "rgba(15, 23, 42, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "18px",
                padding: "1.5rem",
                cursor: "pointer",
                transition: "all 0.25s ease",
                position: "relative"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#00E5C9";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 12px 25px rgba(0, 229, 201, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div style={{ background: "rgba(0, 229, 201, 0.12)", color: "#00E5C9", padding: "0.6rem", borderRadius: "12px", display: "inline-flex" }}>
                  <Store size={22} />
                </div>
                {pendingApprovalsCount > 0 ? (
                  <span style={{ background: "#F59E0B", color: "#000", fontWeight: 900, fontSize: "0.74rem", padding: "0.2rem 0.6rem", borderRadius: "999px" }}>
                    {pendingApprovalsCount} Needs Approval
                  </span>
                ) : (
                  <span style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10B981", fontWeight: 800, fontSize: "0.74rem", padding: "0.2rem 0.6rem", borderRadius: "999px" }}>
                    All Approved
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.35rem" }}>
                Vendor Stalls & Licensing
              </h3>
              <p style={{ fontSize: "0.84rem", color: "#94A3B8", lineHeight: 1.5, marginBottom: "1rem" }}>
                Approve new island artisan registrations, toggle verified badges, and inspect individual merchant stall credentials.
              </p>
              <div style={{ color: "#00E5C9", fontSize: "0.82rem", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                Manage Artisan Directory <ArrowRight size={14} />
              </div>
            </div>

            {/* Action 2: Wallet Ledger Audit */}
            <div
              onClick={() => setActiveTab("admin-ledger")}
              style={{
                background: "rgba(15, 23, 42, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "18px",
                padding: "1.5rem",
                cursor: "pointer",
                transition: "all 0.25s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#FBBF24";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 12px 25px rgba(245, 158, 11, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div style={{ background: "rgba(245, 158, 11, 0.12)", color: "#FBBF24", padding: "0.6rem", borderRadius: "12px", display: "inline-flex" }}>
                  <Wallet size={22} />
                </div>
                <span style={{ color: "#94A3B8", fontSize: "0.78rem", fontWeight: 600 }}>
                  {ledger.length} Audit Entries
                </span>
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.35rem" }}>
                Financial Wallet Ledgers
              </h3>
              <p style={{ fontSize: "0.84rem", color: "#94A3B8", lineHeight: 1.5, marginBottom: "1rem" }}>
                Live trace of every vendor deposit, automatic 10% commission deduction, and withdrawal request.
              </p>
              <div style={{ color: "#FBBF24", fontSize: "0.82rem", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                Audit Platform Ledger <ArrowRight size={14} />
              </div>
            </div>

            {/* Action 3: Global Orders */}
            <div
              onClick={() => setActiveTab("admin-orders")}
              style={{
                background: "rgba(15, 23, 42, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "18px",
                padding: "1.5rem",
                cursor: "pointer",
                transition: "all 0.25s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#38BDF8";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 12px 25px rgba(56, 189, 248, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div style={{ background: "rgba(14, 165, 233, 0.12)", color: "#38BDF8", padding: "0.6rem", borderRadius: "12px", display: "inline-flex" }}>
                  <Package size={22} />
                </div>
                <span style={{ color: "#94A3B8", fontSize: "0.78rem", fontWeight: 600 }}>
                  Island-wide Dispatch
                </span>
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.35rem" }}>
                Global Order & Pickup Stream
              </h3>
              <p style={{ fontSize: "0.84rem", color: "#94A3B8", lineHeight: 1.5, marginBottom: "1rem" }}>
                Inspect live statuses, 4-digit PIN verification codes, COD courier dispatch logs, and delivery receipts.
              </p>
              <div style={{ color: "#38BDF8", fontSize: "0.82rem", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                Inspect Active Stream <ArrowRight size={14} />
              </div>
            </div>

            {/* Action 4: Monthly Financial Reports */}
            <div
              onClick={() => setActiveTab("admin-reports")}
              style={{
                background: "rgba(15, 23, 42, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "18px",
                padding: "1.5rem",
                cursor: "pointer",
                transition: "all 0.25s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#10B981";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 12px 25px rgba(16, 185, 129, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10B981", padding: "0.6rem", borderRadius: "12px", display: "inline-flex" }}>
                  <TrendingUp size={22} />
                </div>
                <span style={{ background: "rgba(16, 185, 129, 0.2)", color: "#10B981", fontSize: "0.74rem", fontWeight: 800, padding: "0.2rem 0.5rem", borderRadius: "6px" }}>
                  CSV Export
                </span>
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.35rem" }}>
                District Revenue & Analytics
              </h3>
              <p style={{ fontSize: "0.84rem", color: "#94A3B8", lineHeight: 1.5, marginBottom: "1rem" }}>
                District-by-district sales volume, automated month-end settlement statements, and Cayman tax-free summaries.
              </p>
              <div style={{ color: "#10B981", fontSize: "0.82rem", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                Generate Financial Reports <ArrowRight size={14} />
              </div>
            </div>

            {/* Action 5: Sponsored Ads Placements */}
            <div
              onClick={() => setActiveTab("admin-ads")}
              style={{
                background: "rgba(15, 23, 42, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "18px",
                padding: "1.5rem",
                cursor: "pointer",
                transition: "all 0.25s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#EC4899";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 12px 25px rgba(236, 72, 153, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div style={{ background: "rgba(236, 72, 153, 0.12)", color: "#EC4899", padding: "0.6rem", borderRadius: "12px", display: "inline-flex" }}>
                  <Megaphone size={22} />
                </div>
                <span style={{ color: "#94A3B8", fontSize: "0.78rem", fontWeight: 600 }}>
                  Sponsored Boosts
                </span>
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.35rem" }}>
                Sponsored Ads Governance
              </h3>
              <p style={{ fontSize: "0.84rem", color: "#94A3B8", lineHeight: 1.5, marginBottom: "1rem" }}>
                Audit artisan CPC advertising campaigns, manage hero featured placements, and track daily ad click rates.
              </p>
              <div style={{ color: "#EC4899", fontSize: "0.82rem", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                Review Active Ads <ArrowRight size={14} />
              </div>
            </div>

            {/* Action 6: Disputes Center */}
            <div
              onClick={() => setActiveTab("admin-disputes")}
              style={{
                background: "rgba(15, 23, 42, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "18px",
                padding: "1.5rem",
                cursor: "pointer",
                transition: "all 0.25s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#EF4444";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 12px 25px rgba(239, 68, 68, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div style={{ background: "rgba(239, 68, 68, 0.12)", color: "#EF4444", padding: "0.6rem", borderRadius: "12px", display: "inline-flex" }}>
                  <AlertTriangle size={22} />
                </div>
                <span style={{ color: "#94A3B8", fontSize: "0.78rem", fontWeight: 600 }}>
                  Claims Desk
                </span>
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.35rem" }}>
                Dispute Arbitration Center
              </h3>
              <p style={{ fontSize: "0.84rem", color: "#94A3B8", lineHeight: 1.5, marginBottom: "1rem" }}>
                Mediate buyer-merchant discrepancies, issue 1-click order voiding or refunds, and handle damaged COD courier claims.
              </p>
              <div style={{ color: "#EF4444", fontSize: "0.82rem", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                Access Arbitration Center <ArrowRight size={14} />
              </div>
            </div>

          </div>
        </div>

        {/* 4. REAL-TIME AUDIT STREAM */}
        <div style={{ background: "rgba(15, 23, 42, 0.6)", borderRadius: "20px", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "1.75rem", boxShadow: "0 15px 35px rgba(0,0,0,0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF" }}>Recent Global Marketplace Stream</h3>
              <p style={{ fontSize: "0.82rem", color: "#64748B" }}>Chronological record of orders placed across Grand Cayman stalls</p>
            </div>
            <button
              onClick={() => setActiveTab("admin-orders")}
              style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#CBD5E1", padding: "0.4rem 0.85rem", borderRadius: "8px", fontSize: "0.8rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
            >
              <span>Full Order Ledger</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  <th style={{ padding: "0.75rem" }}>Order ID</th>
                  <th style={{ padding: "0.75rem" }}>Method</th>
                  <th style={{ padding: "0.75rem" }}>Stall</th>
                  <th style={{ padding: "0.75rem" }}>Customer</th>
                  <th style={{ padding: "0.75rem" }}>Total</th>
                  <th style={{ padding: "0.75rem" }}>Platform 10%</th>
                  <th style={{ padding: "0.75rem", textAlign: "right" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                    <td style={{ padding: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>{o.id}</td>
                    <td style={{ padding: "0.85rem" }}>
                      <span style={{
                        background: o.type === "PICKUP" ? "rgba(0, 229, 201, 0.12)" : "rgba(245, 158, 11, 0.12)",
                        color: o.type === "PICKUP" ? "#00E5C9" : "#FBBF24",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        padding: "0.2rem 0.55rem",
                        borderRadius: "6px"
                      }}>
                        {o.type === "PICKUP" ? "Store Pickup" : "Courier COD"}
                      </span>
                    </td>
                    <td style={{ padding: "0.85rem", color: "#CBD5E1" }}>{o.vendor_name}</td>
                    <td style={{ padding: "0.85rem", color: "#94A3B8" }}>{o.customer_name}</td>
                    <td style={{ padding: "0.85rem", fontWeight: 800, color: "#FFFFFF" }}>${(o.total_amount || 0).toFixed(2)} KYD</td>
                    <td style={{ padding: "0.85rem", color: "#10B981", fontWeight: 700 }}>+${(o.commission_amount || (o.total_amount * 0.1) || 0).toFixed(2)} KYD</td>
                    <td style={{ padding: "0.85rem", textAlign: "right" }}>
                      <span style={{
                        background: o.status === "Completed" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                        color: o.status === "Completed" ? "#10B981" : "#FBBF24",
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
