import React, { useState } from "react";
import { useMarketplace } from "../context/MarketplaceContext";
import { ShoppingBag, Sparkles, Store, MapPin, Eye, Plus, Minus, Sliders, MessageCircle } from "lucide-react";

export default function ProductCard({ product, onSelectProduct, onVisitStore }) {
  const { formatPrice, addToCart, vendors, currency, toWhatsAppWaMeNumber } = useMarketplace();
  const [cardQty, setCardQty] = useState(1);

  const isLowStock = product.stock_count > 0 && product.stock_count <= 5;
  const isOutOfStock = product.stock_count <= 0;
  const hasVariations = product.variations && Object.keys(product.variations).length > 0;

  const vendorObj = vendors.find((v) => v.id === product.vendor_id);

  // Approximate USD display if KYD is primary
  const priceUSD = (product.price * 1.2).toFixed(2);

  return (
    <div className="luxury-product-card">
      
      {/* Product Image Container */}
      <div
        className="product-img-wrapper"
        onClick={() => onSelectProduct(product)}
        style={{ cursor: "pointer" }}
      >
        <img
          src={product.images[0]}
          alt={product.title}
          className="product-img"
        />

        {/* Badges Overlay */}
        <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", flexDirection: "column", gap: "0.45rem", zIndex: 2 }}>
          {product.sponsored && (
            <span className="badge badge-sponsored">
              <Sparkles size={11} /> Sponsored
            </span>
          )}

          {isOutOfStock ? (
            <span className="badge badge-out-stock">Sold Out</span>
          ) : isLowStock ? (
            <span className="badge badge-low-stock">Only {product.stock_count} Left</span>
          ) : (
            <span className="badge badge-stock">In Stock ({product.stock_count})</span>
          )}
        </div>

        {/* District Stamp */}
        {vendorObj && (
          <div style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            background: "rgba(5, 11, 20, 0.85)",
            backdropFilter: "blur(8px)",
            color: "#FFFFFF",
            fontSize: "0.74rem",
            fontWeight: 800,
            padding: "0.22rem 0.6rem",
            borderRadius: "8px",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            border: "1px solid rgba(255, 255, 255, 0.15)"
          }}>
            <MapPin size={11} color="#00E5C9" /> {vendorObj.district}
          </div>
        )}
      </div>

      {/* Details */}
      <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Stall Attribution */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (vendorObj && onVisitStore) onVisitStore(vendorObj);
          }}
          style={{
            fontSize: "0.78rem",
            color: "#00B49F",
            fontWeight: 800,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            marginBottom: "0.35rem",
            cursor: "pointer"
          }}
        >
          <Store size={13} /> {product.vendor_name}
        </div>

        {/* Title */}
        <h4
          onClick={() => onSelectProduct(product)}
          style={{
            fontSize: "1.05rem",
            fontWeight: 800,
            color: "#0A1C36",
            lineHeight: 1.35,
            marginBottom: "0.85rem",
            cursor: "pointer",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
        >
          {product.title}
        </h4>

        {/* Price & SKU */}
        <div style={{ marginTop: "auto", paddingTop: "0.6rem" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "0.95rem" }}>
            <div>
              <span style={{ fontSize: "1.3rem", fontWeight: 900, color: "#0A1C36" }}>
                {formatPrice(product.price)}
              </span>
              {currency === "KYD" && (
                <span style={{ fontSize: "0.78rem", color: "#64748B", marginLeft: "0.4rem", fontWeight: 600 }}>
                  (~${priceUSD} USD)
                </span>
              )}
            </div>
            <span style={{ fontSize: "0.74rem", color: "#94A3B8", fontFamily: "monospace", fontWeight: 600 }}>
              {product.sku}
            </span>
          </div>

          {/* Quick Quantity & Custom Options Bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem", background: "#F8FAFC", padding: "0.35rem 0.65rem", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
            <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#64748B" }}>Quantity:</span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <button
                type="button"
                disabled={cardQty <= 1 || isOutOfStock}
                onClick={(e) => {
                  e.stopPropagation();
                  setCardQty((q) => Math.max(1, q - 1));
                }}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #CBD5E1",
                  borderRadius: "6px",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: cardQty <= 1 ? "not-allowed" : "pointer",
                  color: "#475569"
                }}
              >
                <Minus size={11} />
              </button>
              <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0F172A", minWidth: "20px", textAlign: "center" }}>
                {cardQty}
              </span>
              <button
                type="button"
                disabled={cardQty >= product.stock_count || isOutOfStock}
                onClick={(e) => {
                  e.stopPropagation();
                  setCardQty((q) => Math.min(product.stock_count, q + 1));
                }}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #CBD5E1",
                  borderRadius: "6px",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: cardQty >= product.stock_count ? "not-allowed" : "pointer",
                  color: "#475569"
                }}
              >
                <Plus size={11} />
              </button>
            </div>
          </div>

          {/* Variations Notification Badge if present */}
          {hasVariations && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onSelectProduct(product);
              }}
              style={{
                fontSize: "0.73rem",
                color: "#0F766E",
                background: "#F0FDFA",
                border: "1px solid #CCFBF1",
                padding: "0.25rem 0.5rem",
                borderRadius: "8px",
                marginBottom: "0.75rem",
                textAlign: "center",
                cursor: "pointer",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.3rem"
              }}
            >
              <Sliders size={12} />
              <span>Options Available (Size/Color) • Click to Customize</span>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.55rem" }}>
            <button
              disabled={isOutOfStock}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, {}, cardQty);
              }}
              className="btn-primary"
              style={{
                padding: "0.6rem 0.75rem",
                fontSize: "0.84rem",
                borderRadius: "12px",
                opacity: isOutOfStock ? 0.4 : 1
              }}
            >
              <ShoppingBag size={15} /> Add ({cardQty})
            </button>

            <button
              disabled={isOutOfStock}
              onClick={(e) => {
                e.stopPropagation();
                const targetPhone = vendorObj?.phone
                  ? (toWhatsAppWaMeNumber ? toWhatsAppWaMeNumber(vendorObj.phone) : vendorObj.phone.replace(/\D/g, ""))
                  : "13459492299";
                const waText = encodeURIComponent(
                  `Hello ${product.vendor_name}! I would like to buy: "${product.title}" (Qty: ${cardQty}, Total: ${formatPrice(product.price * cardQty)}) on CaymanBazaar.`
                );
                window.open(`https://wa.me/${targetPhone}?text=${waText}`, "_blank");
              }}
              style={{
                background: "#25D366",
                color: "#FFFFFF",
                border: "none",
                fontWeight: 800,
                padding: "0.6rem 0.75rem",
                fontSize: "0.84rem",
                borderRadius: "12px",
                cursor: isOutOfStock ? "not-allowed" : "pointer",
                opacity: isOutOfStock ? 0.4 : 1,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.35rem",
                boxShadow: "0 2px 8px rgba(37, 211, 102, 0.25)"
              }}
              title="Order this item directly on WhatsApp"
            >
              <MessageCircle size={15} /> WhatsApp
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
