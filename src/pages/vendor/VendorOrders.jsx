import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import { Clock, DollarSign, QrCode, CheckCircle2, Package, MapPin, Phone, Printer, AlertTriangle } from "lucide-react";
import PrintReceiptModal from "../../components/PrintReceiptModal";

export default function VendorOrders() {
  const {
    activeVendor,
    orders,
    updateOrderStatus,
    verifyAndCompletePickup,
    formatPrice,
    getHoldExpiryInfo,
    cancelAndRestockHold
  } = useMarketplace();
  const [activeTab, setActiveTab] = useState("all");
  const [pinInput, setPinInput] = useState("");
  const [selectedPrintOrder, setSelectedPrintOrder] = useState(null);

  if (!activeVendor) return null;

  const vendorOrders = orders.filter((o) => o.vendor_id === activeVendor.id);

  const filteredOrders = vendorOrders.filter((o) => {
    if (activeTab === "pickup") return o.type === "PICKUP";
    if (activeTab === "cod") return o.type === "COD";
    return true;
  });

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem", paddingBottom: "5rem" }}>
      
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#00A896", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>
          <Clock size={16} /> Fulfillment Center
        </div>
        <h1 style={{ fontSize: "2.2rem", color: "#0F172A", marginBottom: "0.2rem" }}>Orders & Pickup Holds</h1>
        <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
          Process Cash on Delivery dispatches and verify 4-digit PIN codes for store pickup holds.
        </p>
      </div>

      {/* Store Clerk PIN Verification Terminal */}
      <div
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          borderRadius: "20px",
          padding: "1.75rem 2rem",
          color: "#FFFFFF",
          marginBottom: "2rem",
          boxShadow: "var(--shadow-md)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem",
          border: "1.5px solid rgba(245, 158, 11, 0.3)"
        }}
      >
        <div style={{ maxWidth: "480px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#F59E0B", fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>
            <QrCode size={18} /> Store Clerk Physical Pickup Verification
          </div>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.4rem" }}>
            Validate Customer 4-Digit PIN Code
          </h3>
          <p style={{ color: "#94A3B8", fontSize: "0.85rem", lineHeight: 1.45 }}>
            When a customer arrives at your stall, ask for their 4-digit PIN or scan their pass QR code. Entering the PIN completes the sale and deducts the 10% platform commission.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pinInput.trim().length === 4) {
              const success = verifyAndCompletePickup(pinInput.trim());
              if (success !== false) setPinInput("");
            }
          }}
          style={{ display: "flex", alignItems: "center", gap: "0.8rem", background: "rgba(255, 255, 255, 0.08)", padding: "0.75rem 1rem", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.15)" }}
        >
          <div style={{ position: "relative" }}>
            <input
              type="text"
              maxLength={4}
              placeholder="e.g. 4829"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
              style={{
                width: "140px",
                padding: "0.65rem 1rem",
                borderRadius: "12px",
                border: "2px solid #F59E0B",
                background: "#050B14",
                color: "#F59E0B",
                fontSize: "1.3rem",
                fontWeight: 900,
                textAlign: "center",
                letterSpacing: "0.25em"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={pinInput.length !== 4}
            className="btn-gold"
            style={{
              padding: "0.75rem 1.4rem",
              borderRadius: "12px",
              fontSize: "0.9rem",
              fontWeight: 800,
              opacity: pinInput.length === 4 ? 1 : 0.5,
              cursor: pinInput.length === 4 ? "pointer" : "not-allowed"
            }}
          >
            <CheckCircle2 size={18} /> Verify PIN & Complete Hold
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <button
          onClick={() => setActiveTab("all")}
          style={{
            background: activeTab === "all" ? "#0F172A" : "#FFFFFF",
            color: activeTab === "all" ? "#FFFFFF" : "#64748B",
            border: "1px solid #CBD5E1",
            padding: "0.5rem 1rem",
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: "0.85rem"
          }}
        >
          All Orders ({vendorOrders.length})
        </button>

        <button
          onClick={() => setActiveTab("pickup")}
          style={{
            background: activeTab === "pickup" ? "#D97706" : "#FFFFFF",
            color: activeTab === "pickup" ? "#FFFFFF" : "#64748B",
            border: "1px solid #CBD5E1",
            padding: "0.5rem 1rem",
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: "0.85rem"
          }}
        >
          Store Pickup Holds ({vendorOrders.filter((o) => o.type === "PICKUP").length})
        </button>

        <button
          onClick={() => setActiveTab("cod")}
          style={{
            background: activeTab === "cod" ? "#0284C7" : "#FFFFFF",
            color: activeTab === "cod" ? "#FFFFFF" : "#64748B",
            border: "1px solid #CBD5E1",
            padding: "0.5rem 1rem",
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: "0.85rem"
          }}
        >
          COD Dispatches ({vendorOrders.filter((o) => o.type === "COD").length})
        </button>
      </div>

      {/* Printable Receipt Modal */}
      {selectedPrintOrder && (
        <PrintReceiptModal
          order={selectedPrintOrder}
          onClose={() => setSelectedPrintOrder(null)}
        />
      )}

      {/* Orders List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {filteredOrders.map((ord) => {
          const expiryInfo = getHoldExpiryInfo(ord);
          return (
            <div
              key={ord.id}
              style={{
                background: "#FFFFFF",
                borderRadius: "20px",
                border: "1.5px solid #E2E8F0",
                padding: "1.5rem",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem", borderBottom: "1px solid #F1F5F9", paddingBottom: "0.85rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F172A" }}>Order #{ord.id}</span>
                    {ord.type === "PICKUP" ? (
                      <span className="badge badge-pickup">Pickup Hold</span>
                    ) : (
                      <span className="badge badge-cod">COD Courier</span>
                    )}

                    {/* 48-Hour Countdown / Expiry Badge */}
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
                  <div style={{ fontSize: "0.82rem", color: "#64748B", marginTop: "0.2rem" }}>
                    Customer: <strong>{ord.customer_name}</strong> ({ord.customer_phone})
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap" }}>
                  <button
                    onClick={() => setSelectedPrintOrder(ord)}
                    className="btn-outline"
                    style={{
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.8rem",
                      borderRadius: "10px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem"
                    }}
                  >
                    <Printer size={14} /> Print Slip
                  </button>

                  <span className="badge" style={{ background: "#E0F2FE", color: "#0284C7", fontSize: "0.85rem", padding: "0.35rem 0.7rem" }}>
                    {ord.status}
                  </span>
                  <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A" }}>
                    {formatPrice(ord.total_amount)}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div style={{ marginBottom: "1rem" }}>
                {ord.items.map((it, idx) => (
                  <div key={idx} style={{ fontSize: "0.88rem", color: "#334155" }}>
                    • {it.qty}x <strong>{it.title}</strong> — {formatPrice(it.price)}
                  </div>
                ))}
              </div>

              {/* Delivery / PIN Details */}
              <div style={{ background: "#F8FAFC", borderRadius: "10px", padding: "0.75rem", fontSize: "0.82rem", color: "#64748B", marginBottom: "1rem" }}>
                {ord.type === "PICKUP" ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div>🔑 Customer Pickup PIN Code: <strong style={{ color: "#D97706", fontSize: "1.1rem", letterSpacing: "0.08em" }}>{ord.pin_code}</strong></div>
                    {expiryInfo?.isExpired && (
                      <button
                        onClick={() => cancelAndRestockHold(ord.id)}
                        style={{
                          background: "#DC2626",
                          color: "#FFFFFF",
                          border: "none",
                          padding: "0.35rem 0.75rem",
                          borderRadius: "8px",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem"
                        }}
                      >
                        <AlertTriangle size={13} /> Cancel & Auto-Restock Inventory
                      </button>
                    )}
                  </div>
                ) : (
                  <div>🚚 Delivery Address: <strong>{ord.delivery_address}</strong></div>
                )}
              </div>

              {/* Action Buttons */}
              {ord.status !== "Completed" && ord.status !== "Cancelled" && (
                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                  {ord.status === "Pending" && (
                    <button onClick={() => updateOrderStatus(ord.id, "Packing")} className="btn-primary" style={{ padding: "0.45rem 0.9rem", fontSize: "0.82rem" }}>
                      Mark as Packing
                    </button>
                  )}

                  {ord.status === "Packing" && ord.type === "COD" && (
                    <button onClick={() => updateOrderStatus(ord.id, "Out for Delivery")} className="btn-primary" style={{ padding: "0.45rem 0.9rem", fontSize: "0.82rem" }}>
                      Mark Out for Delivery
                    </button>
                  )}

                  {ord.status === "Packing" && ord.type === "PICKUP" && (
                    <button onClick={() => updateOrderStatus(ord.id, "Ready for Pickup")} className="btn-gold" style={{ padding: "0.45rem 0.9rem", fontSize: "0.82rem" }}>
                      Mark Ready for Pickup
                    </button>
                  )}

                  {(ord.status === "Ready for Pickup" || ord.status === "Out for Delivery" || ord.status === "Packing") && (
                    <button onClick={() => updateOrderStatus(ord.id, "Completed")} className="btn-gold" style={{ padding: "0.45rem 0.9rem", fontSize: "0.82rem" }}>
                      <CheckCircle2 size={14} /> Verify & Complete Order
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
