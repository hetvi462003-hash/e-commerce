import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import {
  Package,
  Clock,
  DollarSign,
  CheckCircle2,
  Search,
  Filter,
  MessageSquare,
  ExternalLink,
  Store,
  Truck,
  User,
  Phone,
  ShieldCheck,
  Calendar,
  Printer,
  Sparkles,
  MapPin,
  CreditCard,
  AlertCircle
} from "lucide-react";
import PrintReceiptModal from "../../components/PrintReceiptModal";

export default function AdminOrders() {
  const {
    orders,
    vendors,
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
    ],
    toWhatsAppWaMeNumber
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrintOrder, setSelectedPrintOrder] = useState(null);

  const cleanDigits = (str) => (str || "").replace(/\D/g, "");

  const normalizeStatus = (status) => {
    if (!status || status === "Pending") return "New";
    if (status === "Packing") return "Processing";
    if (status === "Ready for Pickup") return "Ready for Collection";
    return status;
  };

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

  const normalizedOrders = orders.map((o) => ({
    ...o,
    status: normalizeStatus(o.status),
    payment_status: o.payment_status || "Pending",
    items: o.items || []
  }));

  // KPI Calculations
  const totalOrdersCount = normalizedOrders.length;
  const actionRequiredCount = normalizedOrders.filter((o) =>
    ["New", "Contacted", "Confirmed", "Processing"].includes(o.status)
  ).length;
  const completedCount = normalizedOrders.filter((o) => o.status === "Completed").length;
  const totalGrossVolume = normalizedOrders.reduce((acc, o) => acc + (o.total_amount || 0), 0);
  const totalCommissions = normalizedOrders.reduce(
    (acc, o) => acc + (o.commission_amount || (o.total_amount || 0) * 0.1),
    0
  );

  // Filter Logic
  const filteredOrders = normalizedOrders.filter((o) => {
    // 1. Tab filter
    if (activeTab === "new" && o.status !== "New") return false;
    if (
      activeTab === "in_progress" &&
      !["Processing", "Contacted", "Confirmed", "Ready for Collection", "Out for Delivery"].includes(o.status)
    )
      return false;
    if (activeTab === "completed" && o.status !== "Completed") return false;
    if (activeTab === "cancelled" && o.status !== "Cancelled") return false;

    // 2. Vendor filter
    if (vendorFilter !== "all" && o.vendor_id !== vendorFilter && o.vendor_name !== vendorFilter)
      return false;

    // 3. Payment status filter
    if (paymentFilter !== "all" && (o.payment_status || "Pending") !== paymentFilter)
      return false;

    // 4. Search query
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
      
      {/* Printable Slip Modal */}
      {selectedPrintOrder && (
        <PrintReceiptModal
          order={selectedPrintOrder}
          onClose={() => setSelectedPrintOrder(null)}
        />
      )}

      {/* 1. EXECUTIVE SUPERADMIN COMMAND HEADER */}
      <div
        style={{
          background: "linear-gradient(135deg, #1C1004 0%, #2A1705 50%, #0A1628 100%)",
          borderRadius: "22px",
          padding: "2rem 2.25rem",
          marginBottom: "2rem",
          border: "1px solid rgba(245, 158, 11, 0.35)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
          color: "#FFFFFF"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", color: "#FBBF24", fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
              <ShieldCheck size={15} /> Platform SuperAdmin Governance • Grand Cayman Ledger
            </div>
            <h1 style={{ fontSize: "2.1rem", fontWeight: 900, color: "#FFFFFF", margin: 0, letterSpacing: "-0.01em" }}>
              Marketplace Order Audits & Fulfillment
            </h1>
            <p style={{ color: "#94A3B8", fontSize: "0.9rem", marginTop: "0.4rem", maxWidth: "680px", lineHeight: 1.5 }}>
              Central multi-vendor transaction monitoring, direct WhatsApp customer concierge, fulfillment tracking, and 10% platform take-rate reconciliation.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>
            <div style={{ background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", padding: "0.75rem 1.25rem", borderRadius: "14px", textAlign: "right" }}>
              <div style={{ fontSize: "0.74rem", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>Total Gross Volume</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#FFFFFF" }}>${totalGrossVolume.toFixed(2)} KYD</div>
            </div>
            <div style={{ background: "rgba(245, 158, 11, 0.12)", border: "1px solid rgba(245, 158, 11, 0.35)", padding: "0.75rem 1.25rem", borderRadius: "14px", textAlign: "right" }}>
              <div style={{ fontSize: "0.74rem", color: "#FDE68A", fontWeight: 700, textTransform: "uppercase" }}>10% Platform Take</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#FBBF24" }}>+${totalCommissions.toFixed(2)} KYD</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE 4 KPI METRIC CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem"
        }}
      >
        {/* Card 1: Total Orders */}
        <div style={{ background: "#FFFFFF", borderRadius: "16px", border: "1.5px solid #E2E8F0", padding: "1.35rem 1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.04em" }}>Total Orders</span>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#EFF6FF", color: "#1D4ED8", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Package size={18} />
            </div>
          </div>
          <div style={{ fontSize: "1.85rem", fontWeight: 900, color: "#0F172A", lineHeight: 1 }}>{totalOrdersCount}</div>
          <div style={{ fontSize: "0.76rem", color: "#64748B", marginTop: "0.4rem" }}>Across all 5 island stall pavilions</div>
        </div>

        {/* Card 2: Action Required */}
        <div style={{ background: "#FFFFFF", borderRadius: "16px", border: "1.5px solid #FDE68A", padding: "1.35rem 1.25rem", boxShadow: "0 2px 8px rgba(245, 158, 11, 0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#B45309", textTransform: "uppercase", letterSpacing: "0.04em" }}>Action Required</span>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#FEF3C7", color: "#B45309", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: "1.85rem", fontWeight: 900, color: "#B45309", lineHeight: 1, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>{actionRequiredCount}</span>
            {actionRequiredCount > 0 && (
              <span style={{ fontSize: "0.72rem", background: "#DCFCE7", color: "#15803D", padding: "0.15rem 0.5rem", borderRadius: "999px", fontWeight: 800 }}>
                ● Active
              </span>
            )}
          </div>
          <div style={{ fontSize: "0.76rem", color: "#92400E", marginTop: "0.4rem" }}>New & Processing orders</div>
        </div>

        {/* Card 3: Completed Orders */}
        <div style={{ background: "#FFFFFF", borderRadius: "16px", border: "1.5px solid #E2E8F0", padding: "1.35rem 1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.04em" }}>Fulfilled & Paid</span>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#DCFCE7", color: "#15803D", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: "1.85rem", fontWeight: 900, color: "#0F172A", lineHeight: 1 }}>{completedCount}</div>
          <div style={{ fontSize: "0.76rem", color: "#15803D", marginTop: "0.4rem" }}>Delivered or picked up successfully</div>
        </div>

        {/* Card 4: 10% Platform Revenue */}
        <div style={{ background: "#FFFFFF", borderRadius: "16px", border: "1.5px solid #E2E8F0", padding: "1.35rem 1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.04em" }}>10% Platform Revenue</span>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#FEF3C7", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: "1.85rem", fontWeight: 900, color: "#0F172A", lineHeight: 1 }}>${totalCommissions.toFixed(2)}</div>
          <div style={{ fontSize: "0.76rem", color: "#64748B", marginTop: "0.4rem" }}>Automated 10% Flat Take-Rate</div>
        </div>
      </div>

      {/* 3. SEGMENTED FILTER TABS & SEARCH / DROPDOWN CONTROLS */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "18px",
          border: "1.5px solid #E2E8F0",
          padding: "1.25rem",
          marginBottom: "1.5rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
        }}
      >
        {/* Workflow Segmented Tabs */}
        <div
          style={{
            display: "inline-flex",
            background: "#F1F5F9",
            padding: "4px",
            borderRadius: "12px",
            gap: "4px",
            flexWrap: "wrap"
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            style={{
              background: activeTab === "all" ? "#FFFFFF" : "transparent",
              color: activeTab === "all" ? "#0F172A" : "#64748B",
              fontWeight: activeTab === "all" ? 800 : 600,
              padding: "0.5rem 0.95rem",
              borderRadius: "9px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.84rem",
              boxShadow: activeTab === "all" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s"
            }}
          >
            All Orders ({totalOrdersCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("new")}
            style={{
              background: activeTab === "new" ? "#FFFFFF" : "transparent",
              color: activeTab === "new" ? "#1D4ED8" : "#64748B",
              fontWeight: activeTab === "new" ? 800 : 600,
              padding: "0.5rem 0.95rem",
              borderRadius: "9px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.84rem",
              boxShadow: activeTab === "new" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s"
            }}
          >
            New ({normalizedOrders.filter((o) => o.status === "New").length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("in_progress")}
            style={{
              background: activeTab === "in_progress" ? "#FFFFFF" : "transparent",
              color: activeTab === "in_progress" ? "#7E22CE" : "#64748B",
              fontWeight: activeTab === "in_progress" ? 800 : 600,
              padding: "0.5rem 0.95rem",
              borderRadius: "9px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.84rem",
              boxShadow: activeTab === "in_progress" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s"
            }}
          >
            In-Progress ({normalizedOrders.filter((o) => ["Processing", "Contacted", "Confirmed", "Ready for Collection", "Out for Delivery"].includes(o.status)).length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            style={{
              background: activeTab === "completed" ? "#FFFFFF" : "transparent",
              color: activeTab === "completed" ? "#15803D" : "#64748B",
              fontWeight: activeTab === "completed" ? 800 : 600,
              padding: "0.5rem 0.95rem",
              borderRadius: "9px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.84rem",
              boxShadow: activeTab === "completed" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s"
            }}
          >
            Completed ({completedCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cancelled")}
            style={{
              background: activeTab === "cancelled" ? "#FFFFFF" : "transparent",
              color: activeTab === "cancelled" ? "#B91C1C" : "#64748B",
              fontWeight: activeTab === "cancelled" ? 800 : 600,
              padding: "0.5rem 0.95rem",
              borderRadius: "9px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.84rem",
              boxShadow: activeTab === "cancelled" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s"
            }}
          >
            Cancelled ({normalizedOrders.filter((o) => o.status === "Cancelled").length})
          </button>
        </div>

        {/* Dropdown Filters & Search */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          
          {/* Vendor Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#64748B" }}>Stall:</span>
            <select
              value={vendorFilter}
              onChange={(e) => setVendorFilter(e.target.value)}
              style={{
                padding: "0.5rem 0.85rem",
                borderRadius: "10px",
                border: "1.5px solid #CBD5E1",
                fontSize: "0.84rem",
                fontWeight: 600,
                outline: "none",
                background: "#F8FAFC",
                color: "#0F172A",
                cursor: "pointer"
              }}
            >
              <option value="all">All Island Stalls</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.store_name} ({v.district})
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#64748B" }}>Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              style={{
                padding: "0.5rem 0.85rem",
                borderRadius: "10px",
                border: "1.5px solid #CBD5E1",
                fontSize: "0.84rem",
                fontWeight: 600,
                outline: "none",
                background: "#F8FAFC",
                color: "#0F172A",
                cursor: "pointer"
              }}
            >
              <option value="all">All Payments</option>
              {PAYMENT_STATUSES.map((pst) => (
                <option key={pst} value={pst}>
                  {pst}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div style={{ position: "relative", minWidth: "250px" }}>
            <Search
              size={16}
              color="#94A3B8"
              style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              type="text"
              placeholder="Search Order #, Customer, Stall..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                paddingLeft: "40px",
                paddingRight: "14px",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                borderRadius: "10px",
                border: "1.5px solid #CBD5E1",
                fontSize: "0.86rem",
                width: "100%",
                outline: "none",
                background: "#F8FAFC"
              }}
            />
          </div>

        </div>

      </div>

      {/* 4. SPACIOUS ENTERPRISE DATA TABLE */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "20px",
          border: "1.5px solid #E2E8F0",
          boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
          overflow: "hidden"
        }}
      >
        {filteredOrders.length === 0 ? (
          <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#64748B" }}>
            <Package size={48} color="#CBD5E1" style={{ display: "block", margin: "0 auto 0.75rem auto" }} />
            <h3 style={{ color: "#0F172A", fontWeight: 800, marginBottom: "0.25rem", fontSize: "1.15rem" }}>
              No Orders Found
            </h3>
            <p style={{ fontSize: "0.88rem" }}>
              No marketplace transactions match the selected filters or search query.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", textAlign: "left" }}>
              <thead>
                <tr
                  style={{
                    background: "#F8FAFC",
                    borderBottom: "1.5px solid #E2E8F0",
                    color: "#475569",
                    fontWeight: 800,
                    fontSize: "0.76rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em"
                  }}
                >
                  <th style={{ padding: "1.1rem 1.25rem", width: "145px" }}>Order Ref</th>
                  <th style={{ padding: "1.1rem 1.25rem", width: "235px" }}>Merchant Pavilion</th>
                  <th style={{ padding: "1.1rem 1.25rem", width: "210px" }}>Customer Details</th>
                  <th style={{ padding: "1.1rem 1.25rem", width: "220px" }}>Fulfillment Mode</th>
                  <th style={{ padding: "1.1rem 1.25rem", width: "165px" }}>Order Amount & 10% Take</th>
                  <th style={{ padding: "1.1rem 1.25rem", width: "175px" }}>Order Status</th>
                  <th style={{ padding: "1.1rem 1.25rem", width: "165px" }}>Payment Status</th>
                  <th style={{ padding: "1.1rem 1.25rem", width: "185px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => {
                  const isDelivery = ord.fulfillment_type === "Island Courier Delivery" || ord.type === "COD";
                  const statusColors = getStatusColor(ord.status);
                  const custDigits = toWhatsAppWaMeNumber ? toWhatsAppWaMeNumber(ord.customer_phone) : cleanDigits(ord.customer_phone);

                  const directWhatsAppUrl = `https://wa.me/${custDigits}?text=${encodeURIComponent(
                    `Hello ${ord.customer_name}! This is Cayman Bazaar Platform Admin regarding your Order #${ord.id || ord.order_id}.`
                  )}`;

                  const orderCommission = ord.commission_amount || (ord.total_amount || 0) * 0.1;

                  return (
                    <React.Fragment key={ord.id || ord.order_id}>
                      <tr
                        style={{
                          borderBottom: ord.special_notes ? "none" : "1px solid #F1F5F9",
                          transition: "background 0.15s ease"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        
                        {/* 1. Order Ref & Valid Date */}
                        <td style={{ padding: "1.15rem 1.25rem", verticalAlign: "middle", whiteSpace: "nowrap" }}>
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

                        {/* 2. Merchant Pavilion */}
                        <td style={{ padding: "1.15rem 1.25rem", verticalAlign: "middle" }}>
                          <div style={{ fontWeight: 800, color: "#0F172A", fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                            <Store size={14} color="#F59E0B" />
                            <span>{ord.vendor_name || "Cayman Merchant"}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "3px" }}>
                            <span style={{ fontSize: "0.72rem", color: "#475569", background: "#F1F5F9", padding: "0.1rem 0.45rem", borderRadius: "4px", fontWeight: 700 }}>
                              {ord.items?.length || 1} product(s)
                            </span>
                            {ord.pickup_location && (
                              <span style={{ fontSize: "0.72rem", color: "#64748B" }}>
                                • {ord.pickup_location.split(",")[0]}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 3. Customer Details */}
                        <td style={{ padding: "1.15rem 1.25rem", verticalAlign: "middle" }}>
                          <div style={{ fontWeight: 800, color: "#0F172A", fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                            <User size={13} color="#64748B" />
                            <span>{ord.customer_name}</span>
                          </div>
                          <div style={{ fontSize: "0.78rem", color: "#475569", display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "3px" }}>
                            <Phone size={12} color="#00A896" />
                            <span>{ord.customer_phone}</span>
                          </div>
                          {ord.customer_email && (
                            <div style={{ fontSize: "0.72rem", color: "#64748B", marginTop: "2px" }}>
                              {ord.customer_email}
                            </div>
                          )}
                        </td>

                        {/* 4. Fulfillment Mode */}
                        <td style={{ padding: "1.15rem 1.25rem", verticalAlign: "middle" }}>
                          <span
                            style={{
                              background: isDelivery ? "#EFF6FF" : "#F0FDFA",
                              color: isDelivery ? "#1E40AF" : "#0D9488",
                              border: isDelivery ? "1px solid #BFDBFE" : "1px solid #99F6E4",
                              fontSize: "0.74rem",
                              fontWeight: 800,
                              padding: "0.25rem 0.65rem",
                              borderRadius: "999px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem"
                            }}
                          >
                            {isDelivery ? <Truck size={12} /> : <Store size={12} />}
                            {ord.fulfillment_type || (isDelivery ? "Island Courier Delivery" : "Collection at Stall")}
                          </span>
                          {ord.delivery_address && (
                            <div style={{ fontSize: "0.74rem", color: "#64748B", marginTop: "4px", display: "flex", alignItems: "flex-start", gap: "0.25rem", maxWidth: "210px", lineHeight: 1.35 }}>
                              <MapPin size={12} color="#EF4444" style={{ flexShrink: 0, marginTop: "2px" }} />
                              <span>{ord.delivery_address}</span>
                            </div>
                          )}
                        </td>

                        {/* 5. Financials & 10% Commission */}
                        <td style={{ padding: "1.15rem 1.25rem", verticalAlign: "middle" }}>
                          <div style={{ fontWeight: 900, color: "#0F172A", fontSize: "1rem" }}>
                            {formatPrice(ord.total_amount)}
                          </div>
                          <div style={{ marginTop: "3px" }}>
                            <span style={{ fontSize: "0.72rem", background: "#DCFCE7", color: "#15803D", padding: "0.15rem 0.45rem", borderRadius: "5px", fontWeight: 800, display: "inline-block" }}>
                              +${orderCommission.toFixed(2)} KYD (10%)
                            </span>
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "#64748B", marginTop: "3px" }}>
                            {ord.payment_method || (isDelivery ? "Cash on Delivery" : "Cash on Collection")}
                          </div>
                        </td>

                        {/* 6. Order Workflow Status */}
                        <td style={{ padding: "1.15rem 1.25rem", verticalAlign: "middle" }}>
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id || ord.order_id, e.target.value)}
                            style={{
                              background: statusColors.bg,
                              color: statusColors.color,
                              border: `1.5px solid ${statusColors.border}`,
                              fontWeight: 800,
                              fontSize: "0.8rem",
                              padding: "0.4rem 0.65rem",
                              borderRadius: "10px",
                              cursor: "pointer",
                              outline: "none",
                              width: "100%",
                              maxWidth: "165px"
                            }}
                          >
                            {ORDER_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* 7. Payment Status */}
                        <td style={{ padding: "1.15rem 1.25rem", verticalAlign: "middle" }}>
                          <select
                            value={ord.payment_status || "Pending"}
                            onChange={(e) => updateOrderStatus(ord.id || ord.order_id, null, e.target.value)}
                            style={{
                              background: ord.payment_status === "Paid" ? "#DCFCE7" : "#FFF7ED",
                              color: ord.payment_status === "Paid" ? "#166534" : "#C2410C",
                              border: ord.payment_status === "Paid" ? "1.5px solid #86EFAC" : "1.5px solid #FED7AA",
                              fontWeight: 800,
                              fontSize: "0.8rem",
                              padding: "0.4rem 0.65rem",
                              borderRadius: "10px",
                              cursor: "pointer",
                              outline: "none",
                              width: "100%",
                              minWidth: "135px"
                            }}
                          >
                            {PAYMENT_STATUSES.map((pst) => (
                              <option key={pst} value={pst}>
                                {pst}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* 8. SuperAdmin Action Buttons */}
                        <td style={{ padding: "1.15rem 1.25rem", verticalAlign: "middle", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "0.4rem", alignItems: "center" }}>
                            {/* WhatsApp Button */}
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
                                padding: "0.45rem 0.75rem",
                                borderRadius: "8px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                boxShadow: "0 2px 6px rgba(37, 211, 102, 0.25)"
                              }}
                              title="Chat with Customer on WhatsApp"
                            >
                              <MessageSquare size={13} />
                              <span>WhatsApp</span>
                            </a>

                            {/* Print Slip Button */}
                            <button
                              type="button"
                              onClick={() => setSelectedPrintOrder(ord)}
                              style={{
                                background: "#F1F5F9",
                                border: "1px solid #CBD5E1",
                                color: "#334155",
                                padding: "0.45rem 0.65rem",
                                borderRadius: "8px",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                fontSize: "0.78rem",
                                fontWeight: 700
                              }}
                              title="Inspect & Print Merchant Packing Slip"
                            >
                              <Printer size={13} />
                            </button>
                          </div>
                        </td>

                      </tr>

                      {/* Customer Note Callout (If exists) */}
                      {ord.special_notes && (
                        <tr style={{ background: "#FEFCE8", borderBottom: "1px solid #F1F5F9" }}>
                          <td colSpan={8} style={{ padding: "0.5rem 1.25rem 0.75rem", fontSize: "0.78rem", color: "#854D0E" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <span style={{ fontWeight: 800, background: "#FEF08A", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>
                                💬 Customer Note
                              </span>
                              <em>"{ord.special_notes}"</em>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
