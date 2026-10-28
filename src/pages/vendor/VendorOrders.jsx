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
  Calendar,
  AlertCircle
} from "lucide-react";
import PrintReceiptModal from "../../components/PrintReceiptModal";

export default function VendorOrders() {
  const {
    activeVendor,
    orders,
    updateOrderStatus,
    formatPrice,
    toWhatsAppWaMeNumber,
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

  // SOW Status normalization to handle legacy seed values ("Pending" -> "New", "Packing" -> "Processing")
  const normalizeStatus = (status) => {
    if (!status || status === "Pending") return "New";
    if (status === "Packing") return "Processing";
    if (status === "Ready for Pickup") return "Ready for Collection";
    return status;
  };

  // Safe Date Formatter (Prevents "Invalid Date")
  const formatOrderDate = (ord) => {
    const rawDate = ord.createdAt || ord.created_at || ord.date || ord.timestamp;
    if (!rawDate) return "Today";
    const d = new Date(rawDate);
    if (isNaN(d.getTime())) return "Recently";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const cleanDigits = (str) => (str || "").replace(/\D/g, "");

  // Prepare normalized vendor orders
  const vendorOrders = orders
    .filter((o) => o.vendor_id === activeVendor.id)
    .map((o) => ({
      ...o,
      status: normalizeStatus(o.status),
      payment_status: o.payment_status || "Pending",
      items: o.items || []
    }));

  const filteredOrders = vendorOrders.filter((o) => {
    // Tab filter
    if (activeTab === "new" && o.status !== "New") return false;
    if (activeTab === "processing" && !["Processing", "Contacted", "Confirmed"].includes(o.status)) return false;
    if (activeTab === "ready" && !["Ready for Collection", "Out for Delivery"].includes(o.status)) return false;
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

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" };
      case "Contacted":
      case "Confirmed":
        return { bg: "#FEF3C7", color: "#B45309", border: "#FDE68A" };
      case "Processing":
        return { bg: "#F3E8FF", color: "#7E22CE", border: "#E9D5FF" };
      case "Ready for Collection":
        return { bg: "#ECFDF5", color: "#047857", border: "#A7F3D0" };
      case "Out for Delivery":
        return { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" };
      case "Completed":
        return { bg: "#DCFCE7", color: "#15803D", border: "#86EFAC" };
      case "Cancelled":
        return { bg: "#FEE2E2", color: "#B91C1C", border: "#FECACA" };
      default:
        return { bg: "#F1F5F9", color: "#475569", border: "#E2E8F0" };
    }
  };

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem", paddingBottom: "5rem" }}>
      
      {/* Printable Receipt Modal */}
      {selectedPrintOrder && (
        <PrintReceiptModal order={selectedPrintOrder} onClose={() => setSelectedPrintOrder(null)} />
      )}

      {/* 1. PROFESSIONAL COMMAND HEADER */}
      <div
        style={{
          background: "linear-gradient(135deg, #071529 0%, #0D2545 100%)",
          borderRadius: "20px",
          padding: "2rem 2.25rem",
          marginBottom: "2rem",
          border: "1px solid rgba(0, 229, 201, 0.25)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
          color: "#FFFFFF"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.25rem" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#00E5C9", fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.35rem" }}>
              <Store size={14} /> {activeVendor.store_name} • Operational Hub
            </div>
            <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#FFFFFF", margin: 0, letterSpacing: "-0.01em" }}>
              Orders & WhatsApp Fulfillment
            </h1>
            <p style={{ color: "#94A3B8", fontSize: "0.88rem", marginTop: "0.35rem", maxWidth: "600px", lineHeight: 1.5 }}>
              Manage island customer orders, advance workflow fulfillment stages, and message shoppers directly on WhatsApp.
            </p>
          </div>

          {/* KPI Mini-Counters */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <div style={{ background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", padding: "0.65rem 1.1rem", borderRadius: "12px", minWidth: "120px" }}>
              <div style={{ fontSize: "0.7rem", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>Active Orders</div>
              <div style={{ fontSize: "1.45rem", fontWeight: 900, color: "#00E5C9", marginTop: "2px" }}>
                {vendorOrders.filter(o => o.status !== "Completed" && o.status !== "Cancelled").length}
              </div>
            </div>
            <div style={{ background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", padding: "0.65rem 1.1rem", borderRadius: "12px", minWidth: "120px" }}>
              <div style={{ fontSize: "0.7rem", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>Completed</div>
              <div style={{ fontSize: "1.45rem", fontWeight: 900, color: "#10B981", marginTop: "2px" }}>
                {vendorOrders.filter(o => o.status === "Completed").length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FILTER TABS & SEARCH BAR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        
        {/* Status Tab Filters */}
        <div style={{ display: "flex", gap: "0.4rem", background: "#F1F5F9", padding: "4px", borderRadius: "12px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            style={{
              background: activeTab === "all" ? "#FFFFFF" : "transparent",
              color: activeTab === "all" ? "#0F172A" : "#64748B",
              fontWeight: activeTab === "all" ? 800 : 600,
              padding: "0.45rem 0.95rem",
              borderRadius: "9px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.84rem",
              boxShadow: activeTab === "all" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s"
            }}
          >
            All ({vendorOrders.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("new")}
            style={{
              background: activeTab === "new" ? "#FFFFFF" : "transparent",
              color: activeTab === "new" ? "#1D4ED8" : "#64748B",
              fontWeight: activeTab === "new" ? 800 : 600,
              padding: "0.45rem 0.95rem",
              borderRadius: "9px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.84rem",
              boxShadow: activeTab === "new" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s"
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
              padding: "0.45rem 0.95rem",
              borderRadius: "9px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.84rem",
              boxShadow: activeTab === "processing" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s"
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
              padding: "0.45rem 0.95rem",
              borderRadius: "9px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.84rem",
              boxShadow: activeTab === "ready" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s"
            }}
          >
            Ready for Collection ({vendorOrders.filter(o => ["Ready for Collection", "Out for Delivery"].includes(o.status)).length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            style={{
              background: activeTab === "completed" ? "#FFFFFF" : "transparent",
              color: activeTab === "completed" ? "#15803D" : "#64748B",
              fontWeight: activeTab === "completed" ? 800 : 600,
              padding: "0.45rem 0.95rem",
              borderRadius: "9px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.84rem",
              boxShadow: activeTab === "completed" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s"
            }}
          >
            Completed ({vendorOrders.filter(o => o.status === "Completed").length})
          </button>
        </div>

        {/* Search Input */}
        <div style={{ position: "relative", minWidth: "270px" }}>
          <Search size={16} color="#94A3B8" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            placeholder="Search Order #, Customer, Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: "40px",
              paddingRight: "14px",
              paddingTop: "0.55rem",
              paddingBottom: "0.55rem",
              borderRadius: "10px",
              border: "1.5px solid #CBD5E1",
              fontSize: "0.86rem",
              width: "100%",
              outline: "none",
              background: "#FFFFFF"
            }}
          />
        </div>

      </div>

      {/* 3. STRUCTURED DATA TABLE */}
      <div style={{ background: "#FFFFFF", borderRadius: "18px", border: "1.5px solid #E2E8F0", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        {filteredOrders.length === 0 ? (
          <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#64748B" }}>
            <Package size={48} color="#CBD5E1" style={{ display: "block", margin: "0 auto 0.75rem auto" }} />
            <h3 style={{ color: "#0F172A", fontWeight: 800, marginBottom: "0.25rem", fontSize: "1.15rem" }}>No Orders in this View</h3>
            <p style={{ fontSize: "0.88rem" }}>No customer orders found matching the selected filter criteria.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1.5px solid #E2E8F0", color: "#475569", fontWeight: 800, fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  <th style={{ padding: "1rem 1.15rem", width: "145px" }}>Order Ref</th>
                  <th style={{ padding: "1rem 1.15rem", width: "210px" }}>Customer Details</th>
                  <th style={{ padding: "1rem 1.15rem", width: "220px" }}>Fulfillment Mode</th>
                  <th style={{ padding: "1rem 1.15rem" }}>Items Summary</th>
                  <th style={{ padding: "1rem 1.15rem", width: "140px" }}>Amount</th>
                  <th style={{ padding: "1rem 1.15rem", width: "175px" }}>Workflow Status</th>
                  <th style={{ padding: "1rem 1.15rem", width: "190px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => {
                  const isDelivery = ord.fulfillment_type === "Island Courier Delivery" || ord.type === "COD";
                  const statusColors = getStatusColor(ord.status);
                  const custDigits = toWhatsAppWaMeNumber ? toWhatsAppWaMeNumber(ord.customer_phone) : cleanDigits(ord.customer_phone);

                  const directWhatsAppUrl = `https://wa.me/${custDigits}?text=${encodeURIComponent(
                    `Hello ${ord.customer_name}! This is ${activeVendor.store_name} regarding your Cayman Bazaar Order #${ord.id || ord.order_id}.`
                  )}`;

                  return (
                    <tr
                      key={ord.id || ord.order_id}
                      style={{
                        borderBottom: "1px solid #F1F5F9",
                        transition: "background 0.15s ease"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      
                      {/* 1. Order Ref & Valid Date */}
                      <td style={{ padding: "1.1rem 1.15rem", verticalAlign: "middle", whiteSpace: "nowrap" }}>
                        <span
                          style={{
                            fontFamily: "monospace",
                            fontWeight: 900,
                            fontSize: "0.92rem",
                            color: "#0F172A",
                            background: "#F1F5F9",
                            padding: "0.22rem 0.55rem",
                            borderRadius: "6px",
                            border: "1px solid #E2E8F0",
                            display: "inline-block"
                          }}
                        >
                          #{ord.id || ord.order_id}
                        </span>
                        <div style={{ fontSize: "0.74rem", color: "#64748B", marginTop: "5px", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <Calendar size={12} color="#94A3B8" />
                          <span>{formatOrderDate(ord)}</span>
                        </div>
                      </td>

                      {/* 2. Customer Contact */}
                      <td style={{ padding: "1.1rem 1.15rem", verticalAlign: "middle" }}>
                        <div style={{ fontWeight: 800, color: "#0F172A", fontSize: "0.92rem" }}>
                          {ord.customer_name}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#475569", display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "3px" }}>
                          <Phone size={12} color="#00A896" />
                          <span>{ord.customer_phone}</span>
                        </div>
                        {ord.customer_email && (
                          <div style={{ fontSize: "0.74rem", color: "#64748B", marginTop: "2px" }}>
                            {ord.customer_email}
                          </div>
                        )}
                      </td>

                      {/* 3. Fulfillment Mode */}
                      <td style={{ padding: "1.1rem 1.15rem", verticalAlign: "middle" }}>
                        <span
                          style={{
                            background: isDelivery ? "#EFF6FF" : "#F0FDFA",
                            color: isDelivery ? "#1E40AF" : "#0D9488",
                            border: isDelivery ? "1px solid #BFDBFE" : "1px solid #99F6E4",
                            fontSize: "0.74rem",
                            fontWeight: 800,
                            padding: "0.22rem 0.6rem",
                            borderRadius: "999px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem"
                          }}
                        >
                          {isDelivery ? <Truck size={13} /> : <Store size={13} />}
                          {ord.fulfillment_type || (isDelivery ? "Courier Delivery" : "Collection at Stall")}
                        </span>

                        {ord.delivery_address && (
                          <div style={{ fontSize: "0.76rem", color: "#475569", marginTop: "0.35rem", lineHeight: 1.35 }}>
                            📍 {ord.delivery_address}
                          </div>
                        )}

                        {ord.special_notes && ord.special_notes.trim() && (
                          <div
                            style={{
                              fontSize: "0.74rem",
                              color: "#0F766E",
                              background: "rgba(13, 148, 136, 0.08)",
                              border: "1px dashed rgba(13, 148, 136, 0.3)",
                              borderRadius: "6px",
                              padding: "0.25rem 0.5rem",
                              marginTop: "0.35rem",
                              lineHeight: 1.3
                            }}
                          >
                            💬 Note: <em>"{ord.special_notes}"</em>
                          </div>
                        )}
                      </td>

                      {/* 4. Items Summary */}
                      <td style={{ padding: "1.1rem 1.15rem", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                          {ord.items && ord.items.length > 0 ? (
                            ord.items.map((item, i) => (
                              <div key={i} style={{ fontSize: "0.82rem", color: "#334155", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                <span style={{ background: "#E2E8F0", color: "#0F172A", fontWeight: 800, fontSize: "0.72rem", padding: "0.1rem 0.45rem", borderRadius: "4px" }}>
                                  {item.qty}x
                                </span>
                                <span style={{ fontWeight: 600 }}>{item.title}</span>
                              </div>
                            ))
                          ) : (
                            <span style={{ fontSize: "0.8rem", color: "#64748B" }}>1x Island Specialty Item</span>
                          )}
                        </div>
                      </td>

                      {/* 5. Total Amount & Payment Badge */}
                      <td style={{ padding: "1.1rem 1.15rem", verticalAlign: "middle", whiteSpace: "nowrap" }}>
                        <div style={{ fontWeight: 900, color: "#0A192F", fontSize: "1rem" }}>
                          ${Number(ord.total_amount || 0).toFixed(2)}{" "}
                          <span style={{ fontSize: "0.76rem", color: "#64748B", fontWeight: 700 }}>KYD</span>
                        </div>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            padding: "0.15rem 0.55rem",
                            borderRadius: "999px",
                            marginTop: "4px",
                            background: ord.payment_status === "Paid" ? "#DCFCE7" : "#FEF3C7",
                            color: ord.payment_status === "Paid" ? "#15803D" : "#B45309",
                            border: ord.payment_status === "Paid" ? "1px solid #86EFAC" : "1px solid #FDE68A"
                          }}
                        >
                          ● {ord.payment_status || "Pending"}
                        </div>
                      </td>

                      {/* 6. Status Selector Dropdown */}
                      <td style={{ padding: "1.1rem 1.15rem", verticalAlign: "middle" }}>
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id || ord.order_id, e.target.value)}
                          style={{
                            background: statusColors.bg,
                            color: statusColors.color,
                            fontWeight: 800,
                            fontSize: "0.82rem",
                            padding: "0.45rem 0.75rem",
                            borderRadius: "10px",
                            border: `1.5px solid ${statusColors.border}`,
                            cursor: "pointer",
                            outline: "none",
                            width: "100%",
                            maxWidth: "165px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.04)"
                          }}
                        >
                          {ORDER_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* 7. Combined Action Center (WhatsApp + Print Slip) */}
                      <td style={{ padding: "1.1rem 1.15rem", verticalAlign: "middle", textAlign: "right", whiteSpace: "nowrap" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
                          <a
                            href={directWhatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background: "#25D366",
                              color: "#FFFFFF",
                              textDecoration: "none",
                              fontSize: "0.78rem",
                              fontWeight: 800,
                              padding: "0.42rem 0.75rem",
                              borderRadius: "8px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                              boxShadow: "0 2px 6px rgba(37, 211, 102, 0.3)",
                              transition: "transform 0.15s ease"
                            }}
                            title="Chat with Customer on WhatsApp"
                          >
                            <MessageSquare size={13} />
                            <span>WhatsApp</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => setSelectedPrintOrder(ord)}
                            style={{
                              background: "#FFFFFF",
                              border: "1.5px solid #CBD5E1",
                              color: "#475569",
                              padding: "0.42rem 0.65rem",
                              borderRadius: "8px",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                              transition: "all 0.15s ease"
                            }}
                            title="Print Official Order Slip"
                          >
                            <Printer size={13} />
                            <span>Slip</span>
                          </button>
                        </div>
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
