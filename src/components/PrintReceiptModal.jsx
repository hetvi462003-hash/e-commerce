import React from "react";
import { X, Printer, CheckCircle2, Clock, ShieldCheck, Compass, Store } from "lucide-react";
import { useMarketplace } from "../context/MarketplaceContext";

export default function PrintReceiptModal({ order, onClose }) {
  const { formatPrice, vendors } = useMarketplace();

  if (!order) return null;

  const vendor = vendors.find((v) => v.id === order.vendor_id) || {
    store_name: order.vendor_name || "Cayman Stall",
    district: "Grand Cayman",
    phone: "+1 (345) 949-0000"
  };

  const isPickup = order.type === "PICKUP";
  const isCompleted = order.status === "Completed";
  const orderDate = new Date(order.created_at || Date.now()).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(5, 11, 20, 0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem"
      }}
    >
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-receipt-card, #printable-receipt-card * {
            visibility: visible !important;
          }
          #printable-receipt-card {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            padding: 1.5rem !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "520px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          position: "relative"
        }}
      >
        {/* Header Actions (No print) */}
        <div
          className="no-print"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.5rem",
            borderBottom: "1px solid #E2E8F0",
            background: "#F8FAFC",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#0F172A", fontWeight: 800, fontSize: "0.95rem" }}>
            <Printer size={18} color="#00A896" />
            <span>Official Island Receipt & Slip</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <button
              onClick={handlePrint}
              className="btn-primary"
              style={{
                padding: "0.45rem 0.95rem",
                borderRadius: "10px",
                fontSize: "0.85rem",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem"
              }}
            >
              <Printer size={14} /> Print Now
            </button>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "0.4rem",
                borderRadius: "8px",
                color: "#64748B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="printable-receipt-card" style={{ padding: "2rem" }}>
          
          {/* Logo & Platform Header */}
          <div style={{ textAlign: "center", borderBottom: "2px dashed #CBD5E1", paddingBottom: "1.25rem", marginBottom: "1.25rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem" }}>
              <div style={{ background: "#050B14", color: "#00E5C9", padding: "4px", borderRadius: "6px" }}>
                <Compass size={18} />
              </div>
              <span style={{ fontSize: "1.25rem", fontWeight: 900, letterSpacing: "-0.03em", color: "#0F172A" }}>
                CAYMAN<span style={{ color: "#00A896" }}>BAZAAR</span>
              </span>
            </div>
            <div style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
              Grand Cayman Virtual Island Stalls
            </div>
          </div>

          {/* Stall / Vendor Details */}
          <div style={{ marginBottom: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F172A" }}>
              {vendor.store_name}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#64748B", marginTop: "2px" }}>
              District: {vendor.district || "Seven Mile Beach, Grand Cayman"}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#64748B" }}>
              Tel: {vendor.phone || "+1 (345) 949-0000"}
            </div>
          </div>

          {/* Receipt Meta Grid */}
          <div
            style={{
              background: "#F8FAFC",
              borderRadius: "12px",
              padding: "0.85rem 1rem",
              marginBottom: "1.25rem",
              fontSize: "0.82rem",
              border: "1px solid #E2E8F0",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.5rem"
            }}
          >
            <div>
              <span style={{ color: "#64748B" }}>Order No: </span>
              <strong style={{ color: "#0F172A" }}>#{order.id}</strong>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ color: "#64748B" }}>Date: </span>
              <strong style={{ color: "#0F172A" }}>{orderDate}</strong>
            </div>
            <div>
              <span style={{ color: "#64748B" }}>Customer: </span>
              <strong style={{ color: "#0F172A" }}>{order.customer_name}</strong>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ color: "#64748B" }}>Phone: </span>
              <strong style={{ color: "#0F172A" }}>{order.customer_phone}</strong>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <span style={{ color: "#64748B" }}>Fulfillment: </span>
              <strong style={{ color: isPickup ? "#D97706" : "#0284C7" }}>
                {isPickup ? "48-Hour Reserve for Store Pickup" : "Island Cash on Delivery Courier"}
              </strong>
            </div>
          </div>

          {/* PIN Status Docket Banner */}
          {isPickup && (
            <div
              style={{
                border: "2px solid #F59E0B",
                borderRadius: "14px",
                background: "#FEF3C7",
                padding: "0.9rem",
                textAlign: "center",
                marginBottom: "1.25rem"
              }}
            >
              <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Customer 4-Digit Pickup PIN
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: "#B45309", letterSpacing: "0.3em", margin: "0.2rem 0" }}>
                {order.pin_code || "----"}
              </div>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: isCompleted ? "#166534" : "#92400E", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                {isCompleted ? (
                  <>
                    <CheckCircle2 size={14} color="#166534" /> PIN Verified by Store Clerk — Sale Completed
                  </>
                ) : (
                  <>
                    <Clock size={14} /> 48-Hour Reservation Active — Present at Clerk Counter
                  </>
                )}
              </div>
            </div>
          )}

          {/* Items Table */}
          <div style={{ marginBottom: "1.25rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
              <thead>
                <tr style={{ borderBottom: "1.5px solid #0F172A", color: "#0F172A", textAlign: "left" }}>
                  <th style={{ padding: "0.5rem 0" }}>Item Description</th>
                  <th style={{ padding: "0.5rem", textAlign: "center" }}>Qty</th>
                  <th style={{ padding: "0.5rem 0", textAlign: "right" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((it, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px dashed #E2E8F0" }}>
                    <td style={{ padding: "0.6rem 0", color: "#1E293B" }}>
                      <div style={{ fontWeight: 700 }}>{it.title}</div>
                      {it.variations && Object.keys(it.variations).length > 0 && (
                        <div style={{ fontSize: "0.75rem", color: "#64748B" }}>
                          {Object.entries(it.variations).map(([k, v]) => `${k}: ${v}`).join(", ")}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "0.6rem", textAlign: "center", color: "#64748B" }}>{it.qty}</td>
                    <td style={{ padding: "0.6rem 0", textAlign: "right", fontWeight: 700, color: "#0F172A" }}>
                      {formatPrice(it.price * it.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div style={{ borderTop: "2px solid #0F172A", paddingTop: "0.75rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#64748B", marginBottom: "0.3rem" }}>
              <span>Subtotal:</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#64748B", marginBottom: "0.3rem" }}>
              <span>Grand Cayman Duty-Free Tax:</span>
              <span style={{ color: "#00A896", fontWeight: 700 }}>$0.00 (0%)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: 900, color: "#0F172A", paddingTop: "0.4rem", borderTop: "1px dashed #CBD5E1" }}>
              <span>Total Amount:</span>
              <span style={{ color: "#00A896" }}>{formatPrice(order.total_amount)}</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: isCompleted ? "#166534" : "#D97706", fontWeight: 700, textAlign: "right", marginTop: "0.2rem" }}>
              {isCompleted ? "Payment Received in Cash ($KYD / $USD)" : "Amount Due Offline Upon Pickup / Delivery"}
            </div>
          </div>

          {/* Footer Note */}
          <div style={{ textAlign: "center", borderTop: "1px dashed #CBD5E1", paddingTop: "1rem", fontSize: "0.72rem", color: "#94A3B8" }}>
            <div style={{ fontWeight: 700, color: "#64748B", marginBottom: "0.2rem" }}>
              Thank you for supporting Grand Cayman Local Artisans!
            </div>
            <div>CaymanBazaar Island Commerce • www.caymanbazaar.ky</div>
          </div>

        </div>

      </div>
    </div>
  );
}
