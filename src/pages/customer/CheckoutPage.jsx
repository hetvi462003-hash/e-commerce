import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import {
  ShoppingBag,
  Store,
  Truck,
  MapPin,
  Phone,
  User,
  Mail,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  AlertTriangle,
  Clock,
  Sparkles
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
    clearCustomerSession,
    CENTRAL_MARKETPLACE_PHONE_DISPLAY
  } = useMarketplace();

  // Fulfillment Selection: 'Collection at Stall' or 'Island Courier Delivery'
  const [fulfillmentType, setFulfillmentType] = useState("Collection at Stall");

  // Form Fields - Start clean and empty for every order (no sticky dummy data)
  const [countryCode, setCountryCode] = useState("+91"); // Default to +91 India for live testing
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");

  // Post-submission WhatsApp Modal state
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [copied, setCopied] = useState(false);

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="container" style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
        <ShoppingBag size={54} color="#CBD5E1" style={{ marginBottom: "1rem" }} />
        <h2 style={{ color: "#0F172A", marginBottom: "0.5rem" }}>Your Shopping Bag is Empty</h2>
        <p style={{ color: "#64748B", marginBottom: "1.5rem" }}>
          Browse island stalls across Grand Cayman and add items before proceeding to checkout.
        </p>
        <button onClick={() => setActiveTab("categories")} className="btn-primary">
          Browse Catalog <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  const grandTotalKYD = cart.reduce((acc, item) => acc + item.product.price * item.qty, 0);

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim()) {
      showToast("Please enter your Name and WhatsApp phone number.", "warning");
      return;
    }

    if (fulfillmentType === "Island Courier Delivery" && !deliveryAddress.trim()) {
      showToast("Please enter your Grand Cayman delivery address.", "warning");
      return;
    }

    const cleanRawPhone = customerPhone.trim();
    const digitsOnly = cleanRawPhone.replace(/\D/g, "");

    // Calculate exact WhatsApp recipient so ANY entered number opens in WhatsApp
    let waRecipient = digitsOnly;
    if (countryCode === "+91") {
      waRecipient = digitsOnly.length === 10 ? `91${digitsOnly}` : (digitsOnly.startsWith("91") ? digitsOnly : `91${digitsOnly}`);
    } else {
      waRecipient = digitsOnly.length === 7 ? `1345${digitsOnly}` : (digitsOnly.startsWith("345") ? `1${digitsOnly}` : digitsOnly);
    }

    const formattedPhone = cleanRawPhone.startsWith("+")
      ? cleanRawPhone
      : `${countryCode} ${cleanRawPhone}`;

    const createdOrders = placeOrder({
      fulfillment_type: fulfillmentType,
      type: fulfillmentType === "Island Courier Delivery" ? "COD" : "PICKUP",
      customer_name: customerName.trim(),
      customer_phone: formattedPhone,
      target_whatsapp: waRecipient,
      country_code: countryCode,
      customer_email: customerEmail.trim(),
      delivery_address: deliveryAddress.trim(),
      special_notes: specialNotes.trim()
    });

    if (createdOrders && createdOrders.length > 0) {
      const primaryOrder = createdOrders[0];
      setConfirmedOrder(primaryOrder);

      // Attempt automatic WhatsApp tab launch
      if (primaryOrder.whatsapp_url) {
        try {
          window.open(primaryOrder.whatsapp_url, "_blank");
        } catch (err) {
          console.warn("Popup blocked or mobile tab switch needed");
        }
      }
    }
  };

  const handleCopyMessage = () => {
    if (confirmedOrder?.whatsapp_message) {
      navigator.clipboard.writeText(confirmedOrder.whatsapp_message);
      setCopied(true);
      showToast("Order message copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem", paddingBottom: "5rem" }}>
      
      {/* 🟢 WHATSAPP ORDER SUBMITTED CONFIRMATION MODAL */}
      {confirmedOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 25, 47, 0.85)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.25rem"
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "24px",
              maxWidth: "580px",
              width: "100%",
              padding: "2.25rem 2rem",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.4)",
              position: "relative",
              border: "1.5px solid #E2E8F0",
              maxHeight: "92vh",
              overflowY: "auto"
            }}
          >
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div
                style={{
                  width: "66px",
                  height: "66px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  boxShadow: "0 10px 25px rgba(37, 211, 102, 0.4)",
                  marginBottom: "1rem"
                }}
              >
                <MessageSquare size={34} />
              </div>

              <div style={{ display: "inline-block", background: "#E6FBF2", color: "#00A896", fontSize: "0.82rem", fontWeight: 800, padding: "0.25rem 0.8rem", borderRadius: "999px", marginBottom: "0.5rem" }}>
                ORDER CREATED: #{confirmedOrder.id || confirmedOrder.order_id}
              </div>

              <h2 style={{ fontSize: "1.65rem", fontWeight: 900, color: "#0A192F", margin: 0 }}>
                Order Sent to WhatsApp!
              </h2>
            </div>

            {/* ⚠️ CRITICAL INSTRUCTION (Section 6.2 SOW Requirement) */}
            <div
              style={{
                background: "#FEF3C7",
                border: "1.5px solid #F59E0B",
                borderRadius: "16px",
                padding: "1rem 1.25rem",
                marginBottom: "1.5rem",
                display: "flex",
                gap: "0.85rem",
                alignItems: "flex-start"
              }}
            >
              <AlertTriangle size={22} color="#D97706" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div style={{ fontSize: "0.88rem", color: "#92400E", lineHeight: 1.5 }}>
                <strong style={{ color: "#78350F", display: "block", marginBottom: "2px", fontSize: "0.92rem" }}>
                  Action Required: Click "Send" in WhatsApp
                </strong>
                You must click <strong>Send</strong> in WhatsApp to transmit this order request. 
                Opening WhatsApp alone does not confirm or send your order to our team.
              </div>
            </div>

            {/* Order Details Card */}
            <div
              style={{
                background: "#F8FAFC",
                borderRadius: "16px",
                border: "1px solid #E2E8F0",
                padding: "1.25rem",
                marginBottom: "1.5rem",
                fontSize: "0.88rem"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ color: "#64748B" }}>Order Reference:</span>
                <strong style={{ color: "#0A192F" }}>#{confirmedOrder.id}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ color: "#64748B" }}>Customer:</span>
                <strong style={{ color: "#0A192F" }}>{confirmedOrder.customer_name} ({confirmedOrder.customer_phone})</strong>
              </div>
              {confirmedOrder.target_whatsapp && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", background: "#F0FDFA", padding: "0.4rem 0.75rem", borderRadius: "10px", border: "1px solid #CCFBF1" }}>
                  <span style={{ color: "#0D9488", fontWeight: 700, fontSize: "0.82rem" }}>WhatsApp Destination:</span>
                  <strong style={{ color: "#0F766E", fontSize: "0.84rem" }}>+{confirmedOrder.target_whatsapp}</strong>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ color: "#64748B" }}>Fulfillment:</span>
                <strong style={{ color: "#00A896" }}>{confirmedOrder.fulfillment_type}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #E2E8F0", paddingTop: "0.6rem", marginTop: "0.6rem" }}>
                <span style={{ color: "#0A192F", fontWeight: 700 }}>Total Due:</span>
                <strong style={{ color: "#00A896", fontSize: "1.05rem" }}>{formatPrice(confirmedOrder.total_amount)}</strong>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <a
                href={confirmedOrder.whatsapp_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#25D366",
                  color: "#FFFFFF",
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: "1rem",
                  padding: "0.95rem 1.25rem",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  boxShadow: "0 6px 20px rgba(37, 211, 102, 0.4)",
                  cursor: "pointer"
                }}
              >
                <MessageSquare size={20} />
                <span>Open WhatsApp to Send Order</span>
                <ExternalLink size={16} />
              </a>

              <button
                type="button"
                onClick={handleCopyMessage}
                style={{
                  background: copied ? "#F0FDF4" : "#FFFFFF",
                  border: copied ? "1.5px solid #22C55E" : "1.5px solid #CBD5E1",
                  color: copied ? "#16A34A" : "#475569",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.45rem",
                  cursor: "pointer"
                }}
              >
                {copied ? <Check size={18} color="#16A34A" /> : <Copy size={18} />}
                <span>{copied ? "Copied Order Text!" : "Copy WhatsApp Message Text"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setConfirmedOrder(null);
                  setActiveTab("my-orders");
                }}
                style={{
                  background: "#0A192F",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  padding: "0.8rem 1rem",
                  borderRadius: "14px",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "0.25rem"
                }}
              >
                Track in My Orders ➔
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Page Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#00A896", fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>
          <MessageSquare size={16} /> WhatsApp Checkout Flow
        </div>
        <h1 style={{ fontSize: "2.2rem", color: "#0A192F", fontWeight: 900, marginBottom: "0.35rem" }}>
          Complete Your Order
        </h1>
        <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
          Submit your order request directly via WhatsApp to our central Cayman team. Choose between <strong>Collection at Stall</strong> or <strong>Grand Cayman Courier Delivery</strong>.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem", alignItems: "flex-start" }}>
        
        {/* Left: Customer Info & Fulfillment Selector */}
        <div>

          {/* Fulfillment Toggle (Collection vs Delivery) */}
          <div style={{ marginBottom: "1.75rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0A192F", display: "block", marginBottom: "0.6rem" }}>
              Select Fulfillment Preference *
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              
              {/* Option 1: Stall Collection */}
              <div
                onClick={() => setFulfillmentType("Collection at Stall")}
                style={{
                  background: fulfillmentType === "Collection at Stall" ? "#F0FDFA" : "#FFFFFF",
                  border: fulfillmentType === "Collection at Stall" ? "2px solid #00A896" : "1.5px solid #E2E8F0",
                  borderRadius: "16px",
                  padding: "1.1rem 1rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: fulfillmentType === "Collection at Stall" ? "0 4px 15px rgba(0, 168, 150, 0.15)" : "none"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                  <Store size={20} color={fulfillmentType === "Collection at Stall" ? "#00A896" : "#64748B"} />
                  <strong style={{ fontSize: "0.92rem", color: fulfillmentType === "Collection at Stall" ? "#0A192F" : "#334155" }}>
                    Collection at Stall
                  </strong>
                </div>
                <div style={{ fontSize: "0.78rem", color: "#64748B", lineHeight: 1.4 }}>
                  Pick up directly from the vendor's physical stall or shop counter on Grand Cayman.
                </div>
                <div style={{ marginTop: "0.5rem", fontSize: "0.76rem", color: "#00A896", fontWeight: 800 }}>
                  FREE PICKUP
                </div>
              </div>

              {/* Option 2: Island Courier Delivery */}
              <div
                onClick={() => setFulfillmentType("Island Courier Delivery")}
                style={{
                  background: fulfillmentType === "Island Courier Delivery" ? "#F0FDFA" : "#FFFFFF",
                  border: fulfillmentType === "Island Courier Delivery" ? "2px solid #00A896" : "1.5px solid #E2E8F0",
                  borderRadius: "16px",
                  padding: "1.1rem 1rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: fulfillmentType === "Island Courier Delivery" ? "0 4px 15px rgba(0, 168, 150, 0.15)" : "none"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                  <Truck size={20} color={fulfillmentType === "Island Courier Delivery" ? "#00A896" : "#64748B"} />
                  <strong style={{ fontSize: "0.92rem", color: fulfillmentType === "Island Courier Delivery" ? "#0A192F" : "#334155" }}>
                    Island Courier
                  </strong>
                </div>
                <div style={{ fontSize: "0.78rem", color: "#64748B", lineHeight: 1.4 }}>
                  Dispatched by courier to your residence, condo, hotel, or resort on Grand Cayman.
                </div>
                <div style={{ marginTop: "0.5rem", fontSize: "0.76rem", color: "#16A34A", fontWeight: 800 }}>
                  ISLAND-WIDE
                </div>
              </div>

            </div>
          </div>

          {/* Customer Details Form */}
          <form onSubmit={handleSubmitOrder} style={{ background: "#FFFFFF", borderRadius: "20px", border: "1.5px solid #E2E8F0", padding: "1.75rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0A192F", marginBottom: "1.25rem" }}>
              Customer Details
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
              
              {/* Full Name */}
              {/* Full Name */}
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.4rem", display: "block" }}>
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Enter your full name"
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    borderRadius: "12px",
                    border: "1.5px solid #CBD5E1",
                    fontSize: "0.95rem"
                  }}
                />
              </div>

              {/* WhatsApp Phone Number (Full Width with compact country selector) */}
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.4rem", display: "block" }}>
                  WhatsApp Phone Number *
                </label>
                <div style={{ display: "flex", gap: "0.6rem", alignItems: "stretch" }}>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    style={{
                      width: "125px",
                      minWidth: "125px",
                      flexShrink: 0,
                      padding: "0.8rem 0.5rem",
                      borderRadius: "12px",
                      border: "1.5px solid #CBD5E1",
                      fontSize: "0.92rem",
                      background: "#F8FAFC",
                      color: "#0F172A",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    <option value="+91">🇮🇳 +91 (IN)</option>
                    <option value="+1345">🇰🇾 +1 345 (KY)</option>
                  </select>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder={countryCode === "+91" ? "Enter 10-digit WhatsApp number (e.g. 9825012345)" : "Enter Cayman phone (e.g. 9265544)"}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      width: "100%",
                      padding: "0.8rem 1rem",
                      borderRadius: "12px",
                      border: "1.5px solid #CBD5E1",
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#0F172A"
                    }}
                  />
                </div>
                <span style={{ fontSize: "0.78rem", color: "#00A896", marginTop: "5px", display: "block", fontWeight: 700 }}>
                  {countryCode === "+91"
                    ? "✅ Live Testing: Enter ANY 10-digit Indian number. WhatsApp will open directly with this number!"
                    : "🇰🇾 Cayman area code +1 (345)"}
                </span>
              </div>

              {/* Email Address */}
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.4rem", display: "block" }}>
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. customer@example.com"
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    borderRadius: "12px",
                    border: "1.5px solid #CBD5E1",
                    fontSize: "0.95rem"
                  }}
                />
              </div>

              {/* Delivery Address (if Delivery selected) */}
              {fulfillmentType === "Island Courier Delivery" && (
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.35rem", display: "block" }}>
                    Grand Cayman Delivery Address *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Resort Name, Room/Condo #, Street, District (e.g. Westin Resort, Room 314, Seven Mile Beach)"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "12px",
                      border: "1.5px solid #CBD5E1",
                      fontSize: "0.95rem",
                      fontFamily: "inherit"
                    }}
                  />
                </div>
              )}

              {/* Order Notes */}
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.35rem", display: "block" }}>
                  Special Instructions / Requests
                </label>
                <input
                  type="text"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g. Preferred collection time, gift packaging..."
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "12px",
                    border: "1.5px solid #CBD5E1",
                    fontSize: "0.95rem"
                  }}
                />
              </div>

            </div>

            {/* Offline Payment Information */}
            <div
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "14px",
                padding: "1rem",
                marginBottom: "1.5rem",
                fontSize: "0.82rem",
                color: "#475569",
                lineHeight: 1.5
              }}
            >
              <div style={{ fontWeight: 800, color: "#0A192F", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                💵 Payment Arranged Upon Order Confirmation
              </div>
              Online credit card processing is excluded for initial launch. 
              You can pay via <strong>Cash on Collection</strong>, <strong>Cash on Delivery</strong>, or <strong>Local Cayman Bank Transfer</strong> (Butterfield / CNB) directly with the store.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                width: "100%",
                background: "#25D366",
                color: "#FFFFFF",
                border: "none",
                padding: "1rem 1.25rem",
                fontSize: "1.05rem",
                fontWeight: 900,
                borderRadius: "16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.6rem",
                boxShadow: "0 8px 25px rgba(37, 211, 102, 0.4)",
                transition: "all 0.2s ease"
              }}
            >
              <MessageSquare size={22} />
              <span>Submit Order via WhatsApp</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ textAlign: "center", fontSize: "0.82rem", color: "#64748B", marginTop: "0.85rem" }}>
              💬 Order will open directly in WhatsApp with: <strong style={{ color: "#0A192F" }}>{customerPhone ? `${countryCode} ${customerPhone}` : "your entered WhatsApp number"}</strong>
            </div>

          </form>

        </div>

        {/* Right: Order Summary Breakdown */}
        <div>
          <div style={{ background: "#FFFFFF", borderRadius: "20px", border: "1.5px solid #E2E8F0", padding: "1.75rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0A192F", marginBottom: "1.25rem" }}>
              Order Summary ({cart.reduce((sum, item) => sum + item.qty, 0)} items)
            </h3>

            {/* Item List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem", maxHeight: "360px", overflowY: "auto" }}>
              {cart.map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: "0.85rem", alignItems: "center", borderBottom: "1px solid #F1F5F9", paddingBottom: "0.85rem" }}>
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    style={{ width: "56px", height: "56px", borderRadius: "12px", objectFit: "cover" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0A192F", lineHeight: 1.3 }}>
                      {item.product.title}
                    </div>
                    <div style={{ fontSize: "0.76rem", color: "#00A896", fontWeight: 600, marginTop: "2px" }}>
                      {item.product.vendor_name}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#64748B" }}>
                      Qty: <strong>{item.qty}</strong>
                    </div>
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0A192F" }}>
                    {formatPrice(item.product.price * item.qty)}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div style={{ borderTop: "1.5px solid #E2E8F0", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", color: "#64748B" }}>
                <span>Subtotal:</span>
                <span>{formatPrice(grandTotalKYD)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", color: "#64748B" }}>
                <span>Fulfillment ({fulfillmentType === "Collection at Stall" ? "Stall Pickup" : "Courier"}):</span>
                <span style={{ color: "#16A34A", fontWeight: 700 }}>FREE</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", color: "#64748B" }}>
                <span>Cayman Islands Sales Tax:</span>
                <span style={{ color: "#00A896", fontWeight: 700 }}>$0.00 (Duty-Free)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.35rem", fontWeight: 900, color: "#0A192F", paddingTop: "0.6rem", borderTop: "1px solid #F1F5F9" }}>
                <span>Total Due:</span>
                <span style={{ color: "#00A896" }}>{formatPrice(grandTotalKYD)}</span>
              </div>
            </div>

            {/* Trust badge */}
            <div style={{ marginTop: "1.5rem", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "12px", padding: "0.9rem", fontSize: "0.8rem", color: "#166534", lineHeight: 1.4 }}>
              🌴 <strong>Direct Island Merchant Fulfillment</strong>: Your order is sent directly to Cayman Bazaar's concierge and fulfilled by verified Grand Cayman artisans and shops.
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
