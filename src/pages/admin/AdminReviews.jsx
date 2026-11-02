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
    <div style={{ background: "#F8FAFC", minHeight: "100vh", color: "#0F172A", paddingBottom: "5rem" }}>
      {/* 1. Header Command Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #0A1C36 0%, #172554 100%)",
          borderBottom: "1px solid rgba(245, 158, 11, 0.25)",
          padding: "2.75rem 1.5rem 2.25rem",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ position: "absolute", top: "-40px", right: "10%", width: "320px", height: "320px", background: "radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.4)", padding: "0.35rem 0.85rem", borderRadius: "999px", color: "#FBBF24", fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem" }}>
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
                  background: "#FEF2F2",
                  border: "1.5px solid #FCA5A5",
                  padding: "0.85rem 1.25rem",
                  borderRadius: "16px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(239, 68, 68, 0.1)"
                }}
              >
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF" }}>
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "0.76rem", color: "#B91C1C", fontWeight: 700, textTransform: "uppercase" }}>Action Required</div>
                  <div style={{ fontSize: "1rem", fontWeight: 800, color: "#991B1B" }}>{flaggedCount} Flagged by Merchants</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "2rem" }}>
        
        {/* 2. Metrics Strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
          
          <div style={{ background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "18px", padding: "1.25rem 1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.82rem", color: "#64748B", fontWeight: 700 }}>TOTAL REVIEWS</span>
              <div style={{ background: "#F0FDFA", width: "34px", height: "34px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #CCFBF1" }}>
                <MessageSquare size={17} color="#0D9488" />
              </div>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#0F172A" }}>{totalReviews}</div>
            <div style={{ fontSize: "0.78rem", color: "#166534", marginTop: "0.25rem", fontWeight: 600 }}>100% Verified Buyer Orders</div>
          </div>

          <div style={{ background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "18px", padding: "1.25rem 1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.82rem", color: "#64748B", fontWeight: 700 }}>PLATFORM AVERAGE</span>
              <div style={{ background: "#FFFBEB", width: "34px", height: "34px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #FEF3C7" }}>
                <Star size={17} color="#D97706" fill="#D97706" />
              </div>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#B45309" }}>{avgRating} <span style={{ fontSize: "1rem", color: "#64748B" }}>/ 5.0</span></div>
            <div style={{ fontSize: "0.78rem", color: "#64748B", marginTop: "0.25rem" }}>Grand Cayman Island Quality</div>
          </div>

          <div style={{ background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "18px", padding: "1.25rem 1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.82rem", color: "#64748B", fontWeight: 700 }}>DISPUTES / FLAGGED</span>
              <div style={{ background: flaggedCount > 0 ? "#FEF2F2" : "#F0FDF4", width: "34px", height: "34px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${flaggedCount > 0 ? "#FECACA" : "#BBF7D0"}` }}>
                <AlertTriangle size={17} color={flaggedCount > 0 ? "#DC2626" : "#166534"} />
              </div>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: flaggedCount > 0 ? "#DC2626" : "#166534" }}>{flaggedCount}</div>
            <div style={{ fontSize: "0.78rem", color: "#64748B", marginTop: "0.25rem" }}>Merchant spam / fake alerts</div>
          </div>

          <div style={{ background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "18px", padding: "1.25rem 1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.82rem", color: "#64748B", fontWeight: 700 }}>MERCHANT REPLY RATE</span>
              <div style={{ background: "#F0F9FF", width: "34px", height: "34px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #BAE6FD" }}>
                <Sparkles size={17} color="#0284C7" />
              </div>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#0284C7" }}>{responseRate}%</div>
            <div style={{ fontSize: "0.78rem", color: "#64748B", marginTop: "0.25rem" }}>{repliedCount} official vendor replies</div>
          </div>

        </div>

        {/* 3. Search & Control Bar */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #E2E8F0",
            borderRadius: "20px",
            padding: "1.25rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
          }}
        >
          {/* Search box */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "#F8FAFC", border: "1px solid #CBD5E1", padding: "0.6rem 1rem", borderRadius: "12px", minWidth: "280px", flex: 1 }}>
            <Search size={18} color="#64748B" />
            <input
              type="text"
              placeholder="Search by customer, product, store, or comment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: "transparent", border: "none", color: "#0F172A", outline: "none", fontSize: "0.9rem", width: "100%" }}
            />
          </div>

          {/* Vendor Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Store size={16} color="#64748B" />
            <select
              value={selectedVendorFilter}
              onChange={(e) => setSelectedVendorFilter(e.target.value)}
              style={{ background: "#F8FAFC", border: "1px solid #CBD5E1", color: "#0F172A", padding: "0.6rem 0.9rem", borderRadius: "12px", fontSize: "0.88rem", outline: "none", cursor: "pointer", fontWeight: 600 }}
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
                background: ratingFilter === "all" ? "#0F172A" : "#F8FAFC",
                color: ratingFilter === "all" ? "#FFFFFF" : "#64748B",
                border: "1px solid",
                borderColor: ratingFilter === "all" ? "#0F172A" : "#E2E8F0",
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
                background: ratingFilter === "flagged" ? "#DC2626" : "#FEF2F2",
                color: ratingFilter === "flagged" ? "#FFFFFF" : "#DC2626",
                border: "1px solid",
                borderColor: ratingFilter === "flagged" ? "#DC2626" : "#FECACA",
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
                background: ratingFilter === "5" ? "#D97706" : "#FFFBEB",
                color: ratingFilter === "5" ? "#FFFFFF" : "#B45309",
                border: "1px solid",
                borderColor: ratingFilter === "5" ? "#D97706" : "#FEF3C7",
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
                background: ratingFilter === "low" ? "#DC2626" : "#F8FAFC",
                color: ratingFilter === "low" ? "#FFFFFF" : "#64748B",
                border: "1px solid",
                borderColor: ratingFilter === "low" ? "#DC2626" : "#E2E8F0",
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
          <div style={{ background: "#FFFFFF", border: "1.5px dashed #CBD5E1", borderRadius: "24px", padding: "4rem 2rem", textAlign: "center" }}>
            <MessageSquare size={48} color="#94A3B8" style={{ margin: "0 auto 1rem", opacity: 0.6 }} />
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.5rem" }}>
              No Reviews Match Current Filter
            </h3>
            <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
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
                    background: "#FFFFFF",
                    border: rev.is_flagged ? "1.5px solid #FCA5A5" : "1.5px solid #E2E8F0",
                    borderRadius: "20px",
                    padding: "1.75rem",
                    transition: "all 0.2s ease",
                    position: "relative",
                    boxShadow: rev.is_flagged ? "0 8px 30px rgba(239, 68, 68, 0.08)" : "0 2px 8px rgba(0,0,0,0.03)"
                  }}
                >
                  {/* Top Header Row */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
                    
                    {/* Left: Author + Badges */}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F172A" }}>{rev.author}</span>
                        {rev.verified_purchase && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", background: "#DCFCE7", border: "1px solid #BBF7D0", padding: "0.2rem 0.55rem", borderRadius: "999px", color: "#15803D", fontSize: "0.72rem", fontWeight: 800 }}>
                            <ShieldCheck size={13} /> Verified Buyer
                          </span>
                        )}
                        <span style={{ fontSize: "0.82rem", color: "#64748B" }}>• {formattedDate}</span>
                        {rev.order_id && (
                          <span style={{ fontSize: "0.78rem", color: "#475569", background: "#F1F5F9", padding: "0.15rem 0.5rem", borderRadius: "6px", fontWeight: 600 }}>
                            Order: #{rev.order_id}
                          </span>
                        )}
                      </div>

                      {/* Store & Product Attribution */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginTop: "0.45rem", fontSize: "0.86rem", color: "#64748B", flexWrap: "wrap" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "#0D9488", fontWeight: 700 }}>
                          <Store size={14} /> {rev.vendor_name}
                        </span>
                        <span>•</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "#0F172A", fontWeight: 600 }}>
                          <Package size={14} color="#D97706" /> {rev.product_title}
                        </span>
                      </div>
                    </div>

                    {/* Right: Star Rating & Action Buttons */}
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      {/* Visual Stars */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.2rem", background: "#FFFBEB", padding: "0.4rem 0.75rem", borderRadius: "10px", border: "1px solid #FEF3C7" }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            color={star <= rev.rating ? "#D97706" : "#CBD5E1"}
                            fill={star <= rev.rating ? "#D97706" : "transparent"}
                          />
                        ))}
                        <span style={{ marginLeft: "0.4rem", fontWeight: 900, color: "#92400E", fontSize: "0.92rem" }}>
                          {rev.rating}.0
                        </span>
                      </div>

                      {/* Admin Delete Action */}
                      <button
                        onClick={() => handleDelete(rev)}
                        title="Delete Review & Recalculate Rating"
                        style={{
                          background: "#FEF2F2",
                          border: "1px solid #FECACA",
                          color: "#DC2626",
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
                  <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "1.1rem 1.35rem", fontSize: "0.95rem", lineHeight: 1.6, color: "#334155", marginBottom: "1rem" }}>
                    "{rev.comment}"
                  </div>

                  {/* Flagged Alert Banner (if reported by vendor) */}
                  {rev.is_flagged && (
                    <div
                      style={{
                        background: "#FEF2F2",
                        border: "1px solid #FCA5A5",
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
                        <AlertTriangle size={20} color="#DC2626" style={{ flexShrink: 0, marginTop: "2px" }} />
                        <div>
                          <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#B91C1C", textTransform: "uppercase" }}>
                            Merchant Flagged Report:
                          </div>
                          <div style={{ fontSize: "0.9rem", color: "#991B1B", marginTop: "0.2rem" }}>
                            {rev.flag_reason || "Reported as inappropriate, fake, or abusive review by merchant."}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "0.6rem" }}>
                        <button
                          onClick={() => adminDismissFlag(rev.id)}
                          style={{
                            background: "#DCFCE7",
                            border: "1px solid #BBF7D0",
                            color: "#15803D",
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
                            background: "#DC2626",
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
                        background: "#F0FDFA",
                        border: "1px solid #CCFBF1",
                        borderRadius: "14px",
                        padding: "1rem 1.25rem",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.75rem"
                      }}
                    >
                      <MessageSquare size={18} color="#0D9488" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                          <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#0D9488", textTransform: "uppercase" }}>
                            Official Response from {rev.vendor_name}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "#64748B" }}>
                            {new Date(rev.vendor_reply.replied_at || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: "0.9rem", color: "#134E4A", lineHeight: 1.5 }}>
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
