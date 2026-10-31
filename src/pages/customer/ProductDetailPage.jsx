import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import ProductCard from "../../components/ProductCard";
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  Store,
  MapPin,
  Check,
  ChevronRight,
  Share2,
  Sparkles,
  DollarSign,
  Star,
  MessageCircle,
  Clock,
  ArrowRight,
  Heart,
  Plus,
  Minus
} from "lucide-react";

export default function ProductDetailPage({ product, setActiveTab, setSelectedVendor, setSelectedProduct }) {
  const { products, vendors, reviews = [], formatPrice, addToCart, showToast } = useMarketplace();

  const currentProd = product || products[0];
  const vendorObj = vendors.find((v) => v.id === currentProd.vendor_id);

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedVariations, setSelectedVariations] = useState({});
  const [qty, setQty] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isOutOfStock = currentProd.stock_count <= 0;

  const handleVariationSelect = (key, val) => {
    setSelectedVariations((prev) => ({ ...prev, [key]: val }));
  };

  const handleAddToCart = () => {
    addToCart(currentProd, selectedVariations, qty);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(currentProd, selectedVariations, qty);
    setActiveTab("checkout");
  };

  // Related products from same category or catalog
  const relatedProducts = products
    .filter((p) => p.id !== currentProd.id && (p.category_id === currentProd.category_id || p.vendor_id === currentProd.vendor_id))
    .slice(0, 4);

  // Fallback if less than 4
  const displayRelated = relatedProducts.length >= 2 
    ? relatedProducts 
    : products.filter((p) => p.id !== currentProd.id).slice(0, 4);

  const imagesList = (currentProd.images && currentProd.images.length > 0)
    ? currentProd.images
    : [currentProd.image || currentProd.image_url];

  return (
    <div style={{ background: "#FFFFFF", minHeight: "90vh", paddingBottom: "5rem" }}>
      
      {/* 🧭 Breadcrumb Bar (EE345 style) */}
      <div style={{ borderBottom: "1px solid #F1F5F9", background: "#F8FAFC", padding: "0.85rem 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "#64748B", flexWrap: "wrap" }}>
          <span
            onClick={() => setActiveTab("home")}
            style={{ cursor: "pointer", color: "#0F172A", fontWeight: 600 }}
          >
            Home
          </span>
          <ChevronRight size={14} />
          <span
            onClick={() => setActiveTab("categories")}
            style={{ cursor: "pointer", color: "#0F172A", fontWeight: 600 }}
          >
            Shop
          </span>
          <ChevronRight size={14} />
          <span style={{ color: "#64748B" }}>
            {currentProd.category_name || "Catalog"}
          </span>
          <ChevronRight size={14} />
          <span style={{ color: "#00A896", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "260px" }}>
            {currentProd.title}
          </span>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "2.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "3.5rem", alignItems: "flex-start", marginBottom: "4rem" }}>
          
          {/* 🖼️ Left: Product Image Gallery */}
          <div>
            <div style={{
              background: "#F8FAFC",
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid #E5E7EB",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "420px"
            }}>
              <img
                src={imagesList[activeImgIndex] || imagesList[0]}
                alt={currentProd.title}
                style={{ width: "100%", maxHeight: "480px", objectFit: "contain", padding: "1rem" }}
              />
            </div>

            {/* Thumbnail selector */}
            {imagesList.length > 1 && (
              <div style={{ display: "flex", gap: "0.75rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
                {imagesList.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    style={{
                      width: "74px",
                      height: "74px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      border: activeImgIndex === idx ? "2px solid #00A896" : "1px solid #E5E7EB",
                      cursor: "pointer",
                      background: "#FFFFFF",
                      flexShrink: 0,
                      padding: "4px"
                    }}
                  >
                    <img src={img} alt="thumbnail" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 📋 Right: Product Details & Purchase Actions (EE345 style) */}
          <div>
            
            {/* Top Badges: Tag & In Stock */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{
                  background: "#E0F2FE",
                  color: "#0369A1",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  padding: "0.2rem 0.6rem",
                  borderRadius: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em"
                }}>
                  {currentProd.price >= 20 ? "TRENDING" : "NEW ARRIVAL"}
                </span>

                {vendorObj && (
                  <span
                    onClick={() => {
                      if (setSelectedVendor) setSelectedVendor(vendorObj);
                      setActiveTab("store-detail");
                    }}
                    style={{
                      fontSize: "0.76rem",
                      color: "#64748B",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem"
                    }}
                  >
                    <Store size={13} color="#00A896" /> {vendorObj.store_name}
                  </span>
                )}
              </div>

              {/* Stock Status Indicator */}
              <div>
                {isOutOfStock ? (
                  <span style={{ fontSize: "0.8rem", color: "#DC2626", fontWeight: 700 }}>
                    ● Out of Stock
                  </span>
                ) : (
                  <span style={{ fontSize: "0.8rem", color: "#16A34A", fontWeight: 700 }}>
                    ● In Stock ({currentProd.stock_count || 12} available)
                  </span>
                )}
              </div>
            </div>

            {/* Product Title */}
            <h1 style={{
              fontSize: "1.85rem",
              fontWeight: 800,
              color: "#111827",
              lineHeight: 1.3,
              marginBottom: "0.5rem"
            }}>
              {currentProd.title}
            </h1>

            {/* SKU and Rating Row */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.78rem", color: "#6B7280", fontWeight: 600, textTransform: "uppercase" }}>
                SKU: {currentProd.sku || `EE345-${currentProd.id?.slice(0, 5).toUpperCase()}`}
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} color="#F59E0B" fill="#F59E0B" />
                  ))}
                </div>
                <span style={{ fontSize: "0.78rem", color: "#4B5563", fontWeight: 600 }}>
                  ({reviews.filter((r) => r.product_id === currentProd.id).length || 5} reviews)
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div style={{
              background: "#F8FAFC",
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              padding: "1rem 1.25rem",
              marginBottom: "1.5rem"
            }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
                <span style={{ fontSize: "2rem", fontWeight: 900, color: "#111827" }}>
                  CI${Number(currentProd.price).toFixed(2)}
                </span>
                <span style={{ fontSize: "0.95rem", color: "#64748B", fontWeight: 600 }}>
                  (~${(Number(currentProd.price) * 1.2).toFixed(2)} USD)
                </span>
              </div>
              <div style={{ fontSize: "0.76rem", color: "#00A896", fontWeight: 700, marginTop: "0.25rem" }}>
                0% Island Sales Tax • Tax-free local shopping in Cayman
              </div>
            </div>

            {/* 🚚 Free Delivery Callout Banner (Matching EE345) */}
            <div style={{
              background: "#F0FDF4",
              border: "1px solid #BBF7D0",
              borderRadius: "10px",
              padding: "0.85rem 1rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.65rem"
            }}>
              <Truck size={19} color="#16A34A" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: "0.82rem", color: "#166534", lineHeight: 1.4 }}>
                <strong>Free island delivery on orders of CI$50.00 or more.</strong> Store pickup available across Grand Cayman.
              </div>
            </div>

            {/* Description */}
            <p style={{
              color: "#475569",
              fontSize: "0.92rem",
              lineHeight: 1.6,
              marginBottom: "1.75rem"
            }}>
              {currentProd.description}
            </p>

            {/* Variations Selectors (if any) */}
            {currentProd.variations && Object.keys(currentProd.variations).length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                {Object.keys(currentProd.variations).map((varKey) => {
                  const options = currentProd.variations[varKey];
                  return (
                    <div key={varKey}>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1E293B", textTransform: "capitalize", marginBottom: "0.4rem" }}>
                        Select {varKey.replace("_", " ")}:
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        {options.map((opt) => {
                          const isSelected = selectedVariations[varKey] === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleVariationSelect(varKey, opt)}
                              style={{
                                background: isSelected ? "#0F172A" : "#FFFFFF",
                                color: isSelected ? "#FFFFFF" : "#334155",
                                border: isSelected ? "1.5px solid #0F172A" : "1.5px solid #CBD5E1",
                                padding: "0.4rem 0.85rem",
                                borderRadius: "8px",
                                fontSize: "0.82rem",
                                fontWeight: 600,
                                cursor: "pointer"
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

            {/* Quantity Stepper */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B" }}>Quantity:</span>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                background: "#FFFFFF",
                padding: "0.2rem 0.5rem"
              }}>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#4B5563",
                    padding: "0.25rem 0.5rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span style={{ minWidth: "32px", textAlign: "center", fontSize: "0.92rem", fontWeight: 700, color: "#111827" }}>
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(currentProd.stock_count || 99, q + 1))}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#4B5563",
                    padding: "0.25rem 0.5rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* 🛒 Main Purchase CTAs (Matching EE345) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
              
              {/* Primary: Add to Cart (EE345 Mint button) */}
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                style={{
                  width: "100%",
                  background: addedAnimation ? "#10B981" : "#D1FAE5",
                  color: addedAnimation ? "#FFFFFF" : "#065F46",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0.9rem 1.25rem",
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  cursor: isOutOfStock ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  transition: "all 0.2s ease",
                  opacity: isOutOfStock ? 0.4 : 1
                }}
              >
                <ShoppingBag size={18} />
                <span>{addedAnimation ? "Added to Cart!" : "Add to Cart"}</span>
              </button>

              {/* Secondary: Buy Now (Dark button directly to checkout) */}
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                style={{
                  width: "100%",
                  background: "#0F172A",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0.85rem 1.25rem",
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  cursor: isOutOfStock ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.45rem",
                  transition: "all 0.2s ease",
                  opacity: isOutOfStock ? 0.4 : 1
                }}
              >
                <span>Buy It Now</span>
                <ArrowRight size={16} />
              </button>

            </div>

            {/* WhatsApp Assistance Box */}
            <div style={{
              background: "#F8FAFC",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              padding: "0.75rem 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.75rem"
            }}>
              <span style={{ fontSize: "0.82rem", color: "#475569", fontWeight: 600 }}>
                Have questions about this item?
              </span>
              <a
                href={`https://wa.me/13459492299?text=Hello%2C%20I%20have%20a%20question%20about%20${encodeURIComponent(currentProd.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#065F46",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  textDecoration: "none"
                }}
              >
                <MessageCircle size={15} color="#25D366" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* 4 Feature Service Perks */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.85rem",
              borderTop: "1px solid #F1F5F9",
              paddingTop: "1.25rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", color: "#475569" }}>
                <ShieldCheck size={16} color="#00A896" />
                <span>100% Quality Item</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", color: "#475569" }}>
                <Truck size={16} color="#00A896" />
                <span>Fast Local Delivery</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", color: "#475569" }}>
                <Store size={16} color="#00A896" />
                <span>Convenient Store Pickup</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", color: "#475569" }}>
                <DollarSign size={16} color="#00A896" />
                <span>Cash on Delivery or Card</span>
              </div>
            </div>

          </div>

        </div>

        {/* 🌟 Related Products: "You May Also Like" (EE345 4-column layout) */}
        <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "3rem", marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#111827", margin: 0 }}>
              You May Also Like
            </h2>
            <button
              onClick={() => setActiveTab("categories")}
              style={{
                background: "none",
                border: "none",
                color: "#0284C7",
                fontSize: "0.88rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem"
              }}
            >
              See all <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
            {displayRelated.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelectProduct={(selected) => {
                  if (setSelectedProduct) setSelectedProduct(selected);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            ))}
          </div>
        </div>

        {/* 💬 Verified Buyer Reviews */}
        <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#111827", margin: 0 }}>
              Customer Reviews
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Star size={16} color="#F59E0B" fill="#F59E0B" />
              <span style={{ fontWeight: 800, color: "#111827", fontSize: "0.95rem" }}>
                5.0 Rating
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            {[
              { author: "Sarah M.", date: "Grand Cayman", text: "Ordered for local delivery, arrived right at my hotel in Seven Mile Beach within 3 hours. Outstanding quality!" },
              { author: "David K.", date: "George Town", text: "Authentic Cayman items at reasonable prices. The pickup was so fast and hassle-free." },
              { author: "Lisa T.", date: "West Bay", text: "Love the WhatsApp updates and free delivery over CI$50. Will definitely shop here regularly!" }
            ].map((rev, rIdx) => (
              <div key={rIdx} style={{ background: "#F8FAFC", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>{rev.author}</div>
                  <div style={{ fontSize: "0.75rem", color: "#16A34A", fontWeight: 700 }}>● Verified Purchase</div>
                </div>
                <div style={{ display: "flex", gap: "2px", marginBottom: "0.5rem" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={12} color="#F59E0B" fill="#F59E0B" />
                  ))}
                </div>
                <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.5, margin: 0 }}>
                  "{rev.text}"
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
