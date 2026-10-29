import React, { useState, useEffect } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import api from "../../services/api";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Store,
  DollarSign,
  User,
  Filter,
  RefreshCw
} from "lucide-react";

export default function AdminDisputes() {
  const { formatPrice, showToast } = useMarketplace();

  const [disputes, setDisputes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchDisputes = async () => {
    setIsLoading(true);
    try {
      const res = await api.getDisputes();
      if (res?.success && res.data) {
        setDisputes(res.data.map((d) => ({
          ...d,
          id: d.dispute_id || d._id || d.id
        })));
      } else {
        setDisputes([]);
      }
    } catch (err) {
      console.warn("Dispute fetch error:", err);
      setDisputes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const handleResolve = async (id, resolution) => {
    try {
      await api.resolveDispute(id, resolution);
    } catch (e) {
      console.warn("Resolve dispute error:", e);
    }
    setDisputes((prev) =>
      prev.map((d) => (d.id === id || d.dispute_id === id ? { ...d, status: resolution } : d))
    );
    showToast(`Dispute ${id} marked as: ${resolution}`);
  };

  const filteredDisputes = disputes.filter((d) => {
    if (filterStatus === "all") return true;
    return d.status === filterStatus;
  });

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem", paddingBottom: "5rem" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#EF4444", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>
            <AlertTriangle size={16} /> Buyer & Merchant Arbitration
          </div>
          <h1 style={{ fontSize: "2.2rem", color: "#0F172A", marginBottom: "0.2rem" }}>Disputes & Claims Center</h1>
          <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
            Live customer claims and resolutions synced directly with CaymanBazaar dispute backend.
          </p>
        </div>

        <button
          onClick={fetchDisputes}
          className="btn-outline"
          style={{ padding: "0.55rem 1rem", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          <span>Refresh Claims</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
        {["all", "Under Review", "Resolved - Refunded", "Dismissed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              background: filterStatus === status ? "#0F172A" : "#FFFFFF",
              color: filterStatus === status ? "#FFFFFF" : "#64748B",
              padding: "0.45rem 1rem",
              borderRadius: "10px",
              fontSize: "0.82rem",
              fontWeight: 700,
              border: "1px solid #E2E8F0",
              cursor: "pointer"
            }}
          >
            {status === "all" ? `All Claims (${disputes.length})` : status}
          </button>
        ))}
      </div>

      {/* Disputes Table */}
      <div style={{ background: "#FFFFFF", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
              <th style={{ padding: "1rem" }}>Dispute ID</th>
              <th style={{ padding: "1rem" }}>Order & Method</th>
              <th style={{ padding: "1rem" }}>Buyer & Store</th>
              <th style={{ padding: "1rem" }}>Claim Reason</th>
              <th style={{ padding: "1rem" }}>Value</th>
              <th style={{ padding: "1rem" }}>Status</th>
              <th style={{ padding: "1rem", textAlign: "right" }}>Arbitration Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDisputes.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "4rem 1.5rem", color: "#64748B" }}>
                  <ShieldCheck size={42} color="#00A896" style={{ margin: "0 auto 0.75rem auto", display: "block" }} />
                  <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0F172A", marginBottom: "0.25rem" }}>
                    No Active Disputes
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#94A3B8" }}>
                    {filterStatus === "all"
                      ? "All merchant orders and pickup hold passes are operating smoothly."
                      : `No disputes found under status "${filterStatus}".`}
                  </div>
                </td>
              </tr>
            ) : (
              filteredDisputes.map((d) => (
                <tr key={d.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "1rem", fontWeight: 700, color: "#0F172A" }}>
                    {d.id}
                  </td>

                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: 700, color: "#0F172A" }}>{d.order_id}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748B" }}>
                      {d.type === "PICKUP" ? "Counter Pickup" : "Courier COD"}
                    </div>
                  </td>

                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: 600, color: "#0F172A" }}>{d.customer_name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#00A896" }}>{d.vendor_name}</div>
                  </td>

                  <td style={{ padding: "1rem", maxWidth: "240px", color: "#475569", fontSize: "0.84rem" }}>
                    {d.reason}
                  </td>

                  <td style={{ padding: "1rem", fontWeight: 800, color: "#0F172A" }}>
                    ${(d.amount || 0).toFixed(2)} KYD
                  </td>

                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        background: (d.status || "").includes("Resolved") ? "#DCFCE7" : d.status === "Dismissed" ? "#F1F5F9" : "#FEF3C7",
                        color: (d.status || "").includes("Resolved") ? "#166534" : d.status === "Dismissed" ? "#64748B" : "#B45309",
                        padding: "0.25rem 0.6rem",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontWeight: 800
                      }}
                    >
                      {d.status || "Under Review"}
                    </span>
                  </td>

                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    {d.status === "Under Review" ? (
                      <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                        <button
                          onClick={() => handleResolve(d.id, "Resolved - Refunded")}
                          className="btn-gold"
                          style={{ padding: "0.3rem 0.65rem", fontSize: "0.75rem", borderRadius: "6px" }}
                        >
                          Refund / Void
                        </button>
                        <button
                          onClick={() => handleResolve(d.id, "Dismissed")}
                          style={{
                            background: "#F1F5F9",
                            color: "#64748B",
                            padding: "0.3rem 0.65rem",
                            fontSize: "0.75rem",
                            borderRadius: "6px",
                            fontWeight: 700,
                            border: "1px solid #E2E8F0",
                            cursor: "pointer"
                          }}
                        >
                          Dismiss
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Closed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
