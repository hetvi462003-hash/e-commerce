import React from "react";
import { CheckCircle2, Star, MapPin, Clock, ArrowRight, ShieldCheck, ShoppingBag, MessageCircle, Store } from "lucide-react";

export default function StoreCard({ vendor, onVisitStore }) {
  return (
    <div
      onClick={() => onVisitStore(vendor)}
      style={{
        background: "#FFFFFF",
        borderRadius: "20px",
        overflow: "hidden",
        border: "1.5px solid #E2E8F0",
        boxShadow: "0 4px 16px rgba(15, 23, 42, 0.05)",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 16px 36px rgba(0, 168, 150, 0.15)";
        e.currentTarget.style.borderColor = "rgba(0, 168, 150, 0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(15, 23, 42, 0.05)";
        e.currentTarget.style.borderColor = "#E2E8F0";
      }}
    >
      {/* Banner with District Badge */}
      <div style={{ height: "175px", position: "relative", overflow: "hidden", background: "#0F172A" }}>
        <img
          src={vendor.banner || vendor.photo || "/cayman_market_promenade.jpg"}
          alt={vendor.store_name}
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.95, transition: "transform 0.6s ease" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.7) 100%)" }} />

        {/* Top Badges */}
        <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "0.4rem" }}>
          <span style={{
            fontSize: "0.74rem",
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#FFFFFF",
            fontWeight: 800,
            padding: "0.22rem 0.65rem",
            borderRadius: "8px",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem"
          }}>
            <MapPin size={11} color="#00E5C9" /> {vendor.district}
          </span>
        </div>

        <div style={{ position: "absolute", top: "12px", right: "12px" }}>
          <span style={{
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(6px)",
            color: "#10B981",
            fontSize: "0.72rem",
            fontWeight: 800,
            padding: "0.22rem 0.65rem",
            borderRadius: "999px",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            border: "1px solid rgba(16, 185, 129, 0.4)"
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981" }}></span> Open Now
          </span>
        </div>
      </div>

      {/* Store Content */}
      <div style={{ padding: "1.4rem", paddingTop: 0, flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Store Avatar Logo & Rating */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: "-32px", marginBottom: "0.85rem" }}>
          <img
            src={vendor.logo || vendor.photo || "https://images.unsplash.com/photo-1541643600914-78b084683601?w=150&auto=format&fit=crop&q=80"}
            alt={vendor.store_name}
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              border: "3px solid #FFFFFF",
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
              objectFit: "cover",
              background: "#0F172A"
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "#FEF3C7", color: "#B45309", padding: "0.25rem 0.65rem", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 800, border: "1px solid #FDE68A" }}>
            <Star size={12} fill="#B45309" /> {Number(vendor.rating || 5.0).toFixed(1)} <span style={{ color: "#92400E", fontWeight: 600 }}>({vendor.reviews_count ?? vendor.review_count ?? 12})</span>
          </div>
        </div>

        {/* Store Name & Verified Status */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem" }}>
          <h3 style={{ fontSize: "1.2rem", color: "#0F172A", fontWeight: 800, lineHeight: 1.25, margin: 0 }}>
            {vendor.store_name}
          </h3>
          {vendor.verified && (
            <CheckCircle2 size={16} color="#00A896" style={{ flexShrink: 0 }} />
          )}
        </div>

        {/* Specialty / Category Tag */}
        <div style={{ fontSize: "0.8rem", color: "#00A896", fontWeight: 700, marginBottom: "0.5rem" }}>
          {vendor.specialty || vendor.store_type || "Cayman Boutique"}
        </div>
        
        {/* Address */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#64748B", fontSize: "0.78rem", marginBottom: "0.85rem" }}>
          <MapPin size={12} color="#94A3B8" style={{ flexShrink: 0 }} />
          <span>{(vendor.address || `${vendor.district}, Grand Cayman`).substring(0, 38)}...</span>
        </div>

        <p style={{ color: "#475569", fontSize: "0.84rem", lineHeight: 1.45, marginBottom: "1rem", flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {vendor.bio}
        </p>

        {/* Store Badges */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <span style={{ fontSize: "0.72rem", color: "#166534", background: "#DCFCE7", padding: "0.2rem 0.55rem", borderRadius: "6px", fontWeight: 800 }}>
            ⚡ WhatsApp Order
          </span>
          <span style={{ fontSize: "0.72rem", color: "#1E40AF", background: "#EFF6FF", padding: "0.2rem 0.55rem", borderRadius: "6px", fontWeight: 800 }}>
            🚚 Island COD
          </span>
          <span style={{ fontSize: "0.72rem", color: "#0F766E", background: "#F0FDFA", padding: "0.2rem 0.55rem", borderRadius: "6px", fontWeight: 800 }}>
            🏪 Store Pickup
          </span>
        </div>

        {/* Action Row */}
        <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "0.85rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: "0.76rem", color: "#64748B", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Clock size={12} /> {vendor.hours || "9:00 AM - 6:00 PM"}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onVisitStore(vendor);
            }}
            className="btn-primary"
            style={{ padding: "0.45rem 1rem", fontSize: "0.82rem", borderRadius: "10px", fontWeight: 800 }}
          >
            Visit Store <ArrowRight size={13} />
          </button>
        </div>

      </div>
    </div>
  );
}
