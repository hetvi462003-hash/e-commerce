import React, { useState } from "react";
import { X, Star, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useMarketplace } from "../context/MarketplaceContext";

export default function ReviewModal({ order, onClose }) {
  const { submitProductReview, showToast } = useMarketplace();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(
    order?.items?.[0]?.product_id || order?.items?.[0]?.id || ""
  );

  if (!order) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast("Please enter a short review feedback.", "warning");
      return;
    }

    submitProductReview(order.id, selectedProductId, {
      rating,
      comment: comment.trim(),
      customerName: order.customer_name || "Verified Buyer",
      vendorId: order.vendor_id
    });

    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(5, 11, 20, 0.8)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem"
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "480px",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
          border: "1px solid #E2E8F0"
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.25rem 1.75rem",
            borderBottom: "1px solid #F1F5F9",
            background: "#F8FAFC"
          }}
        >
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "#166534", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase" }}>
              <ShieldCheck size={14} /> Verified Buyer Review
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
              Rate Your Experience
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#64748B",
              cursor: "pointer",
              padding: "0.3rem",
              borderRadius: "8px"
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: "1.75rem" }}>
          
          {/* Order Details Mini Banner */}
          <div
            style={{
              background: "#F0FDFA",
              border: "1px solid #CCFBF1",
              borderRadius: "12px",
              padding: "0.75rem 1rem",
              marginBottom: "1.25rem",
              fontSize: "0.82rem",
              color: "#0F766E",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              Order <strong>#{order.id}</strong> • {order.vendor_name}
            </div>
            <span style={{ fontWeight: 800, color: "#00A896" }}>Completed</span>
          </div>

          {/* Item Selector if multi-item */}
          {order.items && order.items.length > 1 && (
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.35rem", display: "block" }}>
                Select Product to Review:
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "10px",
                  border: "1.5px solid #CBD5E1",
                  fontSize: "0.88rem"
                }}
              >
                {order.items.map((it, idx) => (
                  <option key={idx} value={it.product_id || it.id}>
                    {it.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Star Rating Picker */}
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#475569", display: "block", marginBottom: "0.5rem" }}>
              Overall Rating:
            </label>
            <div style={{ display: "inline-flex", gap: "0.5rem" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    transition: "transform 0.15s ease"
                  }}
                >
                  <Star
                    size={32}
                    color={star <= (hoverRating || rating) ? "#F59E0B" : "#CBD5E1"}
                    fill={star <= (hoverRating || rating) ? "#F59E0B" : "none"}
                  />
                </button>
              ))}
            </div>
            <div style={{ fontSize: "0.82rem", color: "#64748B", fontWeight: 700, marginTop: "0.25rem" }}>
              {rating === 5 && "⭐⭐⭐⭐⭐ Outstanding!"}
              {rating === 4 && "⭐⭐⭐⭐ Very Good"}
              {rating === 3 && "⭐⭐⭐ Good / Average"}
              {rating === 2 && "⭐⭐ Fair"}
              {rating === 1 && "⭐ Needs Improvement"}
            </div>
          </div>

          {/* Review Feedback Textarea */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.35rem", display: "block" }}>
              Your Review & Comments:
            </label>
            <textarea
              required
              rows={4}
              placeholder="Tell other island shoppers about the craftsmanship, pickup experience, and quality..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "12px",
                border: "1.5px solid #CBD5E1",
                fontSize: "0.88rem",
                resize: "vertical",
                fontFamily: "inherit"
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary"
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "12px",
              fontSize: "0.95rem",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem"
            }}
          >
            <CheckCircle2 size={18} /> Submit Verified Review
          </button>

        </form>

      </div>
    </div>
  );
}
