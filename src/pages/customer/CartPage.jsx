import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import {
  Trash2,
  Heart,
  Plus,
  Minus,
  Truck,
  ArrowRight,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";

export default function CartPage({ setActiveTab, setSelectedProduct }) {
  const { cart, updateCartQty, removeFromCart, addToCart, showToast } = useMarketplace();

  // Saved for Later state (synced with localStorage)
  const [savedForLater, setSavedForLater] = useState(() => {
    try {
      const saved = localStorage.getItem("cb_saved_for_later");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const saveForLaterItem = (item, index) => {
    const updatedSaved = [...savedForLater, item];
    setSavedForLater(updatedSaved);
    try {
      localStorage.setItem("cb_saved_for_later", JSON.stringify(updatedSaved));
    } catch (e) {}
    removeFromCart(index);
    if (showToast) showToast(`Saved "${item.product.title}" for later!`);
  };

  const moveToCartFromSaved = (savedItem, index) => {
    addToCart(savedItem.product, savedItem.variations || {}, savedItem.qty || 1);
    const updatedSaved = savedForLater.filter((_, i) => i !== index);
    setSavedForLater(updatedSaved);
    try {
      localStorage.setItem("cb_saved_for_later", JSON.stringify(updatedSaved));
    } catch (e) {}
    if (showToast) showToast(`Moved "${savedItem.product.title}" back to cart!`);
  };

  const removeSavedItem = (index) => {
    const updatedSaved = savedForLater.filter((_, i) => i !== index);
    setSavedForLater(updatedSaved);
    try {
      localStorage.setItem("cb_saved_for_later", JSON.stringify(updatedSaved));
    } catch (e) {}
    if (showToast) showToast("Removed from saved items.");
  };

  // Calculate cart totals
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.qty, 0);
  const freeDeliveryThreshold = 50.0;
  const qualifiesForFreeDelivery = subtotal >= freeDeliveryThreshold;
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div style={{ background: "#F8FAFC", minHeight: "85vh", padding: "2.5rem 0 5rem" }}>
      <div className="container" style={{ maxWidth: "1180px", margin: "0 auto", padding: "0 1.25rem" }}>
        
        {/* Page Title */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
          <h1 style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "#111827",
            letterSpacing: "-0.02em",
            margin: 0
          }}>
            Shopping Cart
          </h1>

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
              gap: "0.35rem"
            }}
          >
            <ArrowLeft size={16} /> Continue Shopping
          </button>
        </div>

        {/* Empty Cart State */}
        {cart.length === 0 ? (
          <div style={{
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "16px",
            padding: "4rem 2rem",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
          }}>
            <div style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "#F1F5F9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
              color: "#94A3B8"
            }}>
              <ShoppingBag size={34} strokeWidth={1.5} />
            </div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#1E293B", marginBottom: "0.5rem" }}>
              Your Shopping Cart is Empty
            </h2>
            <p style={{ color: "#64748B", fontSize: "0.92rem", maxWidth: "420px", margin: "0 auto 1.75rem" }}>
              Looks like you haven't added any products yet. Browse Grand Cayman local finds, gourmet treats, and rum specialties!
            </p>
            <button
              onClick={() => setActiveTab("categories")}
              style={{
                background: "#0F172A",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "999px",
                padding: "0.75rem 1.75rem",
                fontSize: "0.92rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(15, 23, 42, 0.2)"
              }}
            >
              Explore Products
            </button>
          </div>
        ) : (
          /* Main 2-Column Layout matching EE345 */
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: "2rem",
            alignItems: "flex-start"
          }}>
            
            {/* Left Column: Cart Items List */}
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {cart.map((item, index) => {
                  const sku = item.product.sku || `EE345-${item.product.id.slice(0, 4).toUpperCase()}-${item.product.category_id || "GEN"}-${index + 100}`;
                  const unitPrice = item.product.price;
                  const itemTotal = unitPrice * item.qty;

                  return (
                    <div
                      key={`${item.product.id}-${index}`}
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid #E5E7EB",
                        borderRadius: "14px",
                        padding: "1.25rem 1.5rem",
                        display: "flex",
                        gap: "1.25rem",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                        transition: "box-shadow 0.2s ease"
                      }}
                    >
                      {/* Product Thumbnail */}
                      <div
                        onClick={() => {
                          if (setSelectedProduct) setSelectedProduct(item.product);
                          setActiveTab("product-detail");
                        }}
                        style={{
                          width: "90px",
                          height: "90px",
                          borderRadius: "12px",
                          overflow: "hidden",
                          background: "#F8FAFC",
                          border: "1px solid #E2E8F0",
                          flexShrink: 0,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <img
                          src={item.product.image || item.product.image_url}
                          alt={item.product.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                          }}
                        />
                      </div>

                      {/* Product Details & Actions */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Title */}
                        <div
                          onClick={() => {
                            if (setSelectedProduct) setSelectedProduct(item.product);
                            setActiveTab("product-detail");
                          }}
                          style={{
                            fontWeight: 700,
                            fontSize: "0.96rem",
                            color: "#0F172A",
                            lineHeight: 1.35,
                            cursor: "pointer"
                          }}
                        >
                          {item.product.title}
                        </div>

                        {/* SKU */}
                        <div style={{
                          fontSize: "0.72rem",
                          color: "#6B7280",
                          fontWeight: 500,
                          marginTop: "0.25rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.03em"
                        }}>
                          SKU {sku}
                        </div>

                        {/* Unit Price */}
                        <div style={{
                          fontSize: "0.95rem",
                          fontWeight: 800,
                          color: "#111827",
                          marginTop: "0.35rem",
                          marginBottom: "0.85rem"
                        }}>
                          CI${unitPrice.toFixed(2)}
                        </div>

                        {/* Bottom Row: Quantity Stepper, Line Total, and Save/Remove links */}
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: "0.85rem",
                          borderTop: "1px solid #F1F5F9",
                          paddingTop: "0.75rem"
                        }}>
                          
                          {/* Stepper & Line Total */}
                          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            {/* Stepper [ - ] qty [ + ] */}
                            <div style={{
                              display: "inline-flex",
                              alignItems: "center",
                              border: "1px solid #D1D5DB",
                              borderRadius: "6px",
                              background: "#FFFFFF",
                              padding: "0.15rem 0.45rem"
                            }}>
                              <button
                                type="button"
                                onClick={() => updateCartQty(index, -1)}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "#4B5563",
                                  cursor: "pointer",
                                  padding: "0.25rem 0.45rem",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.95rem",
                                  fontWeight: 700
                                }}
                                aria-label="Decrease quantity"
                              >
                                <Minus size={13} />
                              </button>

                              <span style={{
                                minWidth: "24px",
                                textAlign: "center",
                                fontSize: "0.88rem",
                                fontWeight: 700,
                                color: "#111827"
                              }}>
                                {item.qty}
                              </span>

                              <button
                                type="button"
                                onClick={() => updateCartQty(index, 1)}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "#4B5563",
                                  cursor: "pointer",
                                  padding: "0.25rem 0.45rem",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.95rem",
                                  fontWeight: 700
                                }}
                                aria-label="Increase quantity"
                              >
                                <Plus size={13} />
                              </button>
                            </div>

                            {/* Line Total */}
                            <div style={{
                              fontSize: "0.95rem",
                              fontWeight: 800,
                              color: "#111827"
                            }}>
                              CI${itemTotal.toFixed(2)}
                            </div>
                          </div>

                          {/* Action Links: Save for Later & Remove */}
                          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                            <button
                              type="button"
                              onClick={() => saveForLaterItem(item, index)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#4B5563",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                cursor: "pointer",
                                padding: 0
                              }}
                            >
                              <Heart size={14} color="#6B7280" />
                              <span>Save for Later</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => removeFromCart(index)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#6B7280",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                cursor: "pointer",
                                padding: 0
                              }}
                            >
                              <Trash2 size={14} color="#6B7280" />
                              <span>Remove</span>
                            </button>
                          </div>

                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Saved for Later Section (Matching EE345 Feature) */}
              {savedForLater.length > 0 && (
                <div style={{ marginTop: "2.5rem" }}>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#111827", marginBottom: "1rem" }}>
                    Saved for Later ({savedForLater.length} {savedForLater.length === 1 ? "item" : "items"})
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                    {savedForLater.map((savedItem, sIdx) => (
                      <div
                        key={`saved-${sIdx}`}
                        style={{
                          background: "#FFFFFF",
                          border: "1px solid #E5E7EB",
                          borderRadius: "12px",
                          padding: "1rem 1.25rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "1rem"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <img
                            src={savedItem.product.image || savedItem.product.image_url}
                            alt={savedItem.product.title}
                            style={{ width: "56px", height: "56px", borderRadius: "8px", objectFit: "cover" }}
                          />
                          <div>
                            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0F172A" }}>
                              {savedItem.product.title}
                            </div>
                            <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#111827", marginTop: "0.2rem" }}>
                              CI${savedItem.product.price.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <button
                            onClick={() => moveToCartFromSaved(savedItem, sIdx)}
                            style={{
                              background: "#D1FAE5",
                              color: "#065F46",
                              border: "none",
                              borderRadius: "6px",
                              padding: "0.45rem 0.85rem",
                              fontSize: "0.82rem",
                              fontWeight: 700,
                              cursor: "pointer"
                            }}
                          >
                            Move to Cart
                          </button>
                          <button
                            onClick={() => removeSavedItem(sIdx)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#94A3B8",
                              cursor: "pointer",
                              padding: "0.3rem"
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary (Sticky card matching EE345) */}
            <div style={{ position: "sticky", top: "100px" }}>
              <div style={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "16px",
                padding: "1.5rem",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
              }}>
                
                {/* Free Delivery Banner (EE345 style) */}
                <div style={{
                  background: "#F0FDF4",
                  border: "1px solid #BBF7D0",
                  borderRadius: "12px",
                  padding: "0.85rem 1rem",
                  marginBottom: "1.25rem"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <Truck size={17} color="#16A34A" />
                    <span style={{
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: "#166534"
                    }}>
                      {qualifiesForFreeDelivery
                        ? "Your order qualifies for free delivery"
                        : `Add CI$${(freeDeliveryThreshold - subtotal).toFixed(2)} more for free delivery`}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{
                    width: "100%",
                    height: "6px",
                    background: "#DCFCE7",
                    borderRadius: "999px",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      width: `${progressPercent}%`,
                      height: "100%",
                      background: "#16A34A",
                      borderRadius: "999px",
                      transition: "width 0.3s ease"
                    }} />
                  </div>

                  <div style={{
                    fontSize: "0.72rem",
                    color: "#4B5563",
                    marginTop: "0.45rem",
                    lineHeight: 1.35
                  }}>
                    Free delivery on orders of CI$50.00 or more. Pickup is always free.
                  </div>
                </div>

                {/* Subtotal */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.92rem",
                  color: "#4B5563",
                  marginBottom: "0.85rem"
                }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 700, color: "#111827" }}>
                    CI${subtotal.toFixed(2)}
                  </span>
                </div>

                <hr style={{ border: "none", borderTop: "1px solid #E5E7EB", margin: "1rem 0" }} />

                {/* Total */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.25rem"
                }}>
                  <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827" }}>
                    Total
                  </span>
                  <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#111827" }}>
                    CI${subtotal.toFixed(2)}
                  </span>
                </div>

                {/* Primary Button: CHECKOUT & PAY ONLINE (EE345 style) */}
                <button
                  type="button"
                  onClick={() => setActiveTab("checkout")}
                  style={{
                    width: "100%",
                    background: "#D1FAE5",
                    color: "#065F46",
                    border: "none",
                    borderRadius: "10px",
                    padding: "0.9rem 1.25rem",
                    fontSize: "0.88rem",
                    fontWeight: 800,
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#A7F3D0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#D1FAE5";
                  }}
                >
                  CHECKOUT & PAY ONLINE
                </button>

                {/* Secondary Button: Continue Shopping */}
                <button
                  type="button"
                  onClick={() => setActiveTab("categories")}
                  style={{
                    width: "100%",
                    background: "#FFFFFF",
                    color: "#374151",
                    border: "1px solid #D1D5DB",
                    borderRadius: "10px",
                    padding: "0.75rem 1.25rem",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    marginTop: "0.65rem",
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#F9FAFB";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#FFFFFF";
                  }}
                >
                  Continue Shopping
                </button>

                {/* Pickup / Delivery Note */}
                <p style={{
                  fontSize: "0.76rem",
                  color: "#6B7280",
                  textAlign: "center",
                  lineHeight: 1.4,
                  marginTop: "0.85rem",
                  marginBottom: 0
                }}>
                  Choose pickup or delivery at checkout and pay securely online.
                </p>

                {/* Need help with your cart? Box (EE345 style) */}
                <div style={{
                  background: "#F8FAFC",
                  border: "1px solid #F1F5F9",
                  borderRadius: "10px",
                  padding: "0.85rem 1rem",
                  marginTop: "1.25rem"
                }}>
                  <div style={{
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "0.3rem"
                  }}>
                    Need help with your cart?
                  </div>
                  <a
                    href="https://wa.me/13459492299?text=Hello%20CaymanBazaar%2C%20I%20need%20help%20with%20my%20shopping%20cart."
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      color: "#0284C7",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      textDecoration: "none"
                    }}
                  >
                    <MessageCircle size={15} color="#25D366" />
                    <span>Chat with us</span>
                  </a>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
