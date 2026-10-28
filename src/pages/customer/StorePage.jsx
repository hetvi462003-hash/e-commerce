import React from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import ProductCard from "../../components/ProductCard";
import {
  CheckCircle2,
  Star,
  MapPin,
  Clock,
  Globe,
  Share2,
  MessageCircle,
  ShieldCheck,
  Package,
  Store,
  ChevronLeft
} from "lucide-react";

export default function StorePage({ vendor, setActiveTab, setSelectedProduct }) {
  const { products, vendors } = useMarketplace();

  // Fallback to active vendor if not set
  const currentVendor = vendor || vendors[0];

  // Get products for this vendor
  const vendorProducts = products.filter((p) => p.vendor_id === currentVendor.id);

  return (
    <div style={{ paddingBottom: "5rem" }}>
      
      {/* Back button */}
      <div className="container" style={{ paddingTop: "1.25rem", paddingBottom: "0.75rem" }}>
        <button
          onClick={() => setActiveTab("stores")}
          style={{
            background: "transparent",
            color: "#64748B",
            fontWeight: 700,
            fontSize: "0.85rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem"
          }}
        >
          <ChevronLeft size={16} /> Back to Island Stalls Promenade
        </button>
      </div>

      {/* Beach Canopy Accent */}
      <div className="stall-canopy" style={{ height: "14px" }} />

      {/* Vendor Store Hero Banner */}
      <div style={{ height: "260px", position: "relative", overflow: "hidden", background: "#07101E" }}>
        <img
          src={currentVendor.banner}
          alt={currentVendor.store_name}
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(7,16,30,0.9) 0%, transparent 60%)" }} />

        <div className="container" style={{ position: "absolute", bottom: "20px", left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span className="badge badge-stall" style={{ fontSize: "0.82rem", padding: "0.35rem 0.85rem" }}>
            {currentVendor.stall_number || "Stall #01"} • {currentVendor.stall_tag || "Artisan Stall"}
          </span>

          <span style={{
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(8px)",
            color: "#10B981",
            fontSize: "0.78rem",
            fontWeight: 800,
            padding: "0.3rem 0.85rem",
            borderRadius: "999px",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            border: "1px solid rgba(16, 185, 129, 0.4)"
          }}>
            <span className="pulse-dot"></span> Stall Open Now
          </span>
        </div>
      </div>

      {/* Store Header Details Card */}
      <div className="container" style={{ marginTop: "-40px", position: "relative", zIndex: 10, marginBottom: "3.5rem" }}>
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "24px",
            padding: "2rem",
            border: "1px solid #E2E8F0",
            boxShadow: "var(--shadow-md)",
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
            alignItems: "flex-start"
          }}
        >
          {/* Logo */}
          <img
            src={currentVendor.logo}
            alt={currentVendor.store_name}
            style={{
              width: "104px",
              height: "104px",
              borderRadius: "24px",
              border: "4px solid #FFFFFF",
              boxShadow: "var(--shadow-md)",
              objectFit: "cover",
              marginTop: "-44px",
              background: "#FFFFFF"
            }}
          />

          {/* Core Info */}
          <div style={{ flex: 1, minWidth: "260px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
              <h1 style={{ fontSize: "2rem", color: "#0A2540", fontWeight: 900 }}>{currentVendor.store_name}</h1>
              {currentVendor.verified && (
                <span className="badge badge-verified">
                  <CheckCircle2 size={13} /> Licensed Cayman Merchant
                </span>
              )}
            </div>

            <div style={{ fontSize: "0.92rem", color: "#00897B", fontWeight: 800, marginBottom: "0.6rem" }}>
              {currentVendor.specialty || currentVendor.stall_tag}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", flexWrap: "wrap", color: "#64748B", fontSize: "0.85rem", marginBottom: "0.95rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <MapPin size={15} color="#00BFA5" />
                <span>{currentVendor.address}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Clock size={15} color="#F59E0B" />
                <span>{currentVendor.hours}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#B45309", fontWeight: 800 }}>
                <Star size={15} fill="#B45309" /> {currentVendor.rating} ({currentVendor.reviews_count} verified reviews)
              </div>
            </div>

            <p style={{ color: "#334155", fontSize: "0.92rem", lineHeight: 1.55, marginBottom: "1.25rem" }}>
              {currentVendor.bio}
            </p>

            {/* Social Connection Links & WhatsApp */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap" }}>
              {currentVendor.social_connections?.instagram && (
                <a
                  href={`https://instagram.com/${currentVendor.social_connections.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", background: "#FDF2F8", color: "#DB2777", padding: "0.4rem 0.85rem", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 700 }}
                >
                  <Share2 size={14} /> {currentVendor.social_connections.instagram}
                </a>
              )}

              {currentVendor.social_connections?.facebook && (
                <a
                  href={currentVendor.social_connections.facebook.startsWith("http") ? currentVendor.social_connections.facebook : `https://facebook.com/${currentVendor.social_connections.facebook}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", background: "#EFF6FF", color: "#1D4ED8", padding: "0.4rem 0.85rem", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 700 }}
                >
                  <Globe size={14} /> Facebook Storefront
                </a>
              )}

              <button
                onClick={() => {
                  const cleanPhone = (currentVendor.phone || "+13459491234").replace(/\D/g, "");
                  const msg = encodeURIComponent(`Hi ${currentVendor.store_name}, I saw your stall on CaymanBazaar and would like to ask about your products!`);
                  window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
                }}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", background: "#DCFCE7", color: "#15803D", padding: "0.4rem 0.95rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 800, cursor: "pointer", border: "1px solid #BBF7D0" }}
              >
                <MessageCircle size={15} /> WhatsApp Stall ({currentVendor.phone})
              </button>
            </div>
          </div>

          {/* Pickup & Policy Box */}
          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", padding: "1.5rem", borderRadius: "20px", width: "280px" }}>
            <h4 style={{ fontSize: "0.95rem", color: "#0A2540", marginBottom: "0.65rem", display: "flex", alignItems: "center", gap: "0.45rem", fontWeight: 800 }}>
              <ShieldCheck size={18} color="#00BFA5" /> Stall Pickup Guarantee
            </h4>
            <p style={{ fontSize: "0.82rem", color: "#64748B", lineHeight: 1.45, marginBottom: "0.75rem" }}>
              {currentVendor.policies.pickup_policy}
            </p>
            <div style={{ fontSize: "0.78rem", color: "#0284C7", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.35rem" }}>
              ✓ Cash on Delivery supported in {currentVendor.district}
            </div>
          </div>

        </div>
      </div>

      {/* Store Product Catalog */}
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
          <div>
            <h2 style={{ fontSize: "1.8rem", color: "#0A2540", fontWeight: 900 }}>Stall Catalog ({vendorProducts.length})</h2>
            <p style={{ fontSize: "0.88rem", color: "#64748B" }}>Browse items available for WhatsApp order checkout, stall collection, or courier delivery</p>
          </div>
          <span style={{ background: "#E0F2FE", color: "#0284C7", padding: "0.35rem 0.9rem", borderRadius: "999px", fontSize: "0.82rem", fontWeight: 800 }}>
            In-Stock Catalog
          </span>
        </div>

        {vendorProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", background: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
            <Package size={48} color="#CBD5E1" style={{ marginBottom: "1rem" }} />
            <h4 style={{ color: "#475569" }}>No products listed at this stall currently</h4>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {vendorProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelectProduct={(p, directReserve = false) => {
                  setSelectedProduct(p);
                  if (directReserve) {
                    setActiveTab("checkout");
                  } else {
                    setActiveTab("product-detail");
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
