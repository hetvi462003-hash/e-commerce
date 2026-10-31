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

  // Form Fields - Default country code to +1 (345) Cayman, with +91 available for live testing
  const [countryCode, setCountryCode] = useState("+1345");
  const [customerName, setCustomerName] = useState(customerProfile?.name || "");
  const [customerPhone, setCustomerPhone] = useState(customerPhoneSession || "");
  const [customerEmail, setCustomerEmail] = useState(customerProfile?.email || "");
  const [district, setDistrict] = useState("George Town");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod' | 'pickup' | 'card'

  // Post-submission WhatsApp Modal state
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [copied, setCopied] = useState(false);

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

    if (!customerName.trim() || !customerPhone.trim()) {
      showToast("Please enter your name and phone number.", "warning");
      return;
    }

    if (fulfillmentType === "Island Courier Delivery" && !deliveryAddress.trim()) {
      showToast("Please enter your Grand Cayman delivery address.", "warning");
      return;
    }

    const cleanRawPhone = customerPhone.trim();
    const digitsOnly = cleanRawPhone.replace(/\D/g, "");

    let waRecipient = digitsOnly;
    if (countryCode === "+91") {
      waRecipient = digitsOnly.length === 10 ? `91${digitsOnly}` : (digitsOnly.startsWith("91") ? digitsOnly : `91${digitsOnly}`);
    } else {
      waRecipient = digitsOnly.length === 7 ? `1345${digitsOnly}` : (digitsOnly.startsWith("345") ? `1${digitsOnly}` : digitsOnly);
    }

    const formattedPhone = cleanRawPhone.startsWith("+")
      ? cleanRawPhone
      : `${countryCode} ${cleanRawPhone}`;

    const fullAddress = fulfillmentType === "Island Courier Delivery"
      ? `${deliveryAddress.trim()} (${district}, Grand Cayman)`
      : `Store Pickup (${district})`;

    const createdOrders = placeOrder({
      fulfillment_type: fulfillmentType,
      type: fulfillmentType === "Island Courier Delivery" ? "COD" : "PICKUP",
      customer_name: customerName.trim(),
      customer_phone: formattedPhone,
      target_whatsapp: waRecipient,
      country_code: countryCode,
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

            <div style={{ background: "#F8FAFC", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem", fontSize: "0.85rem" }}>
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
            <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "14px", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827", marginBottom: "1rem" }}>
                1. Delivery or Pickup
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                
                {/* Courier Delivery */}
                <div
                  onClick={() => setFulfillmentType("Island Courier Delivery")}
                  style={{
                    background: fulfillmentType === "Island Courier Delivery" ? "#F0FDF4" : "#FFFFFF",
                    border: fulfillmentType === "Island Courier Delivery" ? "2px solid #16A34A" : "1px solid #E5E7EB",
                    borderRadius: "12px",
                    padding: "1rem",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.35rem" }}>
                    <Truck size={18} color={fulfillmentType === "Island Courier Delivery" ? "#16A34A" : "#64748B"} />
                    <strong style={{ fontSize: "0.9rem", color: "#111827" }}>
                      Island Delivery
                    </strong>
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "#64748B", lineHeight: 1.4 }}>
                    Dispatched across Grand Cayman (Condo, Hotel, Residence).
                  </div>
                  <div style={{ fontSize: "0.74rem", color: "#16A34A", fontWeight: 800, marginTop: "0.5rem" }}>
                    FREE OVER CI$50.00
                  </div>
                </div>

                {/* Store Pickup */}
                <div
                  onClick={() => setFulfillmentType("Store Pickup")}
                  style={{
                    background: fulfillmentType === "Store Pickup" ? "#F0FDF4" : "#FFFFFF",
                    border: fulfillmentType === "Store Pickup" ? "2px solid #16A34A" : "1px solid #E5E7EB",
                    borderRadius: "12px",
                    padding: "1rem",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.35rem" }}>
                    <Store size={18} color={fulfillmentType === "Store Pickup" ? "#16A34A" : "#64748B"} />
                    <strong style={{ fontSize: "0.9rem", color: "#111827" }}>
                      Store Pickup
                    </strong>
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "#64748B", lineHeight: 1.4 }}>
                    Ready for quick collection at local partner shops.
                  </div>
                  <div style={{ fontSize: "0.74rem", color: "#16A34A", fontWeight: 800, marginTop: "0.5rem" }}>
                    ALWAYS FREE
                  </div>
                </div>

              </div>
            </div>

            {/* 2. Customer Contact & Address */}
            <form onSubmit={handleSubmitOrder} style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "14px", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827", marginBottom: "1.25rem" }}>
                2. Contact & Delivery Address
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                
                {/* Full Name */}
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#374151", marginBottom: "0.35rem" }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    style={{
                      width: "100%",
                      padding: "0.75rem 0.95rem",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "0.9rem"
                    }}
                  />
                </div>

                {/* WhatsApp Phone */}
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#374151", marginBottom: "0.35rem" }}>
                    WhatsApp Phone Number *
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      style={{
                        padding: "0.75rem 0.65rem",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        background: "#F8FAFC",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "#1E293B"
                      }}
                    >
                      <option value="+1345">🇰🇾 +1 (345) Cayman</option>
                      <option value="+1">🇺🇸/🇨🇦 +1 US/CA</option>
                      <option value="+91">🇮🇳 +91 India (Live Test)</option>
                    </select>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder={countryCode === "+1345" ? "e.g. 949-2299" : countryCode === "+91" ? "10-digit number" : "Mobile number"}
                      style={{
                        flex: 1,
                        padding: "0.75rem 0.95rem",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "0.9rem"
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "0.74rem", color: "#64748B", marginTop: "0.25rem", display: "block" }}>
                    We send order dispatch and delivery updates via WhatsApp.
                  </span>
                </div>

                {/* Email Address */}
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#374151", marginBottom: "0.35rem" }}>
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. customer@example.com"
                    style={{
                      width: "100%",
                      padding: "0.75rem 0.95rem",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "0.9rem"
                    }}
                  />
                </div>

                {/* Island District Selector */}
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#374151", marginBottom: "0.35rem" }}>
                    Grand Cayman District *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem 0.95rem",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "0.9rem",
                      background: "#FFFFFF"
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
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#374151", marginBottom: "0.35rem" }}>
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
                        padding: "0.75rem 0.95rem",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "0.9rem"
                      }}
                    />
                  </div>
                )}

                {/* Order Notes */}
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#374151", marginBottom: "0.35rem" }}>
                    Order Notes / Delivery Instructions
                  </label>
                  <input
                    type="text"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Leave at front reception, gift wrapping"
                    style={{
                      width: "100%",
                      padding: "0.75rem 0.95rem",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "0.9rem"
                    }}
                  />
                </div>

              </div>

              {/* 3. Payment Method */}
              <div style={{ marginTop: "1.75rem", paddingTop: "1.5rem", borderTop: "1px solid #F1F5F9" }}>
                <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827", marginBottom: "0.85rem" }}>
                  3. Payment Method
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.85rem 1rem",
                    border: paymentMethod === "cod" ? "1.5px solid #16A34A" : "1px solid #E5E7EB",
                    borderRadius: "10px",
                    background: paymentMethod === "cod" ? "#F0FDF4" : "#FFFFFF",
                    cursor: "pointer"
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <div>
                      <strong style={{ fontSize: "0.88rem", color: "#111827", display: "block" }}>
                        Cash on Delivery (COD) / Cash on Pickup
                      </strong>
                      <span style={{ fontSize: "0.76rem", color: "#64748B" }}>
                        Pay in cash upon receiving your order on Grand Cayman.
                      </span>
                    </div>
                  </label>

                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.85rem 1rem",
                    border: paymentMethod === "card" ? "1.5px solid #16A34A" : "1px solid #E5E7EB",
                    borderRadius: "10px",
                    background: paymentMethod === "card" ? "#F0FDF4" : "#FFFFFF",
                    cursor: "pointer"
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                    />
                    <div>
                      <strong style={{ fontSize: "0.88rem", color: "#111827", display: "block" }}>
                        Credit / Debit Card on Delivery
                      </strong>
                      <span style={{ fontSize: "0.76rem", color: "#64748B" }}>
                        Visa, Mastercard, Amex accepted via mobile POS terminal.
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
                  background: "#D1FAE5",
                  color: "#065F46",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0.95rem 1.25rem",
                  fontSize: "0.95rem",
                  fontWeight: 900,
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  marginTop: "1.75rem",
                  transition: "all 0.2s ease"
                }}
              >
                <span>COMPLETE ORDER VIA WHATSAPP</span>
                <ArrowRight size={17} />
              </button>

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
