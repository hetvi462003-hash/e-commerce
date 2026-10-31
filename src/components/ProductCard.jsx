import React, { useState } from "react";
import { useMarketplace } from "../context/MarketplaceContext";
import { ShoppingCart, Heart, Eye } from "lucide-react";

export default function ProductCard({ product, onSelectProduct }) {
  const { formatPrice, addToCart, currency } = useMarketplace();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isLowStock = product.stock_count > 0 && product.stock_count <= 5;
  const isOutOfStock = product.stock_count <= 0;

  // Approximate USD display if KYD is primary
  const priceUSD = (product.price * 1.2).toFixed(2);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, {}, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div
      onClick={() => onSelectProduct && onSelectProduct(product)}
      style={{
        background: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid #E5E7EB",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        height: "100%",
        boxSizing: "border-box"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
      }}
    >
      {/* Top Overlay: Badges and Wishlist Heart */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
        {/* Badge Pill */}
        <div>
          {product.price >= 20 && product.featured ? (
            <span
              style={{
                background: "#E0F2FE",
                color: "#0369A1",
                fontSize: "0.68rem",
                fontWeight: 800,
                padding: "0.2rem 0.55rem",
                borderRadius: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.04em"
              }}
            >
              TRENDING
            </span>
          ) : (
            <span
              style={{
                background: "#F1F5F9",
                color: "#475569",
                fontSize: "0.68rem",
                fontWeight: 800,
                padding: "0.2rem 0.55rem",
                borderRadius: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.04em"
              }}
            >
              NEW ARRIVAL
            </span>
          )}
        </div>

        {/* Wishlist Heart */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px",
            color: isWishlisted ? "#EF4444" : "#9CA3AF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.15s ease"
          }}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={18} fill={isWishlisted ? "#EF4444" : "none"} strokeWidth={1.8} />
        </button>
      </div>

      {/* Product Image */}
      <div
        style={{
          height: "220px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F8FAFC",
          overflow: "hidden",
          borderRadius: "12px",
          marginBottom: "0.75rem"
        }}
      >
        <img
          src={product.images[0]}
          alt={product.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.35s ease"
          }}
        />
      </div>

      {/* Quick View Link */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (onSelectProduct) onSelectProduct(product);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.3rem",
          fontSize: "0.76rem",
          color: "#6B7280",
          fontWeight: 600,
          marginBottom: "0.6rem",
          cursor: "pointer"
        }}
      >
        <Eye size={13} /> Quick View
      </div>

      {/* Product Title */}
      <h4
        style={{
          fontSize: "0.95rem",
          fontWeight: 700,
          color: "#111827",
          lineHeight: 1.35,
          marginBottom: "0.5rem",
          minHeight: "2.6em",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
        }}
      >
        {product.title}
      </h4>

      {/* Color / Variant Dots (EE345 style) */}
      <div style={{ display: "flex", gap: "0.35rem", marginBottom: "0.6rem", minHeight: "14px" }}>
        <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#3B82F6", display: "inline-block" }} />
        <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#EC4899", display: "inline-block" }} />
      </div>

      {/* Price */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", marginBottom: "0.5rem" }}>
        <span style={{ fontSize: "1.18rem", fontWeight: 800, color: "#111827" }}>
          {currency === "KYD" ? `CI$${Number(product.price).toFixed(2)}` : formatPrice(product.price)}
        </span>
        {currency === "KYD" && (
          <span style={{ fontSize: "0.78rem", color: "#6B7280", fontWeight: 500 }}>
            (~${priceUSD} USD)
          </span>
        )}
      </div>

      {/* Badges Pills (EE345 style) */}
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
        <span style={{ background: "#F1F5F9", color: "#475569", fontSize: "0.65rem", fontWeight: 700, padding: "0.15rem 0.45rem", borderRadius: "3px" }}>
          NEW ARRIVAL
        </span>
        <span style={{ background: "#F1F5F9", color: "#475569", fontSize: "0.65rem", fontWeight: 700, padding: "0.15rem 0.45rem", borderRadius: "3px" }}>
          Essie's Choice
        </span>
      </div>

      {/* Stock Status */}
      <div style={{ fontSize: "0.78rem", color: isOutOfStock ? "#DC2626" : "#16A34A", fontWeight: 600, marginBottom: "0.9rem" }}>
        {isOutOfStock ? "Sold Out" : isLowStock ? `Only ${product.stock_count} Left` : "In Stock"}
      </div>

      {/* EE345 Primary Action: Add to Cart button */}
      <div style={{ marginTop: "auto" }}>
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          style={{
            width: "100%",
            background: addedAnimation ? "#10B981" : "#D1FAE5",
            color: addedAnimation ? "#FFFFFF" : "#065F46",
            border: "none",
            borderRadius: "8px",
            padding: "0.65rem 1rem",
            fontSize: "0.88rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.45rem",
            cursor: isOutOfStock ? "not-allowed" : "pointer",
            opacity: isOutOfStock ? 0.4 : 1,
            transition: "all 0.2s ease"
          }}
        >
          <ShoppingCart size={16} />
          <span>{addedAnimation ? "Added to Cart!" : "Add to Cart"}</span>
        </button>

        {/* View Details Link */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (onSelectProduct) onSelectProduct(product);
          }}
          style={{
            textAlign: "center",
            fontSize: "0.8rem",
            color: "#6B7280",
            fontWeight: 600,
            marginTop: "0.6rem",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          View Details
        </div>
      </div>

    </div>
  );
}
