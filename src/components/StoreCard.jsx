import React from "react";
import { CheckCircle2, Star, MapPin, Clock, ArrowRight, ShieldCheck, ShoppingBag, MessageCircle } from "lucide-react";

export default function StoreCard({ vendor, onVisitStore }) {
  return (
    <div className="virtual-stall-card" onClick={() => onVisitStore(vendor)} style={{ cursor: "pointer" }}>
      
      {/* Decorative Beachfront Awning Canopy */}
      <div className="stall-awning" />

      {/* Banner with District & Stall Badge Overlay */}
      <div style={{ height: "175px", position: "relative", overflow: "hidden", background: "#050B14" }}>
        <img
          src={vendor.banner || vendor.photo || "/cayman_market_promenade.jpg"}
          alt={vendor.store_name}
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.95, transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(5,11,20,0.15) 0%, rgba(5,11,20,0.75) 100%)" }} />

        {/* Top Badges */}
        <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "0.4rem" }}>
          <span className="badge badge-stall" style={{ fontSize: "0.74rem", background: "rgba(5, 11, 20, 0.9)", border: "1px solid rgba(245, 158, 11, 0.4)", color: "#FDE68A" }}>
            {vendor.stall_number || "Stall #01"}
          </span>
        </div>

        <div style={{ position: "absolute", top: "12px", right: "12px", display: "flex", gap: "0.4rem" }}>
          {vendor.is_open_now && (
            <span style={{
              background: "rgba(5, 11, 20, 0.9)",
              backdropFilter: "blur(10px)",
              color: "#10B981",
              fontSize: "0.72rem",
              fontWeight: 800,
              padding: "0.28rem 0.75rem",
              borderRadius: "999px",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              border: "1px solid rgba(16, 185, 129, 0.4)"
            }}>
              <span className="pulse-dot"></span> Open Pavilion
            </span>
          )}
        </div>
      </div>

      {/* Stall Content */}
      <div style={{ padding: "1.45rem", paddingTop: "0", flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Stall Avatar Logo & Rating */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: "-36px", marginBottom: "0.85rem" }}>
          <img
            src={vendor.logo || vendor.photo || "https://images.unsplash.com/photo-1541643600914-78b084683601?w=150&auto=format&fit=crop&q=80"}
            alt={vendor.store_name}
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "18px",
              border: "3.5px solid #FFFFFF",
              boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
              objectFit: "cover",
              background: "#091322"
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "#FEF3C7", color: "#B45309", padding: "0.3rem 0.75rem", borderRadius: "10px", fontSize: "0.82rem", fontWeight: 800, border: "1px solid #FDE68A" }}>
            <Star size={13} fill="#B45309" /> {Number(vendor.rating || 5.0).toFixed(1)} <span style={{ color: "#92400E", fontWeight: 600 }}>({vendor.reviews_count ?? vendor.review_count ?? 12})</span>
          </div>
        </div>

        {/* Stall Name & Verified Status */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.25rem" }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.28rem", color: "#0A1C36", fontWeight: 800, lineHeight: 1.25 }}>
            {vendor.store_name}
          </h3>
          {vendor.verified && (
            <CheckCircle2 size={17} color="#00B49F" style={{ flexShrink: 0 }} />
          )}
        </div>

        {/* Stall Tag / Specialty */}
        <div style={{ fontSize: "0.82rem", color: "#00B49F", fontWeight: 800, marginBottom: "0.45rem" }}>
          {vendor.specialty || vendor.stall_tag}
        </div>
        
        {/* District & Location */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#64748B", fontSize: "0.8rem", marginBottom: "0.85rem" }}>
          <MapPin size={13} color="#00B49F" style={{ flexShrink: 0 }} />
          <span>{vendor.district} • {(vendor.address || `${vendor.district}, Grand Cayman`).substring(0, 34)}...</span>
        </div>

        <p style={{ color: "#4A5B73", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "1.15rem", flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {vendor.bio}
        </p>

        {/* Stall Perks (Reserve / COD) */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.1rem" }}>
          <span style={{ fontSize: "0.74rem", color: "#B45309", background: "#FEF3C7", padding: "0.24rem 0.65rem", borderRadius: "8px", fontWeight: 800, border: "1px solid #FDE68A" }}>
            🛍️ WhatsApp Reserve
          </span>
          <span style={{ fontSize: "0.74rem", color: "#00B49F", background: "#CCFBF1", padding: "0.24rem 0.65rem", borderRadius: "8px", fontWeight: 800, border: "1px solid #99F6E4" }}>
            💵 Island COD
          </span>
        </div>

        {/* Action Row */}
        <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "0.95rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: "0.78rem", color: "#94A3B8", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Clock size={13} /> {vendor.hours ? vendor.hours.split(":")[0] : (vendor.operating_hours ? vendor.operating_hours.split(":")[0] : "9 AM - 6 PM")}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onVisitStore(vendor);
            }}
            className="btn-primary"
            style={{ padding: "0.52rem 1.15rem", fontSize: "0.84rem", borderRadius: "12px", fontWeight: 800 }}
          >
            Enter Pavilion <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}
