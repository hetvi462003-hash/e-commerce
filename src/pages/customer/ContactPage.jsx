import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  ShieldCheck,
  CheckCircle,
  HelpCircle
} from "lucide-react";

export default function ContactPage({ setActiveTab }) {
  const { showToast } = useMarketplace();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "order_pickup",
    orderId: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const existingInquiries = JSON.parse(localStorage.getItem("cayman_concierge_inquiries") || "[]");
      existingInquiries.push({
        id: `INQ-${Date.now()}`,
        ...formData,
        submitted_at: new Date().toISOString()
      });
      localStorage.setItem("cayman_concierge_inquiries", JSON.stringify(existingInquiries));
    } catch (err) {}
    setSubmitted(true);
    showToast("Inquiry dispatched! Cayman Concierge has logged your request.", "success");
  };

  return (
    <div className="container" style={{ padding: "3rem 1.5rem", paddingBottom: "6rem", maxWidth: "1180px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#00A896", fontSize: "0.88rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
          <MessageCircle size={18} /> Concierge & Merchant Support
        </div>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "2.8rem", color: "#0F172A", marginBottom: "0.8rem", fontWeight: 800 }}>
          Contact CaymanBazaar
        </h1>
        <p style={{ color: "#64748B", fontSize: "1.05rem", maxWidth: "620px", margin: "0 auto", lineHeight: 1.6 }}>
          Have questions regarding WhatsApp order requests, stall collection, courier delivery, or vendor onboarding? Our island concierge team is here to assist.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem" }}>
        {/* Contact Info Channels */}
        <div>
          <div style={{ background: "#FFFFFF", borderRadius: "24px", border: "1.5px solid #E2E8F0", padding: "2.25rem", boxShadow: "var(--shadow-sm)", marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", marginBottom: "1.5rem" }}>
              Island Headquarters & Channels
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(0,168,150,0.1)", color: "#00A896", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <div style={{ fontSize: "0.82rem", textTransform: "uppercase", fontWeight: 700, color: "#64748B" }}>Marketplace Concierge Desk</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F172A", marginTop: "0.15rem" }}>Cardinall Avenue, Craft Market Pavilion</div>
                  <div style={{ fontSize: "0.85rem", color: "#64748B" }}>Georgetown, Grand Cayman, KY1-1102</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(245,158,11,0.1)", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Phone size={22} />
                </div>
                <div>
                  <div style={{ fontSize: "0.82rem", textTransform: "uppercase", fontWeight: 700, color: "#64748B" }}>Local Telephone Desk</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F172A", marginTop: "0.15rem" }}>+1 (345) 949-CAYM (2296)</div>
                  <div style={{ fontSize: "0.85rem", color: "#64748B" }}>Mon - Sat: 8:00 AM – 7:00 PM EST</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(16,185,129,0.1)", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MessageCircle size={22} />
                </div>
                <div>
                  <div style={{ fontSize: "0.82rem", textTransform: "uppercase", fontWeight: 700, color: "#64748B" }}>Instant WhatsApp Concierge</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F172A", marginTop: "0.15rem" }}>+1 (345) 926-PASS (7277)</div>
                  <div style={{ fontSize: "0.85rem", color: "#64748B" }}>Instant order coordination & customer support</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(99,102,241,0.1)", color: "#4F46E5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Mail size={22} />
                </div>
                <div>
                  <div style={{ fontSize: "0.82rem", textTransform: "uppercase", fontWeight: 700, color: "#64748B" }}>Official Email Support</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F172A", marginTop: "0.15rem" }}>concierge@caymanbazaar.ky</div>
                  <div style={{ fontSize: "0.85rem", color: "#64748B" }}>Response typically within 2-4 hours</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ card */}
          <div style={{ background: "linear-gradient(135deg, #0A192F 0%, #172A45 100%)", borderRadius: "24px", padding: "2rem", color: "#FFFFFF", boxShadow: "var(--shadow-md)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "#F59E0B", fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.5rem" }}>
              <HelpCircle size={18} /> Need Immediate Answers?
            </div>
            <h4 style={{ fontSize: "1.15rem", marginBottom: "0.6rem" }}>Check our Pickup & COD FAQ</h4>
            <p style={{ color: "#94A3B8", fontSize: "0.88rem", lineHeight: 1.5, marginBottom: "1.25rem" }}>
              Find complete guidelines on 48-hour reserve windows, 4-digit PIN passes, resort delivery schedules, and vendor commission rules.
            </p>
            <button
              onClick={() => setActiveTab && setActiveTab("faq")}
              className="btn-gold"
              style={{ width: "100%", justifyContent: "center", padding: "0.75rem", fontSize: "0.9rem" }}
            >
              Browse FAQ & Pickup Info
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div style={{ background: "#FFFFFF", borderRadius: "24px", border: "1.5px solid #E2E8F0", padding: "2.5rem", boxShadow: "var(--shadow-sm)" }}>
          <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.4rem" }}>
            Send a Concierge Inquiry
          </h3>
          <p style={{ color: "#64748B", fontSize: "0.9rem", marginBottom: "1.75rem" }}>
            Fill out the details below and an island representative will respond right away.
          </p>

          {submitted ? (
            <div style={{ textAlign: "center", padding: "3rem 1.5rem", background: "rgba(0,168,150,0.05)", borderRadius: "16px", border: "1.5px solid #00A896" }}>
              <CheckCircle size={52} color="#00A896" style={{ margin: "0 auto 1rem auto" }} />
              <h4 style={{ fontSize: "1.25rem", color: "#0F172A", fontWeight: 800, marginBottom: "0.5rem" }}>Inquiry Dispatched!</h4>
              <p style={{ color: "#64748B", fontSize: "0.92rem", marginBottom: "1.5rem", lineHeight: 1.5 }}>
                Your request has been logged with CaymanBazaar Concierge. If urgent, contact us via WhatsApp at +1 (345) 926-PASS.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-outline"
                style={{ padding: "0.6rem 1.25rem", fontSize: "0.85rem" }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "12px", border: "1.5px solid #CBD5E1", fontSize: "0.95rem" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "12px", border: "1.5px solid #CBD5E1", fontSize: "0.95rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (345) 9xx-xxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "12px", border: "1.5px solid #CBD5E1", fontSize: "0.95rem" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                    Inquiry Topic *
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "12px", border: "1.5px solid #CBD5E1", fontSize: "0.9rem", background: "#FFFFFF" }}
                  >
                    <option value="order_pickup">WhatsApp Order & Stall Collection</option>
                    <option value="cod_delivery">Island Courier Delivery</option>
                    <option value="vendor_onboarding">Register as Cayman Stall Vendor</option>
                    <option value="vendor_invoicing">Vendor Commissions & Invoicing</option>
                    <option value="general">General Support / Feedback</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                    Order ID (if applicable)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ORD-9801"
                    value={formData.orderId}
                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                    style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "12px", border: "1.5px solid #CBD5E1", fontSize: "0.95rem" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                  Your Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can our concierge desk help you today? Please include any stall number or resort location..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "12px", border: "1.5px solid #CBD5E1", fontSize: "0.95rem", resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                className="btn-gold"
                style={{ width: "100%", padding: "0.9rem", fontSize: "1rem", justifyContent: "center", borderRadius: "12px", marginTop: "0.5rem" }}
              >
                <Send size={18} /> Submit Inquiry to Concierge
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
