import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import {
  ShoppingBag,
  Clock,
  ShieldCheck,
  Store,
  MapPin,
  Check,
  ChevronLeft,
  Share2,
  Sparkles,
  DollarSign,
  Star
} from "lucide-react";

export default function ProductDetailPage({ product, setActiveTab, setSelectedVendor }) {
  const { products, vendors, reviews = [], formatPrice, addToCart } = useMarketplace();

  const currentProd = product || products[0];
  const vendorObj = vendors.find((v) => v.id === currentProd.vendor_id);

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedVariations, setSelectedVariations] = useState({});
  const [qty, setQty] = useState(1);

  const isOutOfStock = currentProd.stock_count <= 0;

  const handleVariationSelect = (key, val) => {
    setSelectedVariations((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem", paddingBottom: "5rem" }}>
      
      {/* Back button */}
      <button
        onClick={() => setActiveTab("categories")}
        style={{
          background: "transparent",
          color: "#64748B",
          fontWeight: 600,
          fontSize: "0.9rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.3rem",
          marginBottom: "1.5rem"
        }}
      >
        <ChevronLeft size={18} /> Back to Catalog
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3rem", alignItems: "flex-start" }}>
        
        {/* Left: Product Image Gallery */}
        <div>
          <div style={{ background: "#F1F5F9", borderRadius: "20px", overflow: "hidden", border: "1px solid #E2E8F0", marginBottom: "1rem" }}>
            <img
              src={currentProd.images[activeImgIndex] || currentProd.images[0]}
              alt={currentProd.title}
              style={{ width: "100%", height: "420px", objectFit: "cover" }}
            />
          </div>

          {/* Thumbnails */}
          {currentProd.images.length > 1 && (
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {currentProd.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: activeImgIndex === idx ? "2.5px solid #00A896" : "1px solid #E2E8F0",
                    cursor: "pointer"
                  }}
                >
                  <img src={img} alt="thumb" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Controls */}
        <div>
          
          {/* Vendor Badge */}
          <div
            onClick={() => {
              if (vendorObj && setSelectedVendor) {
                setSelectedVendor(vendorObj);
                setActiveTab("store-detail");
              }
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "#E0F2FE",
              color: "#0284C7",
              padding: "0.3rem 0.8rem",
              borderRadius: "20px",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              marginBottom: "0.8rem"
            }}
          >
            <Store size={14} /> Sold by {currentProd.vendor_name} ({vendorObj?.district})
          </div>

          <h1 style={{ fontSize: "2rem", color: "#0F172A", lineHeight: 1.25, marginBottom: "0.75rem" }}>
            {currentProd.title}
          </h1>

          {/* Price & SKU */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "1.2rem" }}>
            <span style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0F172A" }}>
              {formatPrice(currentProd.price)}
            </span>

            <span style={{ fontSize: "0.85rem", color: "#64748B", fontWeight: 600 }}>
              SKU: {currentProd.sku}
            </span>
          </div>

          {/* Stock Indicator */}
          <div style={{ marginBottom: "1.5rem" }}>
            {isOutOfStock ? (
              <span className="badge badge-out-stock" style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}>
                Out of Stock
              </span>
            ) : currentProd.stock_count <= 5 ? (
              <span className="badge badge-low-stock" style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}>
                Low Stock: Only {currentProd.stock_count} units left in store
              </span>
            ) : (
              <span className="badge badge-stock" style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}>
                In Stock ({currentProd.stock_count} available)
              </span>
            )}
          </div>

          <p style={{ color: "#334155", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.8rem" }}>
            {currentProd.description}
          </p>

          {/* Variations Selectors (JSON Driven) */}
          {currentProd.variations && Object.keys(currentProd.variations).length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginBottom: "1.8rem" }}>
              {Object.keys(currentProd.variations).map((varKey) => {
                const options = currentProd.variations[varKey];
                return (
                  <div key={varKey}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", textTransform: "capitalize", marginBottom: "0.5rem" }}>
                      Select {varKey.replace("_", " ")}:
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {options.map((opt) => {
                        const isSelected = selectedVariations[varKey] === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => handleVariationSelect(varKey, opt)}
                            style={{
                              background: isSelected ? "#00A896" : "#FFFFFF",
                              color: isSelected ? "#FFFFFF" : "#334155",
                              border: isSelected ? "1.5px solid #00A896" : "1.5px solid #CBD5E1",
                              padding: "0.4rem 0.9rem",
                              borderRadius: "10px",
                              fontSize: "0.85rem",
                              fontWeight: 600
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quantity Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0F172A" }}>Quantity:</span>
            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #CBD5E1", borderRadius: "10px", overflow: "hidden" }}>
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                style={{ padding: "0.5rem 0.9rem", background: "#F8FAFC", fontSize: "1rem", fontWeight: 700 }}
              >
                -
              </button>
              <span style={{ padding: "0.5rem 1rem", fontSize: "0.95rem", fontWeight: 700, minWidth: "40px", textAlign: "center" }}>
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(currentProd.stock_count, q + 1))}
                style={{ padding: "0.5rem 0.9rem", background: "#F8FAFC", fontSize: "1rem", fontWeight: 700 }}
              >
                +
              </button>
            </div>
          </div>

          {/* Purchase Actions */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
            <button
              disabled={isOutOfStock}
              onClick={() => addToCart(currentProd, selectedVariations, qty)}
              className="btn-primary"
              style={{ flex: 1, padding: "0.9rem 1.2rem", fontSize: "1rem", opacity: isOutOfStock ? 0.5 : 1 }}
            >
              <ShoppingBag size={20} /> Add to Bag
            </button>

            <button
              disabled={isOutOfStock}
              onClick={() => {
                addToCart(currentProd, selectedVariations, qty);
                setActiveTab("checkout");
              }}
              className="btn-gold"
              style={{ flex: 1, padding: "0.9rem 1.2rem", fontSize: "1rem", opacity: isOutOfStock ? 0.5 : 1 }}
            >
              <Clock size={20} /> Reserve for Pickup
            </button>
          </div>

          {/* Pickup & COD Information Box */}
          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", padding: "1.25rem", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", gap: "0.6rem", fontSize: "0.85rem", color: "#334155" }}>
              <MapPin size={18} color="#00A896" style={{ flexShrink: 0 }} />
              <span><strong>Pickup Location:</strong> {vendorObj?.address || `${vendorObj?.district || "Georgetown"}, Grand Cayman`}</span>
            </div>
            <div style={{ display: "flex", gap: "0.6rem", fontSize: "0.85rem", color: "#334155" }}>
              <ShieldCheck size={18} color="#E5A93C" style={{ flexShrink: 0 }} />
              <span><strong>4-Digit PIN Hold:</strong> Reserved for 24-48 hours upon ordering.</span>
            </div>
            <div style={{ display: "flex", gap: "0.6rem", fontSize: "0.85rem", color: "#334155" }}>
              <DollarSign size={18} color="#0284C7" style={{ flexShrink: 0 }} />
              <span><strong>COD Delivery:</strong> Courier cash payment supported across Grand Cayman.</span>
            </div>
          </div>

        </div>

      </div>

      {/* Verified Customer Reviews Section */}
      <div style={{ marginTop: "4rem", paddingTop: "2.5rem", borderTop: "1px solid #E2E8F0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#0D9488", fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase" }}>
              <ShieldCheck size={15} /> Authenticated Feedback
            </div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0F172A", margin: "0.3rem 0 0" }}>
              Verified Buyer Reviews
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", padding: "0.6rem 1.25rem", borderRadius: "16px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Star size={22} color="#D97706" fill="#D97706" />
              <span style={{ fontSize: "1.4rem", fontWeight: 900, color: "#92400E" }}>
                {Number(currentProd.rating || 5.0).toFixed(1)}
              </span>
              <span style={{ fontSize: "0.85rem", color: "#B45309", fontWeight: 700 }}>
                ({reviews.filter((r) => r.product_id === currentProd.id).length} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {(() => {
          const prodReviews = reviews.filter((r) => r.product_id === currentProd.id && r.status !== "hidden");
          if (prodReviews.length === 0) {
            return (
              <div style={{ background: "#F8FAFC", border: "1px dashed #CBD5E1", borderRadius: "20px", padding: "3rem 2rem", textAlign: "center" }}>
                <Star size={36} color="#94A3B8" style={{ margin: "0 auto 0.75rem", opacity: 0.5 }} />
                <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#334155", margin: 0 }}>
                  Be the first to rate this island creation!
                </h4>
                <p style={{ color: "#64748B", fontSize: "0.88rem", marginTop: "0.35rem" }}>
                  Place a 48H hold or order for island delivery to share your verified review.
                </p>
              </div>
            );
          }

          return (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {prodReviews.map((rev) => (
                <div
                  key={rev.id}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: "18px",
                    padding: "1.5rem",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                      <div>
                        <div style={{ fontWeight: 800, color: "#0F172A", fontSize: "1rem" }}>{rev.author}</div>
                        {rev.verified_purchase && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "#166534", fontSize: "0.72rem", fontWeight: 700 }}>
                            <ShieldCheck size={12} /> Verified Buyer
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: "2px" }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={14}
                            color={s <= rev.rating ? "#F59E0B" : "#E2E8F0"}
                            fill={s <= rev.rating ? "#F59E0B" : "transparent"}
                          />
                        ))}
                      </div>
                    </div>

                    <p style={{ color: "#334155", fontSize: "0.92rem", lineHeight: 1.55, margin: "0 0 1rem" }}>
                      "{rev.comment}"
                    </p>
                  </div>

                  {/* Vendor Reply if present */}
                  {rev.vendor_reply && (
                    <div
                      style={{
                        background: "#F0FDFA",
                        border: "1px solid #CCFBF1",
                        borderRadius: "12px",
                        padding: "0.85rem 1rem",
                        marginTop: "0.5rem"
                      }}
                    >
                      <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#0F766E", textTransform: "uppercase", marginBottom: "0.2rem" }}>
                        Response from Stall Owner:
                      </div>
                      <div style={{ fontSize: "0.86rem", color: "#134E4A", fontStyle: "italic" }}>
                        "{rev.vendor_reply.text}"
                      </div>
                    </div>
                  )}

                  <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "1rem", textAlign: "right" }}>
                    {new Date(rev.created_at || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

    </div>
  );
}

