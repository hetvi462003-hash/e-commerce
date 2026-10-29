import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import ReviewModal from "../../components/ReviewModal";
import PrintReceiptModal from "../../components/PrintReceiptModal";
import {
  PackageCheck,
  Clock,
  DollarSign,
  CheckCircle2,
  MapPin,
  Calendar,
  Store,
  ShieldCheck,
  Lock,
  Search,
  Smartphone,
  LogOut,
  ArrowRight,
  Star,
  Printer,
  Truck,
  MessageSquare,
  ExternalLink,
  AlertCircle
} from "lucide-react";

export default function MyOrdersPage({ setActiveTab }) {
  const {
    orders,
    formatPrice,
    customerPhoneSession,
    setCustomerPhoneSession,
    customerProfile,
    clearCustomerSession,
    showToast,
    CENTRAL_MARKETPLACE_WHATSAPP,
    CENTRAL_MARKETPLACE_PHONE_DISPLAY
  } = useMarketplace();

  const [selectedReviewOrder, setSelectedReviewOrder] = useState(null);
  const [selectedPrintOrder, setSelectedPrintOrder] = useState(null);
  const [lookupInput, setLookupInput] = useState("");

  // Clean phone digits helper
  const cleanDigits = (str) => (str || "").replace(/\D/g, "");

  // Filter orders: ONLY show orders belonging to this active customer session
  const customerOrders = orders.filter((o) => {
    const activeContact = customerPhoneSession || customerProfile?.phone || customerProfile?.email;
    if (!activeContact) return false;

    const sPhone = cleanDigits(customerPhoneSession || customerProfile?.phone);
    const oPhone = cleanDigits(o.customer_phone);

    const matchesPhone = Boolean(sPhone && oPhone && (oPhone.includes(sPhone) || sPhone.includes(oPhone)));
    
    const userEmail = (customerProfile?.email || (customerPhoneSession && customerPhoneSession.includes("@") ? customerPhoneSession : "")).toLowerCase().trim();
    const matchesEmail = Boolean(userEmail && o.customer_email && o.customer_email.toLowerCase().trim() === userEmail);

    const orderIdMatch = Boolean(customerPhoneSession && (o.id?.toLowerCase() === customerPhoneSession.toLowerCase().trim() || o.order_id?.toLowerCase() === customerPhoneSession.toLowerCase().trim()));

    return matchesPhone || matchesEmail || orderIdMatch;
  });

  const handleLookupSubmit = (e) => {
    e.preventDefault();
    if (!lookupInput.trim()) {
      showToast("Please enter your Phone Number or Order Reference (#CB-XXXX)", "warning");
      return;
    }
    setCustomerPhoneSession(lookupInput.trim());
    showToast(`Accessing private orders for: ${lookupInput.trim()}`, "success");
  };

  // Milestone progression for client 9-status workflow
  const getWorkflowStep = (status, fulfillmentType) => {
    const isDelivery = fulfillmentType === "Island Courier Delivery";
    const milestoneSteps = [
      "New",
      "Confirmed",
      "Processing",
      isDelivery ? "Out for Delivery" : "Ready for Collection",
      "Completed"
    ];

    const statusHierarchy = {
      "New": 0,
      "Contacted": 0,
      "Confirmed": 1,
      "Awaiting Payment": 1,
      "Processing": 2,
      "Ready for Collection": 3,
      "Out for Delivery": 3,
      "Completed": 4,
      "Cancelled": -1
    };

    const currentLevel = statusHierarchy[status] !== undefined ? statusHierarchy[status] : 0;
    return { milestoneSteps, currentLevel };
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "New":
        return { background: "#E0F2FE", color: "#0369A1", border: "1px solid #BAE6FD" };
      case "Contacted":
      case "Confirmed":
        return { background: "#FEF3C7", color: "#B45309", border: "1px solid #FDE68A" };
      case "Awaiting Payment":
        return { background: "#FFF7ED", color: "#C2410C", border: "1px solid #FFEDD5" };
      case "Processing":
        return { background: "#F3E8FF", color: "#7E22CE", border: "1px solid #E9D5FF" };
      case "Ready for Collection":
        return { background: "#ECFDF5", color: "#047857", border: "1px solid #A7F3D0" };
      case "Out for Delivery":
        return { background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE" };
      case "Completed":
        return { background: "#DCFCE7", color: "#15803D", border: "1px solid #86EFAC" };
      case "Cancelled":
        return { background: "#FEE2E2", color: "#B91C1C", border: "1px solid #FCA5A5" };
      default:
        return { background: "#F1F5F9", color: "#475569", border: "1px solid #E2E8F0" };
    }
  };

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem", paddingBottom: "5rem" }}>
      
      {/* Verified Buyer Review Modal */}
      {selectedReviewOrder && (
        <ReviewModal order={selectedReviewOrder} onClose={() => setSelectedReviewOrder(null)} />
      )}

      {/* Printable Receipt Modal */}
      {selectedPrintOrder && (
        <PrintReceiptModal order={selectedPrintOrder} onClose={() => setSelectedPrintOrder(null)} />
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#00A896", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>
            <Lock size={15} /> Private Customer Portal
          </div>
          <h1 style={{ fontSize: "2.2rem", color: "#0F172A", marginBottom: "0.2rem", fontWeight: 900 }}>
            My Marketplace Orders
          </h1>
          <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
            Track the status of your WhatsApp order requests across Grand Cayman island merchants.
          </p>
        </div>

        {(customerPhoneSession || customerProfile) && (
          <div style={{
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            padding: "0.55rem 1.1rem",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            gap: "0.85rem"
          }}>
            <div style={{ fontSize: "0.84rem", color: "#166534", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <ShieldCheck size={16} /> Verified Shopper:{" "}
              <span style={{ color: "#0F172A" }}>
                {customerProfile?.name
                  ? `${customerProfile.name} (${customerPhoneSession || customerProfile.email || customerProfile.phone})`
                  : customerPhoneSession || customerProfile?.email || customerProfile?.phone}
              </span>
            </div>
            <button
              onClick={clearCustomerSession}
              style={{
                background: "#FFFFFF",
                border: "1px solid #CBD5E1",
                padding: "0.3rem 0.65rem",
                borderRadius: "8px",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#64748B",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem"
              }}
            >
              <LogOut size={12} /> Switch
            </button>
          </div>
        )}
      </div>

      {/* PRIVACY GATE: If no session or no matching orders */}
      {customerOrders.length === 0 ? (
        <div style={{ maxWidth: "620px", margin: "2rem auto", background: "#FFFFFF", borderRadius: "24px", border: "1.5px solid #E2E8F0", padding: "2.5rem 2rem", boxShadow: "var(--shadow-sm)", textAlign: "center" }}>
          
          <div style={{ background: "#F0FDFA", width: "72px", height: "72px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem auto", border: "2px solid #CCFBF1" }}>
            <Lock size={34} color="#00A896" />
          </div>

          <h2 style={{ fontSize: "1.5rem", color: "#0F172A", fontWeight: 800, marginBottom: "0.4rem" }}>
            {customerPhoneSession ? "No Orders Found for this Contact" : "Confidential Order Lookup"}
          </h2>

          <p style={{ color: "#64748B", fontSize: "0.88rem", maxWidth: "480px", margin: "0 auto 1.75rem auto", lineHeight: 1.5 }}>
            To safeguard customer privacy, enter your WhatsApp phone number or Order Reference (e.g. <strong>#CB-1042</strong>) to view your order history.
          </p>

          <form onSubmit={handleLookupSubmit} style={{ display: "flex", gap: "0.6rem", maxWidth: "460px", margin: "0 auto 1.5rem auto" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Smartphone size={17} color="#94A3B8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                placeholder="Phone e.g. +1 (345) 926-5544 or #CB-1042"
                value={lookupInput}
                onChange={(e) => setLookupInput(e.target.value)}
                style={{ paddingLeft: "38px", width: "100%", borderRadius: "12px", border: "1.5px solid #CBD5E1", fontSize: "0.92rem", padding: "0.75rem 1rem 0.75rem 2.5rem" }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ padding: "0.75rem 1.4rem", borderRadius: "12px" }}>
              Access
            </button>
          </form>

          <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "1.25rem" }}>
            <button
              onClick={() => setActiveTab("categories")}
              style={{ background: "transparent", border: "none", color: "#00A896", fontWeight: 800, fontSize: "0.88rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              Start Shopping Island Stores <ArrowRight size={15} />
            </button>
          </div>

        </div>
      ) : (
        /* Orders List */
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {customerOrders.map((ord) => {
            const isDelivery = ord.fulfillment_type === "Island Courier Delivery" || ord.type === "COD";
            const isCompleted = ord.status === "Completed";
            const isCancelled = ord.status === "Cancelled";
            const { milestoneSteps, currentLevel } = getWorkflowStep(ord.status, ord.fulfillment_type);

            const badgeStyle = getStatusBadgeStyle(ord.status);

            const whatsappInquiryUrl = `https://wa.me/${CENTRAL_MARKETPLACE_WHATSAPP}?text=${encodeURIComponent(
              `Hello Cayman Bazaar! I am inquiring about my Order #${ord.id || ord.order_id} (${ord.customer_name}). Could you provide an update on status? Thank you!`
            )}`;

            return (
              <div
                key={ord.id || ord.order_id}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "20px",
                  border: "1.5px solid #E2E8F0",
                  padding: "1.75rem",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
                }}
              >
                {/* Order Top Bar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", borderBottom: "1px solid #F1F5F9", paddingBottom: "1.2rem", marginBottom: "1.2rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
                      <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#0A192F" }}>
                        #{ord.id || ord.order_id}
                      </span>

                      {/* Status Badge */}
                      <span
                        style={{
                          ...badgeStyle,
                          fontSize: "0.78rem",
                          fontWeight: 800,
                          padding: "0.22rem 0.75rem",
                          borderRadius: "999px"
                        }}
                      >
                        {ord.status}
                      </span>

                      {/* Fulfillment Badge */}
                      <span
                        style={{
                          background: isDelivery ? "#EFF6FF" : "#F0FDFA",
                          color: isDelivery ? "#1E40AF" : "#0D9488",
                          border: isDelivery ? "1px solid #BFDBFE" : "1px solid #99F6E4",
                          fontSize: "0.76rem",
                          fontWeight: 800,
                          padding: "0.22rem 0.65rem",
                          borderRadius: "999px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem"
                        }}
                      >
                        {isDelivery ? <Truck size={13} /> : <Store size={13} />}
                        {ord.fulfillment_type || (isDelivery ? "Island Courier Delivery" : "Store Pickup")}
                      </span>

                      {/* Payment Status */}
                      <span
                        style={{
                          background: ord.payment_status === "Paid" ? "#DCFCE7" : "#FFF7ED",
                          color: ord.payment_status === "Paid" ? "#166534" : "#C2410C",
                          border: ord.payment_status === "Paid" ? "1px solid #86EFAC" : "1px solid #FED7AA",
                          fontSize: "0.74rem",
                          fontWeight: 800,
                          padding: "0.2rem 0.55rem",
                          borderRadius: "8px"
                        }}
                      >
                        Payment: {ord.payment_status || "Pending"}
                      </span>
                    </div>

                    <div style={{ fontSize: "0.84rem", color: "#64748B", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                      <span><Store size={14} style={{ verticalAlign: "middle", marginRight: "4px" }} /> {ord.vendor_name}</span>
                      <span><Calendar size={14} style={{ verticalAlign: "middle", marginRight: "4px" }} /> {new Date(ord.created_at).toLocaleDateString()}</span>
                      {ord.payment_method && (
                        <span><DollarSign size={14} style={{ verticalAlign: "middle", marginRight: "2px" }} /> {ord.payment_method}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                    {/* WhatsApp Inquiry Button */}
                    <a
                      href={whatsappInquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: "#25D366",
                        color: "#FFFFFF",
                        textDecoration: "none",
                        padding: "0.5rem 0.85rem",
                        borderRadius: "10px",
                        fontSize: "0.82rem",
                        fontWeight: 800,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        boxShadow: "0 3px 10px rgba(37, 211, 102, 0.3)"
                      }}
                    >
                      <MessageSquare size={15} />
                      <span>WhatsApp Support</span>
                    </a>

                    {/* Print Order Slip */}
                    <button
                      onClick={() => setSelectedPrintOrder(ord)}
                      style={{
                        background: "#F8FAFC",
                        border: "1px solid #CBD5E1",
                        color: "#475569",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "10px",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem"
                      }}
                    >
                      <Printer size={15} />
                      <span>Receipt</span>
                    </button>

                    {/* Review Button if Completed */}
                    {isCompleted && (
                      <button
                        onClick={() => setSelectedReviewOrder(ord)}
                        style={{
                          background: "#FEF3C7",
                          border: "1px solid #FDE68A",
                          color: "#92400E",
                          padding: "0.5rem 0.85rem",
                          borderRadius: "10px",
                          fontSize: "0.82rem",
                          fontWeight: 800,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem"
                        }}
                      >
                        <Star size={15} fill="#D97706" color="#D97706" />
                        <span>Write Review</span>
                      </button>
                    )}

                    <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#0A192F", marginLeft: "0.5rem" }}>
                      {formatPrice(ord.total_amount)}
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  {ord.items.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "1rem", background: "#F8FAFC", padding: "0.75rem 1rem", borderRadius: "12px", border: "1px solid #F1F5F9" }}>
                      <img src={item.image} alt={item.title} style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0A192F" }}>{item.title}</div>
                        <div style={{ fontSize: "0.78rem", color: "#64748B" }}>Qty: {item.qty} × {formatPrice(item.price)}</div>
                      </div>
                      <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0A192F" }}>
                        {formatPrice(item.price * item.qty)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fulfillment Destination / Notes */}
                {(ord.delivery_address || ord.pickup_location || ord.special_notes) && (
                  <div style={{ background: "#F0FDFA", border: "1px solid #CCFBF1", borderRadius: "12px", padding: "0.85rem 1rem", marginBottom: "1.25rem", fontSize: "0.82rem", color: "#0F766E", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    {ord.delivery_address && (
                      <div><strong>🚚 Courier Delivery Destination:</strong> {ord.delivery_address}</div>
                    )}
                    {ord.pickup_location && (
                      <div><strong>🏪 Store Pickup Counter:</strong> {ord.pickup_location}</div>
                    )}
                    {ord.special_notes && (
                      <div><strong>📝 Order Notes:</strong> {ord.special_notes}</div>
                    )}
                  </div>
                )}

                {/* Stepper Timeline Visualizer */}
                {!isCancelled && (
                  <div style={{ background: "#F8FAFC", padding: "1.25rem", borderRadius: "16px", border: "1px solid #E2E8F0" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.85rem" }}>
                      Fulfillment Milestone: <span style={{ color: "#00A896" }}>{ord.status}</span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: `repeat(${milestoneSteps.length}, 1fr)`, gap: "0.5rem" }}>
                      {milestoneSteps.map((stepName, sIdx) => {
                        const isDone = currentLevel >= sIdx;
                        const isCurrent = currentLevel === sIdx;

                        return (
                          <div key={stepName} style={{ textAlign: "center" }}>
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                margin: "0 auto 0.4rem auto",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.8rem",
                                fontWeight: 800,
                                background: isDone ? "#00A896" : "#E2E8F0",
                                color: isDone ? "#FFFFFF" : "#64748B",
                                boxShadow: isCurrent ? "0 0 10px rgba(0, 168, 150, 0.5)" : "none"
                              }}
                            >
                              {isDone ? <CheckCircle2 size={16} /> : sIdx + 1}
                            </div>
                            <div style={{ fontSize: "0.72rem", fontWeight: isCurrent ? 800 : 600, color: isCurrent ? "#0A192F" : "#64748B", lineHeight: 1.2 }}>
                              {stepName}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
