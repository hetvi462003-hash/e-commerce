import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import {
  Star,
  ShieldCheck,
  AlertTriangle,
  Trash2,
  CheckCircle2,
  MessageSquare,
  Search,
  Filter,
  Store,
  Package,
  TrendingUp,
  Clock,
  Sparkles,
  ExternalLink
} from "lucide-react";

export default function AdminReviews() {
  const {
    reviews = [],
    vendors = [],
    adminDeleteReview,
    adminDismissFlag,
    showToast
  } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendorFilter, setSelectedVendorFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all"); // 'all' | 'flagged' | '5' | 'low'

  // Metric stats
  const totalReviews = reviews.length;
  const flaggedCount = reviews.filter((r) => r.is_flagged).length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : "5.0";
  const repliedCount = reviews.filter((r) => r.vendor_reply).length;
  const responseRate = totalReviews > 0
    ? Math.round((repliedCount / totalReviews) * 100)
    : 100;

  // Filtered reviews
  const filteredReviews = reviews.filter((r) => {
    // Search
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      r.author?.toLowerCase().includes(q) ||
      r.comment?.toLowerCase().includes(q) ||
      r.product_title?.toLowerCase().includes(q) ||
      r.vendor_name?.toLowerCase().includes(q);

    // Vendor filter
    const matchesVendor =
      selectedVendorFilter === "all" ||
      r.vendor_id === selectedVendorFilter;

    // Rating / Status filter
    let matchesRating = true;
    if (ratingFilter === "flagged") matchesRating = !!r.is_flagged;
    else if (ratingFilter === "5") matchesRating = r.rating === 5;
    else if (ratingFilter === "low") matchesRating = r.rating <= 2;

    return matchesSearch && matchesVendor && matchesRating;
  });

  const handleDelete = (review) => {
    if (window.confirm(`Are you sure you want to permanently delete this ${review.rating}-star review by "${review.author}"? Product and store ratings will be automatically updated.`)) {
      adminDeleteReview(review.id);
    }
  };

  return (
    <div style={{ background: "#060D19", minHeight: "100vh", color: "#F8FAFC", paddingBottom: "5rem" }}>
      {/* 1. Header Command Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #050B14 0%, #0B192E 50%, #0A2540 100%)",
          borderBottom: "1px solid rgba(245, 158, 11, 0.25)",
          padding: "2.75rem 1.5rem 2.25rem",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ position: "absolute", top: "-40px", right: "10%", width: "320px", height: "320px", background: "radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(245, 158, 11, 0.12)", border: "1px solid rgba(245, 158, 11, 0.35)", padding: "0.35rem 0.85rem", borderRadius: "999px", color: "#FBBF24", fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem" }}>
            <ShieldCheck size={16} /> SuperAdmin Trust & Safety
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "2.4rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.4rem" }}>
                Customer Reviews & Rating Oversight
              </h1>
              <p style={{ color: "#94A3B8", fontSize: "1rem", maxWidth: "680px", margin: 0 }}>
                Platform-wide moderation of verified customer feedback, dispute resolution for reported reviews, and automated credibility scoring.
              </p>
            </div>

            {flaggedCount > 0 && (
              <div
                onClick={() => setRatingFilter("flagged")}
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  padding: "0.85rem 1.25rem",
                  borderRadius: "16px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(239, 68, 68, 0.2)"
                }}
              >
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF" }}>
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "0.76rem", color: "#FCA5A5", fontWeight: 700, textTransform: "uppercase" }}>Action Required</div>
                  <div style={{ fontSize: "1rem", fontWeight: 800, color: "#FFFFFF" }}>{flaggedCount} Flagged by Merchants</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "2rem" }}>
        
        {/* 2. Metrics Strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
          
          <div style={{ background: "#0B1526", border: "1px solid #1E293B", borderRadius: "18px", padding: "1.25rem 1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.82rem", color: "#94A3B8", fontWeight: 700 }}>TOTAL REVIEWS</span>
              <MessageSquare size={18} color="#00E5C9" />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#FFFFFF" }}>{totalReviews}</div>
            <div style={{ fontSize: "0.78rem", color: "#10B981", marginTop: "0.25rem" }}>100% Verified Buyer Orders</div>
          </div>

          <div style={{ background: "#0B1526", border: "1px solid #1E293B", borderRadius: "18px", padding: "1.25rem 1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.82rem", color: "#94A3B8", fontWeight: 700 }}>PLATFORM AVERAGE</span>
              <Star size={18} color="#FBBF24" fill="#FBBF24" />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#FBBF24" }}>{avgRating} <span style={{ fontSize: "1rem", color: "#94A3B8" }}>/ 5.0</span></div>
            <div style={{ fontSize: "0.78rem", color: "#94A3B8", marginTop: "0.25rem" }}>Grand Cayman Island Quality</div>
          </div>

          <div style={{ background: "#0B1526", border: "1px solid #1E293B", borderRadius: "18px", padding: "1.25rem 1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.82rem", color: "#94A3B8", fontWeight: 700 }}>DISPUTES / FLAGGED</span>
              <AlertTriangle size={18} color={flaggedCount > 0 ? "#EF4444" : "#10B981"} />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: flaggedCount > 0 ? "#EF4444" : "#10B981" }}>{flaggedCount}</div>
            <div style={{ fontSize: "0.78rem", color: "#94A3B8", marginTop: "0.25rem" }}>Merchant spam / fake alerts</div>
          </div>

          <div style={{ background: "#0B1526", border: "1px solid #1E293B", borderRadius: "18px", padding: "1.25rem 1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.82rem", color: "#94A3B8", fontWeight: 700 }}>MERCHANT REPLY RATE</span>
              <Sparkles size={18} color="#38BDF8" />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#38BDF8" }}>{responseRate}%</div>
            <div style={{ fontSize: "0.78rem", color: "#94A3B8", marginTop: "0.25rem" }}>{repliedCount} official vendor replies</div>
          </div>

        </div>

        {/* 3. Search & Control Bar */}
        <div
          style={{
            background: "#0B1526",
            border: "1px solid #1E293B",
            borderRadius: "20px",
            padding: "1.25rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2rem"
          }}
        >
          {/* Search box */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "#060D19", border: "1px solid #1E293B", padding: "0.6rem 1rem", borderRadius: "12px", minWidth: "280px", flex: 1 }}>
            <Search size={18} color="#64748B" />
            <input
              type="text"
              placeholder="Search by customer, product, store, or comment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: "transparent", border: "none", color: "#FFFFFF", outline: "none", fontSize: "0.9rem", width: "100%" }}
            />
          </div>

          {/* Vendor Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Store size={16} color="#94A3B8" />
            <select
              value={selectedVendorFilter}
              onChange={(e) => setSelectedVendorFilter(e.target.value)}
              style={{ background: "#060D19", border: "1px solid #1E293B", color: "#E2E8F0", padding: "0.6rem 0.9rem", borderRadius: "12px", fontSize: "0.88rem", outline: "none", cursor: "pointer" }}
            >
              <option value="all">All Cayman Stores</option>
              {vendors.map((v) => (
                <option key={v.id || v.vendor_id} value={v.id || v.vendor_id}>
                  {v.store_name} ({v.district || "Grand Cayman"})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Filter Pills */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              onClick={() => setRatingFilter("all")}
              style={{
                background: ratingFilter === "all" ? "#00E5C9" : "#060D19",
                color: ratingFilter === "all" ? "#050B14" : "#94A3B8",
                border: "1px solid",
                borderColor: ratingFilter === "all" ? "#00E5C9" : "#1E293B",
                fontWeight: 700,
                fontSize: "0.84rem",
                padding: "0.55rem 0.9rem",
                borderRadius: "10px",
                cursor: "pointer"
              }}
            >
              All ({reviews.length})
            </button>

            <button
              onClick={() => setRatingFilter("flagged")}
              style={{
                background: ratingFilter === "flagged" ? "#EF4444" : "#060D19",
                color: ratingFilter === "flagged" ? "#FFFFFF" : "#F87171",
                border: "1px solid",
                borderColor: ratingFilter === "flagged" ? "#EF4444" : "rgba(239, 68, 68, 0.3)",
                fontWeight: 700,
                fontSize: "0.84rem",
                padding: "0.55rem 0.9rem",
                borderRadius: "10px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem"
              }}
            >
              <AlertTriangle size={14} /> Flagged ({flaggedCount})
            </button>

            <button
              onClick={() => setRatingFilter("5")}
              style={{
                background: ratingFilter === "5" ? "#F59E0B" : "#060D19",
                color: ratingFilter === "5" ? "#050B14" : "#FBBF24",
                border: "1px solid",
                borderColor: ratingFilter === "5" ? "#F59E0B" : "rgba(245, 158, 11, 0.3)",
                fontWeight: 700,
                fontSize: "0.84rem",
                padding: "0.55rem 0.9rem",
                borderRadius: "10px",
                cursor: "pointer"
              }}
            >
              5 ★ Top Rated
            </button>

            <button
              onClick={() => setRatingFilter("low")}
              style={{
                background: ratingFilter === "low" ? "#EF4444" : "#060D19",
                color: ratingFilter === "low" ? "#FFFFFF" : "#CBD5E1",
                border: "1px solid",
                borderColor: ratingFilter === "low" ? "#EF4444" : "#1E293B",
                fontWeight: 700,
                fontSize: "0.84rem",
                padding: "0.55rem 0.9rem",
                borderRadius: "10px",
                cursor: "pointer"
              }}
            >
              1 - 2 ★ Critical
            </button>
          </div>

        </div>

        {/* 4. Reviews List */}
        {filteredReviews.length === 0 ? (
          <div style={{ background: "#0B1526", border: "1px dashed #1E293B", borderRadius: "24px", padding: "4rem 2rem", textAlign: "center" }}>
            <MessageSquare size={48} color="#64748B" style={{ margin: "0 auto 1rem", opacity: 0.6 }} />
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.5rem" }}>
              No Reviews Match Current Filter
            </h3>
            <p style={{ color: "#94A3B8", fontSize: "0.95rem" }}>
              Try adjusting your search criteria or resetting filters to see all customer reviews.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {filteredReviews.map((rev) => {
              const formattedDate = new Date(rev.created_at || Date.now()).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              });

              return (
                <div
                  key={rev.id}
                  style={{
                    background: "#0B1526",
                    border: rev.is_flagged ? "1.5px solid rgba(239, 68, 68, 0.6)" : "1px solid #1E293B",
                    borderRadius: "20px",
                    padding: "1.75rem",
                    transition: "all 0.2s ease",
                    position: "relative",
                    boxShadow: rev.is_flagged ? "0 8px 30px rgba(239, 68, 68, 0.15)" : "none"
                  }}
                >
                  {/* Top Header Row */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
                    
                    {/* Left: Author + Badges */}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF" }}>{rev.author}</span>
                        {rev.verified_purchase && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.35)", padding: "0.2rem 0.55rem", borderRadius: "999px", color: "#10B981", fontSize: "0.72rem", fontWeight: 800 }}>
                            <ShieldCheck size={13} /> Verified Buyer
                          </span>
                        )}
                        <span style={{ fontSize: "0.82rem", color: "#64748B" }}>• {formattedDate}</span>
                        {rev.order_id && (
                          <span style={{ fontSize: "0.78rem", color: "#94A3B8", background: "#060D19", padding: "0.15rem 0.5rem", borderRadius: "6px" }}>
                            Order: #{rev.order_id}
                          </span>
                        )}
                      </div>

                      {/* Store & Product Attribution */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginTop: "0.45rem", fontSize: "0.86rem", color: "#94A3B8", flexWrap: "wrap" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "#00E5C9", fontWeight: 700 }}>
                          <Store size={14} /> {rev.vendor_name}
                        </span>
                        <span>•</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "#E2E8F0" }}>
                          <Package size={14} color="#FBBF24" /> {rev.product_title}
                        </span>
                      </div>
                    </div>

                    {/* Right: Star Rating & Action Buttons */}
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      {/* Visual Stars */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.2rem", background: "#060D19", padding: "0.4rem 0.75rem", borderRadius: "10px", border: "1px solid #1E293B" }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            color={star <= rev.rating ? "#F59E0B" : "#334155"}
                            fill={star <= rev.rating ? "#F59E0B" : "transparent"}
                          />
                        ))}
                        <span style={{ marginLeft: "0.4rem", fontWeight: 900, color: "#FFFFFF", fontSize: "0.92rem" }}>
                          {rev.rating}.0
                        </span>
                      </div>

                      {/* Admin Delete Action */}
                      <button
                        onClick={() => handleDelete(rev)}
                        title="Delete Review & Recalculate Rating"
                        style={{
                          background: "rgba(239, 68, 68, 0.12)",
                          border: "1px solid rgba(239, 68, 68, 0.35)",
                          color: "#EF4444",
                          padding: "0.5rem 0.85rem",
                          borderRadius: "10px",
                          fontWeight: 700,
                          fontSize: "0.82rem",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <Trash2 size={15} /> Delete Review
                      </button>
                    </div>

                  </div>

                  {/* Customer Comment */}
                  <div style={{ background: "#060D19", border: "1px solid #1E293B", borderRadius: "14px", padding: "1.1rem 1.35rem", fontSize: "0.95rem", lineHeight: 1.6, color: "#E2E8F0", marginBottom: "1rem" }}>
                    "{rev.comment}"
                  </div>

                  {/* Flagged Alert Banner (if reported by vendor) */}
                  {rev.is_flagged && (
                    <div
                      style={{
                        background: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.4)",
                        borderRadius: "14px",
                        padding: "1rem 1.25rem",
                        marginBottom: "1rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "1rem"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                        <AlertTriangle size={20} color="#EF4444" style={{ flexShrink: 0, marginTop: "2px" }} />
                        <div>
                          <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#FCA5A5", textTransform: "uppercase" }}>
                            Merchant Flagged Report:
                          </div>
                          <div style={{ fontSize: "0.9rem", color: "#FFFFFF", marginTop: "0.2rem" }}>
                            {rev.flag_reason || "Reported as inappropriate, fake, or abusive review by merchant."}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "0.6rem" }}>
                        <button
                          onClick={() => adminDismissFlag(rev.id)}
                          style={{
                            background: "rgba(16, 185, 129, 0.15)",
                            border: "1px solid rgba(16, 185, 129, 0.4)",
                            color: "#10B981",
                            padding: "0.45rem 0.85rem",
                            borderRadius: "10px",
                            fontWeight: 700,
                            fontSize: "0.82rem",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem"
                          }}
                        >
                          <CheckCircle2 size={15} /> Dismiss Flag (Keep Review)
                        </button>

                        <button
                          onClick={() => handleDelete(rev)}
                          style={{
                            background: "#EF4444",
                            border: "none",
                            color: "#FFFFFF",
                            padding: "0.45rem 0.85rem",
                            borderRadius: "10px",
                            fontWeight: 700,
                            fontSize: "0.82rem",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem"
                          }}
                        >
                          <Trash2 size={15} /> Accept Dispute & Remove
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Vendor Public Reply Display (if exists) */}
                  {rev.vendor_reply && (
                    <div
                      style={{
                        background: "rgba(0, 229, 201, 0.05)",
                        border: "1px solid rgba(0, 229, 201, 0.25)",
                        borderRadius: "14px",
                        padding: "1rem 1.25rem",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.75rem"
                      }}
                    >
                      <MessageSquare size={18} color="#00E5C9" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                          <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#00E5C9", textTransform: "uppercase" }}>
                            Official Response from {rev.vendor_name}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "#64748B" }}>
                            {new Date(rev.vendor_reply.replied_at || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: "0.9rem", color: "#E2E8F0", lineHeight: 1.5 }}>
                          "{rev.vendor_reply.text}"
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
