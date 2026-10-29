import React from "react";
import { MessageCircle, Phone, Mail, Clock, ShieldCheck, Heart } from "lucide-react";

export default function Footer({ setActiveTab }) {
  return (
    <footer style={{ background: "#0F172A", color: "#F8FAFC", paddingTop: "4rem", paddingBottom: "2rem", borderTop: "1px solid #1E293B" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2.5rem", marginBottom: "3rem" }}>
          
          {/* 1. Quick Links */}
          <div>
            <h4 style={{ color: "#FFFFFF", fontSize: "1rem", fontWeight: 700, marginBottom: "1.2rem" }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.88rem", color: "#94A3B8" }}>
              <li>
                <span style={{ cursor: "pointer" }} onClick={() => setActiveTab("categories")}>
                  Shop
                </span>
              </li>
              <li>
                <span style={{ cursor: "pointer" }} onClick={() => setActiveTab("categories")}>
                  Categories
                </span>
              </li>
              <li>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setActiveTab("home");
                    setTimeout(() => {
                      const el = document.getElementById("new-arrivals-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                >
                  New Arrivals
                </span>
              </li>
              <li>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setActiveTab("home");
                    setTimeout(() => {
                      const el = document.getElementById("special-offers-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                >
                  Special Offers
                </span>
              </li>
              <li>
                <a
                  href="https://wa.me/13459492299?text=Hello%20CaymanBazaar%2C%20I%20need%20assistance."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#94A3B8", textDecoration: "none" }}
                >
                  Customer Support
                </a>
              </li>
              <li>
                <span style={{ cursor: "pointer" }} onClick={() => setActiveTab("contact")}>
                  Contact Us
                </span>
              </li>
            </ul>
          </div>

          {/* 2. Customer Support */}
          <div>
            <h4 style={{ color: "#FFFFFF", fontSize: "1rem", fontWeight: 700, marginBottom: "1.2rem" }}>
              Customer Support
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.88rem", color: "#94A3B8" }}>
              <a
                href="https://wa.me/13459492299?text=Hello%20CaymanBazaar%2C%20I%20need%20assistance."
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#25D366", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 600 }}
              >
                <MessageCircle size={16} /> WhatsApp +1 (345) 949-2299
              </a>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Phone size={15} color="#94A3B8" /> +1 (345) 949-2299
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Mail size={15} color="#94A3B8" /> support@caymanbazaar.ky
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#64748B" }}>
                <Clock size={15} /> Mon - Sat: 9:00am - 7:00pm
              </div>
            </div>
          </div>

          {/* 3. Follow Us & WhatsApp */}
          <div>
            <h4 style={{ color: "#FFFFFF", fontSize: "1rem", fontWeight: 700, marginBottom: "1.2rem" }}>
              Follow Us
            </h4>
            <a
              href="https://wa.me/13459492299?text=Hello%20CaymanBazaar%2C%20I%20would%20like%20to%20follow%20your%20updates!"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                background: "#25D366",
                color: "#FFFFFF",
                padding: "0.55rem 1rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 700,
                textDecoration: "none",
                marginBottom: "1.5rem"
              }}
            >
              <MessageCircle size={16} /> Follow on WhatsApp
            </a>

            <h4 style={{ color: "#FFFFFF", fontSize: "0.92rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              Accepted Payment Methods
            </h4>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", fontSize: "0.75rem", fontWeight: 700, color: "#94A3B8" }}>
              <span style={{ background: "#1E293B", padding: "0.25rem 0.55rem", borderRadius: "4px", border: "1px solid #334155" }}>VISA</span>
              <span style={{ background: "#1E293B", padding: "0.25rem 0.55rem", borderRadius: "4px", border: "1px solid #334155" }}>MASTERCARD</span>
              <span style={{ background: "#1E293B", padding: "0.25rem 0.55rem", borderRadius: "4px", border: "1px solid #334155" }}>AMEX</span>
              <span style={{ background: "#1E293B", padding: "0.25rem 0.55rem", borderRadius: "4px", border: "1px solid #334155" }}>DISCOVER</span>
              <span style={{ background: "#065F46", color: "#D1FAE5", padding: "0.25rem 0.55rem", borderRadius: "4px", border: "1px solid #047857" }}>CASH ON DELIVERY (COD)</span>
            </div>
          </div>

          {/* 4. Help & Info */}
          <div>
            <h4 style={{ color: "#FFFFFF", fontSize: "1rem", fontWeight: 700, marginBottom: "1.2rem" }}>
              Help & Info
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.88rem", color: "#94A3B8" }}>
              <li>
                <span style={{ cursor: "pointer" }} onClick={() => setActiveTab("contact")}>
                  About CaymanBazaar
                </span>
              </li>
              <li>
                <span style={{ cursor: "pointer" }} onClick={() => setActiveTab("faq")}>
                  Returns & Store Credit Policy
                </span>
              </li>
              <li>
                <span style={{ cursor: "pointer" }} onClick={() => setActiveTab("faq")}>
                  Delivery Information
                </span>
              </li>
              <li>
                <span style={{ cursor: "pointer" }} onClick={() => setActiveTab("faq")}>
                  Terms & Conditions
                </span>
              </li>
              <li>
                <span style={{ cursor: "pointer" }} onClick={() => setActiveTab("faq")}>
                  Privacy Policy
                </span>
              </li>
              <li>
                <span style={{ cursor: "pointer" }} onClick={() => setActiveTab("contact")}>
                  Contact Us
                </span>
              </li>
            </ul>
          </div>

        </div>

        <div style={{ borderTop: "1px solid #1E293B", paddingTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", fontSize: "0.82rem", color: "#64748B" }}>
          <div>
            © 2026 CaymanBazaar. All rights reserved. Grand Cayman, Cayman Islands.
          </div>
          <div>
            Shop local. Support Cayman Islands business.
          </div>
        </div>

      </div>
    </footer>
  );
}
