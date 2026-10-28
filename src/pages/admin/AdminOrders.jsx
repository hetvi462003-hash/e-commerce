import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import {
  Package,
  Clock,
  DollarSign,
  Search,
  Filter,
  MessageSquare,
  ExternalLink,
  Store,
  Truck,
  User,
  Phone,
  ShieldCheck
} from "lucide-react";

export default function AdminOrders() {
  const {
    orders,
    formatPrice,
    updateOrderStatus,
    ORDER_STATUSES = [
      "New",
      "Contacted",
      "Confirmed",
      "Awaiting Payment",
      "Processing",
      "Ready for Collection",
      "Out for Delivery",
      "Completed",
      "Cancelled"
    ],
    PAYMENT_STATUSES = [
      "Pending",
      "Partially Paid",
      "Paid",
      "Refunded"
    ],
    PAYMENT_METHODS = [
      "Cash on Collection",
      "Cash on Delivery",
      "Local Bank Transfer",
      "Other"
    ]
  } = useMarketplace();

  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const cleanDigits = (str) => (str || "").replace(/\D/g, "");

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (paymentFilter !== "all" && (o.payment_status || "Pending") !== paymentFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = (o.id || o.order_id || "").toLowerCase().includes(q);
      const matchCust = (o.customer_name || "").toLowerCase().includes(q);
      const matchPhone = (o.customer_phone || "").includes(q);
      const matchVendor = (o.vendor_name || "").toLowerCase().includes(q);
      return matchId || matchCust || matchPhone || matchVendor;
    }

    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return { bg: "#E0F2FE", color: "#0369A1" };
      case "Contacted":
      case "Confirmed":
        return { bg: "#FEF3C7", color: "#B45309" };
      case "Awaiting Payment":
        return { bg: "#FFF7ED", color: "#C2410C" };
      case "Processing":
        return { bg: "#F3E8FF", color: "#7E22CE" };
      case "Ready for Collection":
        return { bg: "#ECFDF5", color: "#047857" };
      case "Out for Delivery":
        return { bg: "#EFF6FF", color: "#1D4ED8" };
      case "Completed":
        return { bg: "#DCFCE7", color: "#15803D" };
      case "Cancelled":
        return { bg: "#FEE2E2", color: "#B91C1C" };
      default:
        return { bg: "#F1F5F9", color: "#475569" };
    }
  };

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem", paddingBottom: "5rem" }}>
      
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#F59E0B", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>
          <Package size={16} /> Platform Order Governance
        </div>
        <h1 style={{ fontSize: "2.2rem", color: "#0F172A", marginBottom: "0.2rem", fontWeight: 900 }}>
          Marketplace Order Audits
        </h1>
        <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
          Full marketplace transaction log with WhatsApp coordination, fulfillment tracking, and manual payment auditing.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ background: "#FFFFFF", borderRadius: "16px", border: "1.5px solid #E2E8F0", padding: "1.25rem", marginBottom: "1.5rem", display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", justifyContent: "space-between" }}>
        
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          {/* Status Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#64748B" }}>Order Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: "0.45rem 0.75rem", borderRadius: "10px", border: "1.5px solid #CBD5E1", fontSize: "0.84rem", fontWeight: 600 }}
            >
              <option value="all">All Statuses ({orders.length})</option>
              {ORDER_STATUSES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#64748B" }}>Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              style={{ padding: "0.45rem 0.75rem", borderRadius: "10px", border: "1.5px solid #CBD5E1", fontSize: "0.84rem", fontWeight: 600 }}
            >
              <option value="all">All Payments</option>
              {PAYMENT_STATUSES.map((pst) => (
                <option key={pst} value={pst}>{pst}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div style={{ position: "relative", minWidth: "260px" }}>
          <Search size={16} color="#94A3B8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            placeholder="Search Order #, Customer, Vendor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: "36px",
              paddingRight: "12px",
              paddingTop: "0.45rem",
              paddingBottom: "0.45rem",
              borderRadius: "10px",
              border: "1.5px solid #CBD5E1",
              fontSize: "0.86rem",
              width: "100%"
            }}
          />
        </div>

      </div>

      {/* Orders Table */}
      <div style={{ background: "#FFFFFF", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        {filteredOrders.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#64748B" }}>
            <Package size={44} color="#CBD5E1" style={{ marginBottom: "0.75rem" }} />
            <h3 style={{ color: "#0F172A", marginBottom: "0.3rem" }}>No Matching Orders</h3>
            <p style={{ fontSize: "0.88rem" }}>Try clearing search or filters to see all orders.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#475569", fontWeight: 700 }}>
                  <th style={{ padding: "1rem" }}>Order Ref</th>
                  <th style={{ padding: "1rem" }}>Vendor</th>
                  <th style={{ padding: "1rem" }}>Customer</th>
                  <th style={{ padding: "1rem" }}>Fulfillment</th>
                  <th style={{ padding: "1rem" }}>Total</th>
                  <th style={{ padding: "1rem" }}>Order Status</th>
                  <th style={{ padding: "1rem" }}>Payment Status</th>
                  <th style={{ padding: "1rem" }}>Payment Method</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => {
                  const isDelivery = ord.fulfillment_type === "Island Courier Delivery" || ord.type === "COD";
                  const statusColors = getStatusColor(ord.status);
                  const custDigits = cleanDigits(ord.customer_phone);

                  const customerWhatsApp = `https://wa.me/${custDigits}?text=${encodeURIComponent(
                    `Hello ${ord.customer_name}, this is Cayman Bazaar Admin regarding your Order #${ord.id || ord.order_id}.`
                  )}`;

                  return (
                    <tr key={ord.id || ord.order_id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      
                      {/* Order Ref */}
                      <td style={{ padding: "1rem", verticalAlign: "top" }}>
                        <div style={{ fontWeight: 900, color: "#0A192F" }}>
                          #{ord.id || ord.order_id}
                        </div>
                        <div style={{ fontSize: "0.74rem", color: "#94A3B8", marginTop: "2px" }}>
                          {new Date(ord.created_at).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Vendor */}
                      <td style={{ padding: "1rem", verticalAlign: "top" }}>
                        <div style={{ fontWeight: 700, color: "#00A896" }}>
                          {ord.vendor_name}
                        </div>
                        <div style={{ fontSize: "0.74rem", color: "#64748B" }}>
                          {ord.items?.length || 1} product(s)
                        </div>
                      </td>

                      {/* Customer */}
                      <td style={{ padding: "1rem", verticalAlign: "top" }}>
                        <div style={{ fontWeight: 700, color: "#0A192F" }}>{ord.customer_name}</div>
                        <div style={{ fontSize: "0.76rem", color: "#64748B", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <Phone size={12} /> {ord.customer_phone}
                        </div>
                        <a
                          href={customerWhatsApp}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: "#25D366",
                            color: "#FFFFFF",
                            textDecoration: "none",
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            padding: "0.2rem 0.5rem",
                            borderRadius: "6px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            marginTop: "0.35rem"
                          }}
                        >
                          <MessageSquare size={11} /> WhatsApp
                        </a>
                      </td>

                      {/* Fulfillment */}
                      <td style={{ padding: "1rem", verticalAlign: "top" }}>
                        <span
                          style={{
                            background: isDelivery ? "#EFF6FF" : "#F0FDFA",
                            color: isDelivery ? "#1E40AF" : "#0D9488",
                            border: isDelivery ? "1px solid #BFDBFE" : "1px solid #99F6E4",
                            fontSize: "0.74rem",
                            fontWeight: 800,
                            padding: "0.2rem 0.55rem",
                            borderRadius: "999px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem"
                          }}
                        >
                          {isDelivery ? <Truck size={12} /> : <Store size={12} />}
                          {ord.fulfillment_type || (isDelivery ? "Island Courier Delivery" : "Collection at Stall")}
                        </span>
                        {ord.delivery_address && (
                          <div style={{ fontSize: "0.74rem", color: "#64748B", marginTop: "0.3rem", maxWidth: "180px" }}>
                            📍 {ord.delivery_address}
                          </div>
                        )}
                      </td>

                      {/* Total */}
                      <td style={{ padding: "1rem", verticalAlign: "top" }}>
                        <div style={{ fontWeight: 800, color: "#0A192F" }}>
                          {formatPrice(ord.total_amount)}
                        </div>
                      </td>

                      {/* Order Status Select */}
                      <td style={{ padding: "1rem", verticalAlign: "top" }}>
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id || ord.order_id, e.target.value)}
                          style={{
                            background: statusColors.bg,
                            color: statusColors.color,
                            fontWeight: 800,
                            fontSize: "0.8rem",
                            padding: "0.35rem 0.55rem",
                            borderRadius: "8px",
                            border: "1.5px solid transparent",
                            cursor: "pointer"
                          }}
                        >
                          {ORDER_STATUSES.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>

                      {/* Payment Status Select */}
                      <td style={{ padding: "1rem", verticalAlign: "top" }}>
                        <select
                          value={ord.payment_status || "Pending"}
                          onChange={(e) => updateOrderStatus(ord.id || ord.order_id, null, e.target.value)}
                          style={{
                            background: ord.payment_status === "Paid" ? "#DCFCE7" : "#FFF7ED",
                            color: ord.payment_status === "Paid" ? "#166534" : "#C2410C",
                            fontWeight: 800,
                            fontSize: "0.8rem",
                            padding: "0.35rem 0.55rem",
                            borderRadius: "8px",
                            border: "1.5px solid transparent",
                            cursor: "pointer"
                          }}
                        >
                          {PAYMENT_STATUSES.map((pst) => (
                            <option key={pst} value={pst}>{pst}</option>
                          ))}
                        </select>
                      </td>

                      {/* Payment Method Select */}
                      <td style={{ padding: "1rem", verticalAlign: "top" }}>
                        <select
                          value={ord.payment_method || "Cash on Collection"}
                          onChange={(e) => updateOrderStatus(ord.id || ord.order_id, null, null, e.target.value)}
                          style={{
                            background: "#F8FAFC",
                            color: "#334155",
                            fontWeight: 600,
                            fontSize: "0.78rem",
                            padding: "0.35rem 0.55rem",
                            borderRadius: "8px",
                            border: "1px solid #CBD5E1",
                            cursor: "pointer"
                          }}
                        >
                          {PAYMENT_METHODS.map((pm) => (
                            <option key={pm} value={pm}>{pm}</option>
                          ))}
                        </select>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
