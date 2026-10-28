import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import {
  Clock,
  DollarSign,
  CheckCircle2,
  Package,
  MapPin,
  Phone,
  Printer,
  MessageSquare,
  ExternalLink,
  Store,
  Truck,
  Filter,
  Search,
  Calendar
} from "lucide-react";
import PrintReceiptModal from "../../components/PrintReceiptModal";

export default function VendorOrders() {
  const {
    activeVendor,
    orders,
    updateOrderStatus,
    formatPrice,
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
    ]
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrintOrder, setSelectedPrintOrder] = useState(null);

  if (!activeVendor) return null;

  const vendorOrders = orders.filter((o) => o.vendor_id === activeVendor.id);

  const filteredOrders = vendorOrders.filter((o) => {
    // Tab filter
    if (activeTab === "new" && o.status !== "New") return false;
    if (activeTab === "processing" && o.status !== "Processing" && o.status !== "Contacted" && o.status !== "Confirmed") return false;
    if (activeTab === "ready" && o.status !== "Ready for Collection" && o.status !== "Out for Delivery") return false;
    if (activeTab === "completed" && o.status !== "Completed") return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = (o.id || o.order_id || "").toLowerCase().includes(q);
      const matchCust = (o.customer_name || "").toLowerCase().includes(q);
      const matchPhone = (o.customer_phone || "").includes(q);
      return matchId || matchCust || matchPhone;
    }

    return true;
  });

  const cleanDigits = (str) => (str || "").replace(/\D/g, "");

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return { bg: "#E0F2FE", color: "#0369A1" };
      case "Contacted":
      case "Confirmed":
        return { bg: "#FEF3C7", color: "#B45309" };
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
      
      {/* Printable Receipt Modal */}
      {selectedPrintOrder && (
        <PrintReceiptModal order={selectedPrintOrder} onClose={() => setSelectedPrintOrder(null)} />
      )}

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#00A896", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>
          <Clock size={16} /> Stall Order Management
        </div>
        <h1 style={{ fontSize: "2.2rem", color: "#0F172A", marginBottom: "0.2rem", fontWeight: 900 }}>
          Orders & WhatsApp Fulfillment
        </h1>
        <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
          Manage incoming order requests for <strong>{activeVendor.store_name}</strong>, chat directly with customers via WhatsApp, and advance fulfillment statuses.
        </p>
      </div>

      {/* Quick Filters & Search Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        
        {/* Status Tab Filters */}
        <div style={{ display: "flex", gap: "0.4rem", background: "#F1F5F9", padding: "4px", borderRadius: "14px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            style={{
              background: activeTab === "all" ? "#FFFFFF" : "transparent",
              color: activeTab === "all" ? "#0F172A" : "#64748B",
              fontWeight: activeTab === "all" ? 800 : 600,
              padding: "0.45rem 0.85rem",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.84rem",
              boxShadow: activeTab === "all" ? "0 2px 6px rgba(0,0,0,0.08)" : "none"
            }}
          >
            All ({vendorOrders.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("new")}
            style={{
              background: activeTab === "new" ? "#FFFFFF" : "transparent",
              color: activeTab === "new" ? "#0369A1" : "#64748B",
              fontWeight: activeTab === "new" ? 800 : 600,
              padding: "0.45rem 0.85rem",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.84rem",
              boxShadow: activeTab === "new" ? "0 2px 6px rgba(0,0,0,0.08)" : "none"
            }}
          >
            New ({vendorOrders.filter(o => o.status === "New").length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("processing")}
            style={{
              background: activeTab === "processing" ? "#FFFFFF" : "transparent",
              color: activeTab === "processing" ? "#7E22CE" : "#64748B",
              fontWeight: activeTab === "processing" ? 800 : 600,
              padding: "0.45rem 0.85rem",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.84rem",
              boxShadow: activeTab === "processing" ? "0 2px 6px rgba(0,0,0,0.08)" : "none"
            }}
          >
            Processing ({vendorOrders.filter(o => ["Processing", "Contacted", "Confirmed"].includes(o.status)).length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ready")}
            style={{
              background: activeTab === "ready" ? "#FFFFFF" : "transparent",
              color: activeTab === "ready" ? "#047857" : "#64748B",
              fontWeight: activeTab === "ready" ? 800 : 600,
              padding: "0.45rem 0.85rem",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.84rem",
              boxShadow: activeTab === "ready" ? "0 2px 6px rgba(0,0,0,0.08)" : "none"
            }}
          >
            Ready / Dispatched ({vendorOrders.filter(o => ["Ready for Collection", "Out for Delivery"].includes(o.status)).length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            style={{
              background: activeTab === "completed" ? "#FFFFFF" : "transparent",
              color: activeTab === "completed" ? "#15803D" : "#64748B",
              fontWeight: activeTab === "completed" ? 800 : 600,
              padding: "0.45rem 0.85rem",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.84rem",
              boxShadow: activeTab === "completed" ? "0 2px 6px rgba(0,0,0,0.08)" : "none"
            }}
          >
            Completed ({vendorOrders.filter(o => o.status === "Completed").length})
          </button>
        </div>

        {/* Search */}
        <div style={{ position: "relative", minWidth: "260px" }}>
          <Search size={16} color="#94A3B8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            placeholder="Search Order # or Customer..."
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

      {/* Orders Table Container */}
      <div style={{ background: "#FFFFFF", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        {filteredOrders.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#64748B" }}>
            <Package size={44} color="#CBD5E1" style={{ marginBottom: "0.75rem" }} />
            <h3 style={{ color: "#0F172A", marginBottom: "0.3rem" }}>No Orders Found</h3>
            <p style={{ fontSize: "0.88rem" }}>No orders matching this filter currently.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#475569", fontWeight: 700 }}>
                  <th style={{ padding: "1rem" }}>Order Ref</th>
                  <th style={{ padding: "1rem" }}>Customer & WhatsApp</th>
                  <th style={{ padding: "1rem" }}>Fulfillment Mode</th>
                  <th style={{ padding: "1rem" }}>Items Ordered</th>
                  <th style={{ padding: "1rem" }}>Total</th>
                  <th style={{ padding: "1rem" }}>Status & Workflow</th>
                  <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => {
                  const isDelivery = ord.fulfillment_type === "Island Courier Delivery" || ord.type === "COD";
                  const statusColors = getStatusColor(ord.status);
                  const custDigits = cleanDigits(ord.customer_phone);

                  const directWhatsAppUrl = `https://wa.me/${custDigits}?text=${encodeURIComponent(
                    `Hello ${ord.customer_name}! This is ${activeVendor.store_name} regarding your Cayman Bazaar Order #${ord.id || ord.order_id}.`
                  )}`;

                  return (
                    <tr key={ord.id || ord.order_id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      
                      {/* Order Ref */}
                      <td style={{ padding: "1rem", verticalAlign: "top" }}>
                        <div style={{ fontWeight: 900, color: "#0A192F", fontSize: "0.95rem" }}>
                          #{ord.id || ord.order_id}
                        </div>
                        <div style={{ fontSize: "0.74rem", color: "#94A3B8", marginTop: "2px" }}>
                          {new Date(ord.created_at).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Customer & WhatsApp */}
                      <td style={{ padding: "1rem", verticalAlign: "top" }}>
                        <div style={{ fontWeight: 700, color: "#0A192F" }}>{ord.customer_name}</div>
                        <div style={{ fontSize: "0.78rem", color: "#64748B", display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "2px" }}>
                          <Phone size={12} /> {ord.customer_phone}
                        </div>
                        {ord.customer_email && (
                          <div style={{ fontSize: "0.74rem", color: "#94A3B8" }}>{ord.customer_email}</div>
                        )}
                        <a
                          href={directWhatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: "#25D366",
                            color: "#FFFFFF",
                            textDecoration: "none",
                            fontSize: "0.74rem",
                            fontWeight: 800,
                            padding: "0.22rem 0.55rem",
                            borderRadius: "6px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            marginTop: "0.4rem"
                          }}
                        >
                          <MessageSquare size={12} />
                          <span>Chat on WhatsApp</span>
                        </a>
                      </td>

                      {/* Fulfillment */}
                      <td style={{ padding: "1rem", verticalAlign: "top" }}>
                        <span
                          style={{
                            background: isDelivery ? "#EFF6FF" : "#F0FDFA",
                            color: isDelivery ? "#1E40AF" : "#0D9488",
                            border: isDelivery ? "1px solid #BFDBFE" : "1px solid #99F6E4",
                            fontSize: "0.76rem",
                            fontWeight: 800,
                            padding: "0.25rem 0.6rem",
                            borderRadius: "999px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem"
                          }}
                        >
                          {isDelivery ? <Truck size={13} /> : <Store size={13} />}
                          {ord.fulfillment_type || (isDelivery ? "Island Courier Delivery" : "Collection at Stall")}
                        </span>
                        {ord.delivery_address && (
                          <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "0.4rem", maxWidth: "200px" }}>
                            📍 {ord.delivery_address}
                          </div>
                        )}
                        {ord.special_notes && (
                          <div style={{ fontSize: "0.74rem", color: "#0F766E", marginTop: "0.3rem", fontStyle: "italic" }}>
                            "{ord.special_notes}"
                          </div>
                        )}
                      </td>

                      {/* Items */}
                      <td style={{ padding: "1rem", verticalAlign: "top" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                          {ord.items.map((item, i) => (
                            <div key={i} style={{ fontSize: "0.82rem", color: "#334155" }}>
                              <strong>{item.qty}x</strong> {item.title}
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total */}
                      <td style={{ padding: "1rem", verticalAlign: "top" }}>
                        <div style={{ fontWeight: 800, color: "#0A192F", fontSize: "0.95rem" }}>
                          {formatPrice(ord.total_amount)}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: ord.payment_status === "Paid" ? "#16A34A" : "#D97706", fontWeight: 700, marginTop: "2px" }}>
                          ● {ord.payment_status || "Pending"}
                        </div>
                      </td>

                      {/* Status Selector Dropdown */}
                      <td style={{ padding: "1rem", verticalAlign: "top" }}>
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id || ord.order_id, e.target.value)}
                          style={{
                            background: statusColors.bg,
                            color: statusColors.color,
                            fontWeight: 800,
                            fontSize: "0.82rem",
                            padding: "0.4rem 0.65rem",
                            borderRadius: "10px",
                            border: "1.5px solid transparent",
                            cursor: "pointer"
                          }}
                        >
                          {ORDER_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "1rem", verticalAlign: "top", textAlign: "right" }}>
                        <button
                          type="button"
                          onClick={() => setSelectedPrintOrder(ord)}
                          style={{
                            background: "#F8FAFC",
                            border: "1px solid #CBD5E1",
                            color: "#475569",
                            padding: "0.35rem 0.65rem",
                            borderRadius: "8px",
                            fontSize: "0.76rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem"
                          }}
                        >
                          <Printer size={13} /> Slip
                        </button>
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
