import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import QrCodeModal from "../../components/QrCodeModal";
import {
  ShoppingBag,
  DollarSign,
  Clock,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Phone,
  User,
  Mail,
  ArrowRight,
  QrCode,
  Store,
  Smartphone
} from "lucide-react";

export default function CheckoutPage({ setActiveTab }) {
  const {
    cart,
    placeOrder,
    formatPrice,
    vendors,
    showToast,
    customerPhoneSession,
    customerProfile,
    updateCustomerProfile,
    clearCustomerSession
  } = useMarketplace();

  // Selected Checkout Type: 'PICKUP' or 'COD'
  const [checkoutType, setCheckoutType] = useState("PICKUP");

  // Form Fields - Auto-fill from customerProfile or active session (clean for first-time guests)
  const [customerName, setCustomerName] = useState(customerProfile?.name || "");
  const [customerPhone, setCustomerPhone] = useState(customerPhoneSession || customerProfile?.phone || "");
  const [customerEmail, setCustomerEmail] = useState(customerProfile?.email || "");
  const [deliveryAddress, setDeliveryAddress] = useState(customerProfile?.address || "");
  const [specialNotes, setSpecialNotes] = useState("");
  const [sendWhatsApp, setSendWhatsApp] = useState(true);

  // Sync if customerProfile updates
  React.useEffect(() => {
    if (customerProfile) {
      if (customerProfile.name) setCustomerName(customerProfile.name);
      if (customerProfile.phone) setCustomerPhone(customerProfile.phone);
      if (customerProfile.email) setCustomerEmail(customerProfile.email);
      if (customerProfile.address) setDeliveryAddress(customerProfile.address);
    } else if (customerPhoneSession) {
      setCustomerPhone(customerPhoneSession);
    }
  }, [customerProfile, customerPhoneSession]);

  // Order Complete Modal state
  const [completedOrder, setCompletedOrder] = useState(null);

  if (cart.length === 0 && !completedOrder) {
    return (
      <div className="container" style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
        <ShoppingBag size={54} color="#CBD5E1" style={{ marginBottom: "1rem" }} />
        <h2 style={{ color: "#0F172A", marginBottom: "0.5rem" }}>Your Bag is Empty</h2>
        <p style={{ color: "#64748B", marginBottom: "1.5rem" }}>Add items from Cayman vendor stores before proceeding to checkout.</p>
        <button onClick={() => setActiveTab("categories")} className="btn-primary">
          Browse Catalog <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  const grandTotalKYD = cart.reduce((acc, item) => acc + item.product.price * item.qty, 0);

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (!customerName || !customerPhone) {
      showToast("Please enter your name and phone number.", "warning");
      return;
    }

    if (checkoutType === "COD" && !deliveryAddress) {
      showToast("Please enter delivery address for COD delivery.", "warning");
      return;
    }

    // Persist real customer profile so repeat visits remember credentials (Amazon style)
    if (updateCustomerProfile) {
      updateCustomerProfile({
        name: customerName.trim(),
        phone: customerPhone.trim(),
        email: customerEmail.trim(),
        address: deliveryAddress.trim()
      });
    }

    const createdOrders = placeOrder({
      type: checkoutType,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      delivery_address: deliveryAddress,
      special_notes: specialNotes
    });

    if (createdOrders && createdOrders.length > 0) {
      const firstOrder = createdOrders[0];
      setCompletedOrder(firstOrder);
    }
  };

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem", paddingBottom: "5rem" }}>
      
      {/* Interactive PIN / QR Pass Modal upon Order Completion */}
      {completedOrder && (
        <QrCodeModal
          order={completedOrder}
          onClose={() => {
            setCompletedOrder(null);
            setActiveTab("my-orders");
          }}
        />
      )}

      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: "2.2rem", color: "#0F172A", marginBottom: "0.4rem" }}>Marketplace Checkout</h1>
        <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
          Choose between <strong>Reserve for Store Pickup (4-Digit PIN)</strong> or <strong>Cash on Delivery (COD)</strong>.
        </p>

        {customerPhoneSession && (
          <div
            style={{
              background: "#F0FDF4",
              border: "1px solid #BBF7D0",
              borderRadius: "14px",
              padding: "0.75rem 1.25rem",
              marginTop: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.5rem"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#166534", fontSize: "0.88rem", fontWeight: 700 }}>
              <CheckCircle2 size={18} color="#16a34a" />
              <span>
                Welcome back! Your contact & delivery details are pre-filled for:{" "}
                <strong style={{ color: "#0F172A" }}>{customerProfile?.name ? `${customerProfile.name} (${customerPhoneSession})` : customerPhoneSession}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={clearCustomerSession}
              style={{
                background: "#FFFFFF",
                border: "1px solid #CBD5E1",
                color: "#64748B",
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "0.3rem 0.65rem",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Log Out / Switch
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem", alignItems: "flex-start" }}>
        
        {/* Left: Payment & Pickup Selection Form */}
        <div>
          
          {/* Method Selector Tabs */}
          <div style={{ background: "#E2E8F0", padding: "4px", borderRadius: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", marginBottom: "2rem" }}>
            <button
              type="button"
              onClick={() => setCheckoutType("PICKUP")}
              style={{
                background: checkoutType === "PICKUP" ? "#FFFFFF" : "transparent",
                color: checkoutType === "PICKUP" ? "#00A896" : "#64748B",
                padding: "0.85rem 1rem",
                borderRadius: "12px",
                fontWeight: checkoutType === "PICKUP" ? 800 : 600,
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                boxShadow: checkoutType === "PICKUP" ? "var(--shadow-sm)" : "none"
              }}
            >
              <Clock size={18} /> Reserve for Store Pickup
            </button>

            <button
              type="button"
              onClick={() => setCheckoutType("COD")}
              style={{
                background: checkoutType === "COD" ? "#FFFFFF" : "transparent",
                color: checkoutType === "COD" ? "#0F4C81" : "#64748B",
                padding: "0.85rem 1rem",
                borderRadius: "12px",
                fontWeight: checkoutType === "COD" ? 800 : 600,
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                boxShadow: checkoutType === "COD" ? "var(--shadow-sm)" : "none"
              }}
            >
              <DollarSign size={18} /> Cash on Delivery (COD)
            </button>
          </div>

          <form onSubmit={handleSubmitOrder} style={{ background: "#FFFFFF", borderRadius: "20px", border: "1.5px solid #E2E8F0", padding: "1.75rem", boxShadow: "var(--shadow-sm)" }}>
            
            {/* Pickup Info Alert */}
            {checkoutType === "PICKUP" ? (
              <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", color: "#92400E", borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem", fontSize: "0.85rem", lineHeight: 1.5 }}>
                <div style={{ fontWeight: 800, fontSize: "0.9rem", marginBottom: "0.3rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <QrCode size={18} color="#D97706" /> How Reserve for Pickup Works:
                </div>
                1. Submit your reservation below (no credit card required now).<br />
                2. You will instantly receive a <strong>4-Digit PIN Code + QR Pass</strong>.<br />
                3. The store will hold your item for <strong>24-48 hours</strong>.<br />
                4. Visit store desk, show your PIN/QR, inspect item & complete payment!
              </div>
            ) : (
              <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#1E40AF", borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem", fontSize: "0.85rem", lineHeight: 1.5 }}>
                <div style={{ fontWeight: 800, fontSize: "0.9rem", marginBottom: "0.3rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <DollarSign size={18} color="#1D4ED8" /> Cash on Delivery (COD) Info:
                </div>
                Your order will be packed by the vendor and dispatched via Grand Cayman courier. 
                You pay in cash ($KYD / $USD) directly to the delivery driver upon arrival.
              </div>
            )}

            {/* Customer Information */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", color: "#0F172A", margin: 0 }}>Contact Details</h3>
              {customerPhoneSession && (
                <div style={{ fontSize: "0.78rem", background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#166534", padding: "0.25rem 0.65rem", borderRadius: "8px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                  <ShieldCheck size={14} color="#166534" />
                  <span>Verified Session: <strong>{customerPhoneSession}</strong></span>
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem", display: "block" }}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. David Sterling"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem", display: "block" }}>Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+1 (345) 000-0000"
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem", display: "block" }}>Email Address</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="david@example.com"
                  />
                </div>
              </div>

              {checkoutType === "COD" && (
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem", display: "block" }}>Grand Cayman Delivery Address *</label>
                  <textarea
                    rows={3}
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Resort Name, Room Number, Street, District..."
                  />
                </div>
              )}

              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem", display: "block" }}>Special Instructions / Notes</label>
                <input
                  type="text"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g. Preferred pickup date or delivery instructions..."
                />
              </div>

              {/* Instant WhatsApp / SMS PIN Delivery Checkbox */}
              <div style={{
                background: "#F0FDF4",
                border: "1.5px solid #BBF7D0",
                borderRadius: "14px",
                padding: "0.9rem 1.1rem",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                cursor: "pointer"
              }}
              onClick={() => setSendWhatsApp(!sendWhatsApp)}
              >
                <input
                  type="checkbox"
                  checked={sendWhatsApp}
                  onChange={(e) => setSendWhatsApp(e.target.checked)}
                  style={{ width: "18px", height: "18px", accentColor: "#00A896", cursor: "pointer", marginTop: "2px" }}
                />
                <div>
                  <div style={{ fontSize: "0.86rem", fontWeight: 800, color: "#166534", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Smartphone size={15} /> Instant WhatsApp & SMS Pass Alert
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#4B5563", marginTop: "2px", lineHeight: 1.4 }}>
                    Send my 4-Digit Pickup PIN code & live dispatch tracking directly to <strong>{customerPhone}</strong> via Twilio/WhatsApp.
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={checkoutType === "PICKUP" ? "btn-gold" : "btn-primary"}
              style={{ width: "100%", padding: "0.9rem 1rem", fontSize: "1rem", borderRadius: "14px" }}
            >
              {checkoutType === "PICKUP" ? (
                <>
                  <QrCode size={20} /> Generate 4-Digit PIN & Reserve
                </>
              ) : (
                <>
                  <DollarSign size={20} /> Confirm Cash on Delivery Order
                </>
              )}
            </button>

          </form>
        </div>

        {/* Right: Order Summary */}
        <div>
          <div style={{ background: "#FFFFFF", borderRadius: "20px", border: "1.5px solid #E2E8F0", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
            <h3 style={{ fontSize: "1.1rem", color: "#0F172A", marginBottom: "1rem" }}>Order Summary</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem", maxHeight: "320px", overflowY: "auto" }}>
              {cart.map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: "0.85rem", alignItems: "center", borderBottom: "1px solid #F1F5F9", paddingBottom: "0.85rem" }}>
                  <img src={item.product.images[0]} alt={item.product.title} style={{ width: "54px", height: "54px", borderRadius: "10px", objectFit: "cover" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0F172A" }}>{item.product.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "#64748B" }}>Vendor: {item.product.vendor_name}</div>
                    <div style={{ fontSize: "0.78rem", color: "#64748B" }}>Qty: {item.qty}</div>
                  </div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0F172A" }}>
                    {formatPrice(item.product.price * item.qty)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1.5px solid #E2E8F0", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", color: "#64748B" }}>
                <span>Subtotal:</span>
                <span>{formatPrice(grandTotalKYD)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", color: "#64748B" }}>
                <span>Pickup / COD Courier:</span>
                <span style={{ color: "#166534", fontWeight: 700 }}>FREE</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", color: "#64748B" }}>
                <span>Island Sales Tax (Duty-Free):</span>
                <span style={{ color: "#00A896", fontWeight: 700 }}>$0.00 (0%)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", paddingTop: "0.5rem", borderTop: "1px solid #F1F5F9" }}>
                <span>Total Due:</span>
                <span style={{ color: "#00A896" }}>{formatPrice(grandTotalKYD)}</span>
              </div>
            </div>

            <div style={{ marginTop: "1.5rem", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "12px", padding: "0.85rem", fontSize: "0.8rem", color: "#166534", lineHeight: 1.4 }}>
              🔒 <strong>100% Confidential Order</strong>: Your order history, items purchased, and 4-digit pickup PIN are strictly private. No other shoppers or visitors on the marketplace can ever see your purchases.
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
