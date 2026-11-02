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
  ShieldCheck,
  Clock,
  ArrowLeft
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
    CENTRAL_MARKETPLACE_PHONE_DISPLAY
  } = useMarketplace();

  // Fulfillment Selection: 'Island Courier Delivery' or 'Store Pickup'
  const [fulfillmentType, setFulfillmentType] = useState("Island Courier Delivery");

  // Form Fields - Clean initial state (no hardcoded/stale "yash")
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [district, setDistrict] = useState("Seven Mile Beach");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod' | 'card'

  // Post-submission WhatsApp Modal state
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [copied, setCopied] = useState(false);

  // Phone auto-formatter for Cayman 7 digits
  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw.length <= 3) {
      setCustomerPhone(raw);
    } else if (raw.length <= 7) {
      setCustomerPhone(`${raw.slice(0, 3)}-${raw.slice(3)}`);
    } else {
      const trimmed = raw.slice(0, 7);
      setCustomerPhone(`${trimmed.slice(0, 3)}-${trimmed.slice(3)}`);
    }
  };

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div style={{ background: "#F8FAFC", minHeight: "80vh", padding: "4rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          background: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderRadius: "16px",
          padding: "3.5rem 2.5rem",
          textAlign: "center",
          maxWidth: "480px"
        }}>
          <ShoppingBag size={48} color="#94A3B8" style={{ marginBottom: "1rem" }} />
          <h2 style={{ color: "#111827", fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            Your Shopping Cart is Empty
          </h2>
          <p style={{ color: "#64748B", fontSize: "0.9rem", marginBottom: "1.75rem" }}>
            Add your favorite items from Grand Cayman shops before proceeding to checkout.
          </p>
          <button
            onClick={() => setActiveTab("categories")}
            style={{
              background: "#0F172A",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "999px",
              padding: "0.75rem 1.75rem",
              fontSize: "0.92rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Explore Catalog
          </button>
        </div>
      </div>
    );
  }

  const grandTotalKYD = cart.reduce((acc, item) => acc + item.product.price * item.qty, 0);
  const qualifiesForFreeDelivery = grandTotalKYD >= 50.0 || fulfillmentType === "Store Pickup";

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      showToast("Please enter your full name.", "warning");
      return;
    }

    const digitsOnly = customerPhone.replace(/\D/g, "");
    if (!digitsOnly || digitsOnly.length < 7) {
      showToast("Please enter a valid 7-digit Grand Cayman phone number (e.g. 949-2299).", "warning");
      return;
    }

    if (fulfillmentType === "Island Courier Delivery" && !deliveryAddress.trim()) {
      showToast("Please enter your Grand Cayman delivery address or resort name.", "warning");
      return;
    }

    // Cayman local 7-digit formatting
    const local7 = digitsOnly.slice(-7);
    const formattedPhone = `+1 (345) ${local7.slice(0, 3)}-${local7.slice(3)}`;

    const fullAddress = fulfillmentType === "Island Courier Delivery"
      ? `${deliveryAddress.trim()} (${district}, Grand Cayman)`
      : `Store Pickup (${district})`;

    const createdOrders = placeOrder({
      fulfillment_type: fulfillmentType,
      type: fulfillmentType === "Island Courier Delivery" ? "COD" : "PICKUP",
      customer_name: customerName.trim(),
      customer_phone: formattedPhone,
      target_whatsapp: "13459492299", // Central CaymanBazaar Marketplace Concierge
      country_code: "+1345",
      customer_email: customerEmail.trim(),
      delivery_address: fullAddress,
      special_notes: specialNotes.trim()
    });

    if (createdOrders && createdOrders.length > 0) {
      const primaryOrder = createdOrders[0];
      setConfirmedOrder(primaryOrder);

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
    <div style={{ background: "#F8FAFC", minHeight: "85vh", padding: "2.5rem 0 5rem" }}>
      
      {/* 🟢 ORDER SUBMISSION CONFIRMATION MODAL */}
      {confirmedOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem"
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              padding: "2.25rem",
              maxWidth: "520px",
              width: "100%",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              animation: "modalPopIn 0.3s ease-out"
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "#DCFCE7",
                  color: "#16A34A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem"
                }}
              >
                <CheckCircle2 size={34} />
              </div>
              <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#111827", margin: 0 }}>
                Order #{confirmedOrder.id} Placed!
              </h2>
              <p style={{ color: "#4B5563", fontSize: "0.88rem", marginTop: "0.35rem" }}>
                Thank you, <strong>{confirmedOrder.customer_name}</strong>! Your order details have been prepared for WhatsApp confirmation.
              </p>
            </div>

            <div style={{ background: "#F8FAFC", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "1rem", marginBottom: "1.25rem", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ color: "#64748B" }}>Total Amount:</span>
                <strong style={{ color: "#111827" }}>CI${confirmedOrder.total_amount.toFixed(2)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ color: "#64748B" }}>Fulfillment:</span>
                <strong style={{ color: "#00A896" }}>{confirmedOrder.fulfillment_type}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748B" }}>Destination:</span>
                <strong style={{ color: "#111827" }}>Grand Cayman</strong>
              </div>
            </div>

            {/* SOW Requirement: Clear notice that customer must press Send */}
            <div style={{ background: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: "10px", padding: "0.75rem 0.85rem", marginBottom: "1.25rem", fontSize: "0.8rem", color: "#92400E", textAlign: "left", display: "flex", gap: "0.55rem", alignItems: "flex-start" }}>
              <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>📲</span>
              <div>
                <strong>Important:</strong> Please make sure to press <strong>Send</strong> in WhatsApp. Opening WhatsApp alone does not send or confirm receipt of your order.
              </div>
            </div>

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
                  fontSize: "0.95rem",
                  padding: "0.85rem 1.25rem",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}
              >
                <MessageSquare size={18} />
                <span>Open WhatsApp to Confirm Order</span>
                <ExternalLink size={15} />
              </a>

              <button
                type="button"
                onClick={handleCopyMessage}
                style={{
                  background: copied ? "#F0FDF4" : "#FFFFFF",
                  border: "1px solid #D1D5DB",
                  color: copied ? "#16A34A" : "#374151",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.45rem",
                  cursor: "pointer"
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? "Copied to Clipboard!" : "Copy WhatsApp Order Text"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setConfirmedOrder(null);
                  setActiveTab("my-orders");
                }}
                style={{
                  background: "#0F172A",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "0.25rem"
                }}
              >
                View in My Orders ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="container" style={{ maxWidth: "1420px", margin: "0 auto", padding: "0 1.25rem" }}>
        
        {/* Back Link */}
        <div style={{ marginBottom: "1.25rem" }}>
          <button
            onClick={() => setActiveTab("cart")}
            style={{
              background: "none",
              border: "none",
              color: "#64748B",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem"
            }}
          >
            <ArrowLeft size={16} /> Back to Shopping Cart
          </button>
        </div>

        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", marginBottom: "1.75rem" }}>
          Checkout & Order Placement
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "2rem", alignItems: "flex-start" }}>
          
          {/* 📝 Left Column: Form Details */}
          <div>
            
            {/* 1. Fulfillment Preference */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F172A", marginBottom: "1rem" }}>
                1. Delivery or Pickup
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                
                {/* Courier Delivery */}
                <div
                  onClick={() => setFulfillmentType("Island Courier Delivery")}
                  style={{
                    background: fulfillmentType === "Island Courier Delivery" ? "#F0FDFA" : "#FFFFFF",
                    border: fulfillmentType === "Island Courier Delivery" ? "2px solid #00A896" : "1.5px solid #E2E8F0",
                    borderRadius: "14px",
                    padding: "1.15rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    position: "relative"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.45rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                      <div style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: fulfillmentType === "Island Courier Delivery" ? "#CCFBF1" : "#F1F5F9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <Truck size={17} color={fulfillmentType === "Island Courier Delivery" ? "#00A896" : "#64748B"} />
                      </div>
                      <strong style={{ fontSize: "0.95rem", color: "#0F172A" }}>
                        Island Delivery
                      </strong>
                    </div>
                    {fulfillmentType === "Island Courier Delivery" && (
                      <CheckCircle2 size={18} color="#00A896" />
                    )}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#64748B", lineHeight: 1.45, marginLeft: "2.55rem" }}>
                    Dispatched across Grand Cayman (Condo, Hotel, Residence).
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#00A896", fontWeight: 800, marginTop: "0.6rem", marginLeft: "2.55rem" }}>
                    FREE OVER CI$50.00
                  </div>
                </div>

                {/* Store Pickup */}
                <div
                  onClick={() => setFulfillmentType("Store Pickup")}
                  style={{
                    background: fulfillmentType === "Store Pickup" ? "#F0FDFA" : "#FFFFFF",
                    border: fulfillmentType === "Store Pickup" ? "2px solid #00A896" : "1.5px solid #E2E8F0",
                    borderRadius: "14px",
                    padding: "1.15rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    position: "relative"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.45rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                      <div style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: fulfillmentType === "Store Pickup" ? "#CCFBF1" : "#F1F5F9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <Store size={17} color={fulfillmentType === "Store Pickup" ? "#00A896" : "#64748B"} />
                      </div>
                      <strong style={{ fontSize: "0.95rem", color: "#0F172A" }}>
                        Store Pickup
                      </strong>
                    </div>
                    {fulfillmentType === "Store Pickup" && (
                      <CheckCircle2 size={18} color="#00A896" />
                    )}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#64748B", lineHeight: 1.45, marginLeft: "2.55rem" }}>
                    Ready for quick collection at local partner shops.
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#00A896", fontWeight: 800, marginTop: "0.6rem", marginLeft: "2.55rem" }}>
                    ALWAYS FREE
                  </div>
                </div>

              </div>
            </div>

            {/* 2. Customer Contact & Address */}
            <form onSubmit={handleSubmitOrder} style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "1.75rem", marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F172A", marginBottom: "1.25rem" }}>
                2. Contact & Delivery Address
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                
                {/* Full Name */}
                <div>
                  <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your full name"
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem",
                      borderRadius: "10px",
                      border: "1.5px solid #E2E8F0",
                      fontSize: "0.92rem",
                      color: "#0F172A"
                    }}
                  />
                </div>

                {/* WhatsApp Phone (Grand Cayman Native +1 345) */}
                <div>
                  <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                    WhatsApp Phone Number *
                  </label>
                  <div style={{
                    display: "flex",
                    alignItems: "stretch",
                    borderRadius: "10px",
                    border: "1.5px solid #E2E8F0",
                    overflow: "hidden",
                    background: "#FFFFFF"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.45rem",
                      padding: "0.8rem 1rem",
                      background: "#F8FAFC",
                      borderRight: "1.5px solid #E2E8F0",
                      fontWeight: 700,
                      fontSize: "0.88rem",
                      color: "#0F172A",
                      flexShrink: 0
                    }}>
                      <span style={{ fontSize: "1.1rem" }}>🇰🇾</span>
                      <span>+1 (345)</span>
                    </div>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={handlePhoneChange}
                      placeholder="949-2299"
                      style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        padding: "0.8rem 1rem",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#0F172A",
                        letterSpacing: "0.03em"
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "0.35rem", display: "block" }}>
                    Enter your 7-digit Grand Cayman mobile or WhatsApp number.
                  </span>
                </div>

                {/* Email Address */}
                <div>
                  <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. name@example.com"
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem",
                      borderRadius: "10px",
                      border: "1.5px solid #E2E8F0",
                      fontSize: "0.92rem",
                      color: "#0F172A"
                    }}
                  />
                </div>

                {/* Island District Selector */}
                <div>
                  <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                    Grand Cayman District *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem",
                      borderRadius: "10px",
                      border: "1.5px solid #E2E8F0",
                      fontSize: "0.92rem",
                      background: "#FFFFFF",
                      color: "#0F172A",
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                  >
                    <option value="George Town">George Town (Capital & Port)</option>
                    <option value="Seven Mile Beach">Seven Mile Beach (Resort Corridor)</option>
                    <option value="West Bay">West Bay</option>
                    <option value="Bodden Town">Bodden Town</option>
                    <option value="North Side">North Side & Cayman Kai</option>
                    <option value="East End">East End</option>
                  </select>
                </div>

                {/* Delivery Address (if Delivery selected) */}
                {fulfillmentType === "Island Courier Delivery" && (
                  <div>
                    <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                      Street Address / Resort & Room # *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="e.g. Westin Resort, Room 412, West Bay Road"
                      style={{
                        width: "100%",
                        padding: "0.85rem 1rem",
                        borderRadius: "10px",
                        border: "1.5px solid #E2E8F0",
                        fontSize: "0.92rem",
                        resize: "vertical",
                        color: "#0F172A"
                      }}
                    />
                  </div>
                )}

                {/* Order Notes */}
                <div>
                  <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                    Order Notes / Delivery Instructions
                  </label>
                  <input
                    type="text"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Leave with front desk, delivery between 2-4 PM"
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem",
                      borderRadius: "10px",
                      border: "1.5px solid #E2E8F0",
                      fontSize: "0.92rem",
                      color: "#0F172A"
                    }}
                  />
                </div>

              </div>

              {/* 3. Payment Method */}
              <div style={{ marginTop: "1.75rem", paddingTop: "1.5rem", borderTop: "1px solid #F1F5F9" }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F172A", marginBottom: "1rem" }}>
                  3. Payment Method
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.85rem",
                    padding: "0.95rem 1.15rem",
                    border: paymentMethod === "cod" ? "2px solid #00A896" : "1.5px solid #E2E8F0",
                    borderRadius: "12px",
                    background: paymentMethod === "cod" ? "#F0FDFA" : "#FFFFFF",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      style={{ width: "18px", height: "18px", margin: 0, accentColor: "#00A896", cursor: "pointer", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: "0.92rem", color: "#0F172A", display: "block" }}>
                        Cash on Delivery (COD) / Cash on Pickup
                      </strong>
                      <span style={{ fontSize: "0.78rem", color: "#64748B" }}>
                        Pay in cash upon receiving your order on Grand Cayman (KYD or USD accepted).
                      </span>
                    </div>
                  </label>

                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.85rem",
                    padding: "0.95rem 1.15rem",
                    border: paymentMethod === "card" ? "2px solid #00A896" : "1.5px solid #E2E8F0",
                    borderRadius: "12px",
                    background: paymentMethod === "card" ? "#F0FDFA" : "#FFFFFF",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      style={{ width: "18px", height: "18px", margin: 0, accentColor: "#00A896", cursor: "pointer", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: "0.92rem", color: "#0F172A", display: "block" }}>
                        Credit / Debit Card on Delivery
                      </strong>
                      <span style={{ fontSize: "0.78rem", color: "#64748B" }}>
                        Visa, Mastercard, Amex accepted via courier's mobile POS terminal.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                style={{
                  width: "100%",
                  background: "#25D366",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "12px",
                  padding: "1rem 1.5rem",
                  fontSize: "1rem",
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  marginTop: "1.75rem",
                  boxShadow: "0 6px 20px rgba(37, 211, 102, 0.35)",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#20BD5A";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#25D366";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <MessageSquare size={19} />
                <span>COMPLETE ORDER VIA WHATSAPP</span>
                <ArrowRight size={17} />
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.45rem", marginTop: "0.85rem", fontSize: "0.76rem", color: "#64748B", textAlign: "center" }}>
                <ShieldCheck size={14} color="#16A34A" />
                <span>No online card payment required • Order is confirmed directly on WhatsApp</span>
              </div>

            </form>

          </div>

          {/* 🧾 Right Column: Order Summary (Sticky matching EE345) */}
          <div style={{ position: "sticky", top: "100px" }}>
            <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "1.5rem" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827", marginBottom: "1rem" }}>
                Order Summary ({cart.reduce((s, i) => s + i.qty, 0)})
              </h2>

              {/* Items List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", maxHeight: "300px", overflowY: "auto", marginBottom: "1.25rem" }}>
                {cart.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <img
                      src={item.product.images?.[0] || item.product.image || item.product.image_url}
                      alt={item.product.title}
                      style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.product.title}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#64748B" }}>
                        Qty: {item.qty} × CI${item.product.price.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#111827" }}>
                      CI${(item.product.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Free Delivery Bar */}
              <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "10px", padding: "0.75rem 0.85rem", marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.78rem", fontWeight: 700, color: "#166534" }}>
                  <Truck size={15} color="#16A34A" />
                  <span>
                    {qualifiesForFreeDelivery
                      ? "Your order qualifies for free delivery"
                      : `Add CI$${(50 - grandTotalKYD).toFixed(2)} more for free delivery`}
                  </span>
                </div>
              </div>

              {/* Totals */}
              <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "0.85rem", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.88rem", color: "#4B5563" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 700, color: "#111827" }}>CI${grandTotalKYD.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Delivery</span>
                  <span style={{ color: "#16A34A", fontWeight: 700 }}>{qualifiesForFreeDelivery ? "FREE" : "CI$5.00"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Cayman Sales Tax</span>
                  <span style={{ color: "#00A896", fontWeight: 700 }}>0% (Tax-Free)</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.15rem", fontWeight: 900, color: "#111827", paddingTop: "0.75rem", borderTop: "1px solid #E5E7EB" }}>
                  <span>Total Due</span>
                  <span>CI${grandTotalKYD.toFixed(2)}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
