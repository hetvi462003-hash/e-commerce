import React from "react";
import { useMarketplace } from "../context/MarketplaceContext";
import { Building2, ShieldCheck, MapPin, Phone, Mail, Award, Clock, ArrowRight } from "lucide-react";

export default function Footer({ setActiveTab }) {
  const { openAuthModal } = useMarketplace();
  return (
    <footer style={{ background: "#0A192F", color: "#F8FAFC", paddingTop: "4rem", paddingBottom: "2rem", borderTop: "1px solid #1E293B", marginTop: "5rem" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2.5rem", marginBottom: "3rem" }}>
          
          {/* Brand Info */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
              <div style={{ background: "#00A896", width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF" }}>
                <Building2 size={22} />
              </div>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 800, color: "#FFFFFF" }}>
                CAYMAN<span style={{ color: "#00A896" }}>BAZAAR</span>
              </span>
            </div>
            <p style={{ color: "#94A3B8", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "1.2rem" }}>
              Grand Cayman's official multi-vendor e-commerce marketplace empowering island artisans, local beach shops, and duty-free merchants.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#E5A93C", fontSize: "0.82rem", fontWeight: 600 }}>
              <Award size={16} /> Certified Cayman Islands Small Business Network
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: "#FFFFFF", fontSize: "1rem", marginBottom: "1.2rem" }}>Marketplace Navigation</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.88rem", color: "#CBD5E1" }}>
              <li>
                <a href="#stores" onClick={(e) => { e.preventDefault(); setActiveTab("stores"); }}>
                  Browse Island Stalls
                </a>
              </li>
              <li>
                <a href="#categories" onClick={(e) => { e.preventDefault(); setActiveTab("categories"); }}>
                  Product Categories
                </a>
              </li>
              <li>
                <a href="#orders" onClick={(e) => { e.preventDefault(); setActiveTab("my-orders"); }}>
                  My Orders & Pickup Passes
                </a>
              </li>
              <li>
                <a href="#faq" onClick={(e) => { e.preventDefault(); setActiveTab("faq"); }}>
                  FAQ / Pickup Policy
                </a>
              </li>
              <li>
                <a href="#contact" onClick={(e) => { e.preventDefault(); setActiveTab("contact"); }}>
                  Contact / Support Concierge
                </a>
              </li>
            </ul>
          </div>

          {/* Offline Payment & Pickup Info */}
          <div>
            <h4 style={{ color: "#FFFFFF", fontSize: "1rem", marginBottom: "1.2rem" }}>How It Works</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", fontSize: "0.85rem", color: "#94A3B8" }}>
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <Clock size={18} color="#00A896" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span><strong>Reserve for Pickup:</strong> Holds reserved items for 24-48 hours. Present your 4-digit PIN code at store clerk.</span>
              </div>
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <ShieldCheck size={18} color="#E5A93C" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span><strong>Cash on Delivery (COD):</strong> Pay in cash ($KYD / $USD) upon courier delivery anywhere on Grand Cayman.</span>
              </div>
            </div>
          </div>

          {/* Vendor Join Banner */}
          <div style={{ background: "rgba(255,255,255,0.05)", padding: "1.5rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <h4 style={{ color: "#FFFFFF", fontSize: "1rem", marginBottom: "0.5rem" }}>Own a Cayman Business?</h4>
            <p style={{ color: "#94A3B8", fontSize: "0.82rem", marginBottom: "1rem" }}>
              Set up your vendor store, list products, sync Instagram, and start receiving COD & pickup orders today.
            </p>
            <button
              onClick={() => openAuthModal("vendor")}
              className="btn-primary"
              style={{ width: "100%", padding: "0.6rem 1rem", fontSize: "0.85rem", cursor: "pointer" }}
            >
              Sell on CaymanBazaar <ArrowRight size={15} />
            </button>
          </div>

        </div>

        <div style={{ borderTop: "1px solid #1E293B", paddingTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", fontSize: "0.8rem", color: "#64748B" }}>
          <div>© 2026 CaymanBazaar Marketplace. Georgetown, Grand Cayman, Cayman Islands.</div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <span style={{ cursor: "pointer" }} onClick={(e) => { e.preventDefault(); setActiveTab("faq"); }}>Privacy Policy</span>
            <span style={{ cursor: "pointer" }} onClick={(e) => { e.preventDefault(); setActiveTab("faq"); }}>Terms of Service</span>
            <span
              style={{ cursor: "pointer", color: "#00A896", fontWeight: 600 }}
              onClick={() => openAuthModal("vendor")}
            >
              Merchant Portal
            </span>
            <span
              style={{ cursor: "pointer", color: "#64748B" }}
              onClick={() => openAuthModal("admin")}
            >
              Admin Access
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
