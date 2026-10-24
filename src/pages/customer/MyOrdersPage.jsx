import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import QrCodeModal from "../../components/QrCodeModal";
import ReviewModal from "../../components/ReviewModal";
import PrintReceiptModal from "../../components/PrintReceiptModal";
import {
  PackageCheck,
  Clock,
  DollarSign,
  QrCode,
  CheckCircle2,
  MapPin,
  Calendar,
  Eye,
  Store,
  ShieldCheck,
  Lock,
  Search,
  Smartphone,
  LogOut,
  ArrowRight,
  Star,
  Printer,
  Truck
} from "lucide-react";

export default function MyOrdersPage({ setActiveTab }) {
  const {
    orders,
    formatPrice,
    customerPhoneSession,
    setCustomerPhoneSession,
    customerProfile,
    clearCustomerSession,
    getHoldExpiryInfo,
    showToast
  } = useMarketplace();

  const [selectedPassOrder, setSelectedPassOrder] = useState(null);
  const [selectedReviewOrder, setSelectedReviewOrder] = useState(null);
  const [selectedPrintOrder, setSelectedPrintOrder] = useState(null);
  const [lookupInput, setLookupInput] = useState("");

  // Clean phone digits helper
  const cleanDigits = (str) => (str || "").replace(/\D/g, "");

  // Filter orders: ONLY show orders belonging to this active customer session!
  const customerOrders = orders.filter((o) => {
    const activeContact = customerPhoneSession || customerProfile?.phone || customerProfile?.email;
    if (!activeContact) return false;

    const sPhone = cleanDigits(customerPhoneSession || customerProfile?.phone);
    const oPhone = cleanDigits(o.customer_phone);

    const matchesPhone = sPhone && oPhone && (oPhone.includes(sPhone) || sPhone.includes(oPhone));
    
    const userEmail = (customerProfile?.email || (customerPhoneSession && customerPhoneSession.includes("@") ? customerPhoneSession : "")).toLowerCase().trim();
    const matchesEmail = Boolean(userEmail && o.customer_email && o.customer_email.toLowerCase().trim() === userEmail);

    const matchesOrderId = Boolean(o.id && customerPhoneSession && o.id.toLowerCase() === customerPhoneSession.toLowerCase().trim());

    return matchesPhone || matchesEmail || matchesOrderId;
  });

  const handleLookupSubmit = (e) => {
    e.preventDefault();
    if (!lookupInput.trim()) {
      showToast("Please enter your Phone Number, Email, or Order Reference #", "warning");
      return;
    }
    setCustomerPhoneSession(lookupInput.trim());
    showToast(`Accessing private orders for: ${lookupInput.trim()}`, "success");
  };

  // Status Stepper Helper
  const getStepStatus = (currentStatus, stepName, isPickup = false) => {
    const codSteps = ["Pending", "Packing", "Out for Delivery", "Completed"];
    const pickupSteps = ["Pending", "Packing", "Ready for Pickup", "Completed"];
    const steps = isPickup ? pickupSteps : codSteps;

    const currentIdx = steps.indexOf(currentStatus);
    const stepIdx = steps.indexOf(stepName);

    if (stepIdx < currentIdx) return "completed";
    if (stepIdx === currentIdx) return "active";
    return "pending";
  };

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem", paddingBottom: "5rem" }}>
      
      {/* QR / PIN Pass Modal */}
      {selectedPassOrder && (
        <QrCodeModal order={selectedPassOrder} onClose={() => setSelectedPassOrder(null)} />
      )}

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
          <h1 style={{ fontSize: "2.2rem", color: "#0F172A", marginBottom: "0.2rem" }}>My Marketplace Orders</h1>
          <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
            Your purchases, 4-digit pickup PIN passes, and delivery updates are private and protected.
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
              <ShieldCheck size={16} /> Private Session:{" "}
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

      {/* PRIVACY GATE: If no customer session OR no matching orders found for this customer */}
      {customerOrders.length === 0 ? (
        <div style={{ maxWidth: "650px", margin: "2rem auto", background: "#FFFFFF", borderRadius: "24px", border: "1.5px solid #E2E8F0", padding: "2.5rem 2rem", boxShadow: "var(--shadow-sm)", textAlign: "center" }}>
          
          <div style={{ background: "#F0FDFA", width: "72px", height: "72px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem auto", border: "2px solid #CCFBF1" }}>
            <Lock size={34} color="#00A896" />
          </div>

          <h2 style={{ fontSize: "1.5rem", color: "#0F172A", fontWeight: 800, marginBottom: "0.4rem" }}>
            {customerPhoneSession ? "No Orders Found for this Phone" : "Confidential Order Lookup"}
          </h2>

          <p style={{ color: "#64748B", fontSize: "0.88rem", maxWidth: "480px", margin: "0 auto 1.75rem auto", lineHeight: 1.5 }}>
            To protect customer confidentiality, other shoppers cannot see what you purchased or your 4-digit pickup PIN. Please enter your Phone Number or Order Reference below to view your orders.
          </p>

          <form onSubmit={handleLookupSubmit} style={{ display: "flex", gap: "0.6rem", maxWidth: "460px", margin: "0 auto 1.5rem auto" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Smartphone size={17} color="#94A3B8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                placeholder="Phone e.g. +1 (345) 926-5544 or ORD-#"
                value={lookupInput}
                onChange={(e) => setLookupInput(e.target.value)}
                style={{
                  width: "100%",
                  paddingLeft: "2.4rem",
                  paddingRight: "0.8rem",
                  paddingTop: "0.75rem",
                  paddingBottom: "0.75rem",
                  borderRadius: "12px",
                  border: "1.5px solid #CBD5E1",
                  fontSize: "0.9rem"
                }}
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: "0.75rem 1.4rem", borderRadius: "12px", fontSize: "0.9rem", fontWeight: 800, whiteSpace: "nowrap" }}
            >
              Lookup ➔
            </button>
          </form>

          <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
            <button
              onClick={() => setActiveTab("home")}
              style={{ background: "transparent", border: "none", color: "#00A896", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}
            >
              Start Shopping Island Stalls ➔
            </button>
          </div>

        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {customerOrders.map((ord) => {
            const isPickup = ord.type === "PICKUP";
            const isCompleted = ord.status === "Completed";
            const expiryInfo = getHoldExpiryInfo(ord);
            const steps = isPickup
              ? ["Pending", "Packing", "Ready for Pickup", "Completed"]
              : ["Pending", "Packing", "Out for Delivery", "Completed"];

            return (
              <div
                key={ord.id}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "20px",
                  border: "1.5px solid #E2E8F0",
                  padding: "1.75rem",
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                {/* Order Top Bar */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", borderBottom: "1px solid #F1F5F9", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.2rem", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F172A" }}>
                        Order #{ord.id}
                      </span>

                      {isPickup ? (
                        <span className="badge badge-pickup">
                          <Clock size={12} /> Reserve for Pickup
                        </span>
                      ) : (
                        <span className="badge badge-cod">
                          <DollarSign size={12} /> Cash on Delivery
                        </span>
                      )}

                      {/* 48-Hour Hold Countdown Badge */}
                      {expiryInfo && (
                        <span
                          style={{
                            background: expiryInfo.isExpired ? "#FEE2E2" : expiryInfo.isUrgent ? "#FEF3C7" : "#F0FDF4",
                            color: expiryInfo.isExpired ? "#DC2626" : expiryInfo.isUrgent ? "#B45309" : "#166534",
                            border: `1px solid ${expiryInfo.isExpired ? "#FCA5A5" : expiryInfo.isUrgent ? "#FDE68A" : "#BBF7D0"}`,
                            fontSize: "0.74rem",
                            fontWeight: 800,
                            padding: "0.2rem 0.6rem",
                            borderRadius: "8px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem"
                          }}
                        >
                          <Clock size={12} />
                          {expiryInfo.text}
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: "0.82rem", color: "#64748B", display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap" }}>
                      <span><Store size={13} /> {ord.vendor_name}</span>
                      <span><Calendar size={13} /> {new Date(ord.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions & Pass Trigger */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap" }}>
                    {isPickup && !isCompleted && (
                      <button
                        onClick={() => setSelectedPassOrder(ord)}
                        className="btn-gold"
                        style={{ padding: "0.55rem 1rem", fontSize: "0.85rem", borderRadius: "10px" }}
                      >
                        <QrCode size={16} /> View PIN & QR Pass ({ord.pin_code})
                      </button>
                    )}

                    {!isPickup && (
                      <button
                        onClick={() => setSelectedPassOrder(ord)}
                        style={{
                          background: "#ECFDF5",
                          border: "1px solid #A7F3D0",
                          color: "#065F46",
                          padding: "0.55rem 1rem",
                          fontSize: "0.85rem",
                          borderRadius: "10px",
                          fontWeight: 750,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem"
                        }}
                      >
                        <Truck size={16} /> View Delivery Slip
                      </button>
                    )}

                    <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A" }}>
                      {formatPrice(ord.total_amount)}
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "2rem" }}>
                  {ord.items.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "1rem", background: "#F8FAFC", padding: "0.75rem 1rem", borderRadius: "12px" }}>
                      <img src={item.image} alt={item.title} style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0F172A" }}>{item.title}</div>
                        <div style={{ fontSize: "0.78rem", color: "#64748B" }}>Qty: {item.qty} × {formatPrice(item.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stepper Timeline Visualizer */}
                <div style={{ background: "#F8FAFC", padding: "1.25rem", borderRadius: "16px", border: "1px solid #E2E8F0" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Order Timeline Status: <span style={{ color: "#00A896" }}>{ord.status}</span>
                  </div>

                  <div className="stepper" style={{ margin: "0.5rem 0" }}>
                    {steps.map((stepName) => {
                      const state = getStepStatus(ord.status, stepName, isPickup);
                      return (
                        <div key={stepName} className={`step-item ${state}`}>
                          <div className="step-circle">
                            {state === "completed" ? <CheckCircle2 size={18} /> : steps.indexOf(stepName) + 1}
                          </div>
                          <div className="step-label">{stepName}</div>
                        </div>
                      );
                    })}
                  </div>

                    {/* Order Footer Actions: Print Receipt, Rate & Review, Dispute */}
                    <div style={{ marginTop: "1.25rem", paddingTop: "0.9rem", borderTop: "1px dashed #CBD5E1", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                      <div style={{ fontSize: "0.8rem", color: "#64748B" }}>
                        {isPickup ? (
                          <span>Held at <strong>{ord.pickup_location || "Store Stall Counter"}</strong> for 48 hours</span>
                        ) : (
                          <span>Delivery Address: <strong>{ord.delivery_address || "Seven Mile Beach, Grand Cayman"}</strong></span>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
                        {/* Verified Buyer Review Button */}
                        {isCompleted && (
                          <button
                            onClick={() => setSelectedReviewOrder(ord)}
                            style={{
                              background: ord.is_reviewed ? "#F0FDF4" : "#FEF3C7",
                              border: `1px solid ${ord.is_reviewed ? "#BBF7D0" : "#FDE68A"}`,
                              color: ord.is_reviewed ? "#166534" : "#B45309",
                              padding: "0.4rem 0.85rem",
                              borderRadius: "8px",
                              fontSize: "0.78rem",
                              fontWeight: 800,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem"
                            }}
                          >
                            <Star size={13} fill={ord.is_reviewed ? "#166534" : "#F59E0B"} color={ord.is_reviewed ? "#166534" : "#F59E0B"} />
                            {ord.is_reviewed ? "Reviewed (Verified)" : "Rate & Review Stall"}
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedPrintOrder(ord)}
                          style={{
                            background: "#FFFFFF",
                            border: "1px solid #CBD5E1",
                            color: "#475569",
                            padding: "0.4rem 0.8rem",
                            borderRadius: "8px",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem"
                          }}
                        >
                          <Printer size={13} /> Print Official Receipt
                        </button>

                        <button
                          onClick={() => setActiveTab("contact")}
                          style={{
                            background: "#FEF2F2",
                            border: "1px solid #FCA5A5",
                            color: "#DC2626",
                            padding: "0.4rem 0.8rem",
                            borderRadius: "8px",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem"
                          }}
                        >
                          Report Issue / Dispute
                        </button>
                      </div>
                    </div>
                  </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
