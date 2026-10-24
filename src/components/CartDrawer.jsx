import React, { useState } from "react";
import { useMarketplace } from "../context/MarketplaceContext";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Clock, Store, CheckCircle2, User } from "lucide-react";
import CheckoutAuthModal from "./CheckoutAuthModal";

export default function CartDrawer({ isOpen, onClose, onProceedCheckout }) {
  const { cart, updateCartQty, removeFromCart, formatPrice, vendors, customerPhoneSession, customerProfile } = useMarketplace();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (!isOpen) return null;

  const totalAmountKYD = cart.reduce((acc, item) => acc + item.product.price * item.qty, 0);

  // Group items by vendor
  const groupedByVendor = {};
  cart.forEach((item) => {
    const vId = item.product.vendor_id;
    if (!groupedByVendor[vId]) groupedByVendor[vId] = [];
    groupedByVendor[vId].push(item);
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "flex-end"
      }}
      onClick={onClose}
    >
      <div
        className="slide-in-right"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "460px",
          height: "100%",
          background: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-10px 0 30px rgba(0,0,0,0.15)"
        }}
      >
        {/* Header */}
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F8FAFC" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <ShoppingBag size={20} color="#00A896" />
            <h3 style={{ fontSize: "1.1rem", color: "#0F172A" }}>Your Island Shopping Bag</h3>
            <span style={{ background: "#E0F2FE", color: "#0284C7", fontSize: "0.78rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "10px" }}>
              {cart.reduce((a, b) => a + b.qty, 0)} items
            </span>
          </div>
          <button onClick={onClose} style={{ background: "transparent", color: "#64748B", padding: "0.4rem", borderRadius: "50%", cursor: "pointer", border: "none" }}>
            <X size={20} />
          </button>
        </div>

        {/* Cart Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 1rem", color: "#94A3B8" }}>
              <ShoppingBag size={54} strokeWidth={1} style={{ marginBottom: "1rem", color: "#CBD5E1" }} />
              <h4 style={{ color: "#475569", marginBottom: "0.5rem" }}>Your Bag is Empty</h4>
              <p style={{ fontSize: "0.88rem" }}>Browse local Cayman stores and reserve items for store pickup or Cash on Delivery!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {Object.keys(groupedByVendor).map((vendorId) => {
                const vendorObj = vendors.find((v) => v.id === vendorId);
                const itemsList = groupedByVendor[vendorId];

                return (
                  <div key={vendorId} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "1rem" }}>
                    {/* Vendor Header */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.85rem", paddingBottom: "0.6rem", borderBottom: "1px solid #E2E8F0" }}>
                      <Store size={16} color="#00A896" />
                      <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0F172A" }}>
                        {vendorObj?.store_name || "Cayman Store"}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#64748B", marginLeft: "auto" }}>
                        {vendorObj?.district}
                      </span>
                    </div>

                    {/* Vendor Items */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {itemsList.map((item, idx) => {
                        const globalIndex = cart.findIndex((ci) => ci === item);
                        return (
                          <div key={idx} style={{ display: "flex", gap: "0.85rem", alignItems: "center" }}>
                            <img
                              src={item.product.images[0]}
                              alt={item.product.title}
                              style={{ width: "60px", height: "60px", borderRadius: "10px", objectFit: "cover" }}
                            />

                            <div style={{ flex: 1 }}>
                              <h5 style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.2rem" }}>
                                {item.product.title}
                              </h5>
                              
                              <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#00A896" }}>
                                {formatPrice(item.product.price)}
                              </div>
                            </div>

                            {/* Qty Controls */}
                            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: "8px", padding: "0.15rem 0.35rem" }}>
                              <button onClick={() => updateCartQty(globalIndex, -1)} style={{ background: "transparent", border: "none", padding: "0.2rem", cursor: "pointer" }}>
                                <Minus size={12} color="#64748B" />
                              </button>

                              <span style={{ fontSize: "0.82rem", fontWeight: 700, width: "20px", textAlign: "center" }}>
                                {item.qty}
                              </span>

                              <button onClick={() => updateCartQty(globalIndex, 1)} style={{ background: "transparent", border: "none", padding: "0.2rem", cursor: "pointer" }}>
                                <Plus size={12} color="#64748B" />
                              </button>
                            </div>

                            <button onClick={() => removeFromCart(globalIndex)} style={{ background: "transparent", color: "#EF4444", padding: "0.3rem", border: "none", cursor: "pointer" }}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout button */}
        {cart.length > 0 && (
          <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid #E2E8F0", background: "#FFFFFF" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
              <span style={{ fontSize: "0.9rem", color: "#64748B" }}>Grand Subtotal:</span>
              <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0F172A" }}>
                {formatPrice(totalAmountKYD)}
              </span>
            </div>

            {/* Permanent Session Recognition Badge */}
            {customerPhoneSession ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#F0FDF4",
                  border: "1px solid #BBF7D0",
                  padding: "0.45rem 0.75rem",
                  borderRadius: "10px",
                  marginBottom: "0.85rem",
                  fontSize: "0.8rem"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#166534", fontWeight: 700 }}>
                  <CheckCircle2 size={15} color="#16a34a" />
                  <span>
                    Logged in as: <strong>{customerProfile?.name ? `${customerProfile.name}` : customerPhoneSession}</strong>
                  </span>
                </div>
                <span style={{ fontSize: "0.72rem", color: "#059669", fontWeight: 800 }}>⚡ 1-Click Ready</span>
              </div>
            ) : (
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "#166534",
                  background: "#F0FDF4",
                  padding: "0.4rem 0.6rem",
                  borderRadius: "8px",
                  marginBottom: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem"
                }}
              >
                <ShieldCheck size={14} />
                <span>Supports <strong>COD</strong> & <strong>Reserve for Store Pickup (4-Digit PIN)</strong></span>
              </div>
            )}

            <button
              onClick={() => {
                if (customerPhoneSession) {
                  onClose();
                  onProceedCheckout();
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className="btn-primary"
              style={{ width: "100%", padding: "0.85rem 1rem", fontSize: "0.95rem" }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        )}

      </div>

      {/* Amazon / Shopify Style Smart Checkout Auth Modal */}
      <CheckoutAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onContinueToCheckout={(data) => {
          setIsAuthModalOpen(false);
          onClose();
          onProceedCheckout(data);
        }}
      />
    </div>
  );
}
