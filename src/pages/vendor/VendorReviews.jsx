import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import {
  Star,
  ShieldCheck,
  MessageSquare,
  AlertTriangle,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  Store,
  Package,
  CornerDownRight,
  Filter
} from "lucide-react";

export default function VendorReviews() {
  const {
    reviews = [],
    activeVendor,
    activeVendorId,
    vendorReplyToReview,
    vendorReportReview,
    showToast
  } = useMarketplace();

  // Filter reviews strictly for this vendor
  const stallReviews = reviews.filter((r) => {
    return (
      r.vendor_id === activeVendorId ||
      r.vendor_id === activeVendor?.id ||
      r.vendor_id === activeVendor?.vendor_id
    );
  });

  const [activeTabFilter, setActiveTabFilter] = useState("all"); // 'all' | 'needs_reply' | 'flagged'
  const [replyTextMap, setReplyTextMap] = useState({});
  const [activeReplyBox, setActiveReplyBox] = useState(null); // reviewId currently answering
  const [flagModalReviewId, setFlagModalReviewId] = useState(null);
  const [flagReasonText, setFlagReasonText] = useState("");

  // Metrics
  const totalCount = stallReviews.length;
  const avgRating = totalCount > 0
    ? (stallReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1)
    : Number(activeVendor?.rating || 5.0).toFixed(1);
  const awaitingReplyCount = stallReviews.filter((r) => !r.vendor_reply).length;
  const fiveStarCount = stallReviews.filter((r) => r.rating === 5).length;

  const filteredReviews = stallReviews.filter((r) => {
    if (activeTabFilter === "needs_reply") return !r.vendor_reply;
    if (activeTabFilter === "flagged") return r.is_flagged;
    return true;
  });

  const handleSendReply = (reviewId) => {
    const text = replyTextMap[reviewId];
    if (!text || !text.trim()) {
      showToast("Please enter a reply message before submitting.", "warning");
      return;
    }
    vendorReplyToReview(reviewId, text);
    setReplyTextMap((prev) => ({ ...prev, [reviewId]: "" }));
    setActiveReplyBox(null);
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!flagReasonText.trim()) {
      showToast("Please provide the reason why this review is unfair or fake.", "warning");
      return;
    }
    vendorReportReview(flagModalReviewId, flagReasonText);
    setFlagModalReviewId(null);
    setFlagReasonText("");
  };

  return (
    <div style={{ background: "#050B14", minHeight: "100vh", color: "#F8FAFC", paddingBottom: "5rem" }}>
      
      {/* 1. Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #050B14 0%, #0A1E38 50%, #004D40 100%)",
          borderBottom: "1px solid rgba(0, 229, 201, 0.25)",
          padding: "2.75rem 1.5rem 2.25rem",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ position: "absolute", top: "-40px", right: "8%", width: "320px", height: "320px", background: "radial-gradient(circle, rgba(0, 229, 201, 0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(0, 229, 201, 0.12)", border: "1px solid rgba(0, 229, 201, 0.35)", padding: "0.35rem 0.85rem", borderRadius: "999px", color: "#00E5C9", fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem" }}>
            <Store size={15} /> {activeVendor?.store_name || "Store"} • Customer Reputation
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "2.4rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.4rem" }}>
                Customer Ratings & Verified Feedback
              </h1>
              <p style={{ color: "#94A3B8", fontSize: "1rem", maxWidth: "680px", margin: 0 }}>
                Respond directly to shoppers who purchased items at your store, build buyer trust, and report fraudulent or competitor reviews to Admin.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ background: "#061324", border: "1px solid rgba(0, 229, 201, 0.3)", padding: "0.75rem 1.25rem", borderRadius: "16px", textAlign: "right" }}>
                <div style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>Store Reputation</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", justifyContent: "flex-end", fontSize: "1.4rem", fontWeight: 900, color: "#FBBF24" }}>
                  <Star size={20} fill="#FBBF24" /> {avgRating} <span style={{ fontSize: "0.85rem", color: "#94A3B8" }}>({totalCount} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "2rem" }}>
        
        {/* 2. Stall Feedback Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
          
          <div style={{ background: "#0A1628", border: "1px solid #1E293B", borderRadius: "18px", padding: "1.25rem 1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.82rem", color: "#94A3B8", fontWeight: 700 }}>VERIFIED REVIEWS</span>
              <MessageSquare size={18} color="#00E5C9" />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#FFFFFF" }}>{totalCount}</div>
            <div style={{ fontSize: "0.78rem", color: "#10B981", marginTop: "0.25rem" }}>Real Grand Cayman Buyers</div>
          </div>

          <div style={{ background: "#0A1628", border: "1px solid #1E293B", borderRadius: "18px", padding: "1.25rem 1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.82rem", color: "#94A3B8", fontWeight: 700 }}>STORE AVERAGE</span>
              <Star size={18} color="#FBBF24" fill="#FBBF24" />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#FBBF24" }}>{avgRating} <span style={{ fontSize: "1rem", color: "#94A3B8" }}>/ 5.0</span></div>
            <div style={{ fontSize: "0.78rem", color: "#94A3B8", marginTop: "0.25rem" }}>Official Marketplace Score</div>
          </div>

          <div style={{ background: "#0A1628", border: "1px solid #1E293B", borderRadius: "18px", padding: "1.25rem 1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.82rem", color: "#94A3B8", fontWeight: 700 }}>AWAITING REPLY</span>
              <Clock size={18} color={awaitingReplyCount > 0 ? "#F59E0B" : "#10B981"} />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: awaitingReplyCount > 0 ? "#F59E0B" : "#10B981" }}>{awaitingReplyCount}</div>
            <div style={{ fontSize: "0.78rem", color: "#94A3B8", marginTop: "0.25rem" }}>Opportunities to engage</div>
          </div>

          <div style={{ background: "#0A1628", border: "1px solid #1E293B", borderRadius: "18px", padding: "1.25rem 1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.82rem", color: "#94A3B8", fontWeight: 700 }}>5-STAR DELIGHT</span>
              <Sparkles size={18} color="#00E5C9" />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#00E5C9" }}>{fiveStarCount}</div>
            <div style={{ fontSize: "0.78rem", color: "#94A3B8", marginTop: "0.25rem" }}>Top-rated experiences</div>
          </div>

        </div>

        {/* 3. Filter Bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button
              onClick={() => setActiveTabFilter("all")}
              style={{
                background: activeTabFilter === "all" ? "#00E5C9" : "#0A1628",
                color: activeTabFilter === "all" ? "#050B14" : "#94A3B8",
                border: "1px solid",
                borderColor: activeTabFilter === "all" ? "#00E5C9" : "#1E293B",
                fontWeight: 700,
                fontSize: "0.85rem",
                padding: "0.55rem 1rem",
                borderRadius: "12px",
                cursor: "pointer"
              }}
            >
              All Store Feedback ({stallReviews.length})
            </button>

            <button
              onClick={() => setActiveTabFilter("needs_reply")}
              style={{
                background: activeTabFilter === "needs_reply" ? "#F59E0B" : "#0A1628",
                color: activeTabFilter === "needs_reply" ? "#050B14" : "#FBBF24",
                border: "1px solid",
                borderColor: activeTabFilter === "needs_reply" ? "#F59E0B" : "rgba(245, 158, 11, 0.3)",
                fontWeight: 700,
                fontSize: "0.85rem",
                padding: "0.55rem 1rem",
                borderRadius: "12px",
                cursor: "pointer"
              }}
            >
              Needs Reply ({awaitingReplyCount})
            </button>

            <button
              onClick={() => setActiveTabFilter("flagged")}
              style={{
                background: activeTabFilter === "flagged" ? "#EF4444" : "#0A1628",
                color: activeTabFilter === "flagged" ? "#FFFFFF" : "#F87171",
                border: "1px solid",
                borderColor: activeTabFilter === "flagged" ? "#EF4444" : "rgba(239, 68, 68, 0.3)",
                fontWeight: 700,
                fontSize: "0.85rem",
                padding: "0.55rem 1rem",
                borderRadius: "12px",
                cursor: "pointer"
              }}
            >
              Under Moderation
            </button>
          </div>
        </div>

        {/* 4. Stall Reviews Feed */}
        {filteredReviews.length === 0 ? (
          <div style={{ background: "#0A1628", border: "1px dashed #1E293B", borderRadius: "24px", padding: "4rem 2rem", textAlign: "center" }}>
            <MessageSquare size={44} color="#64748B" style={{ margin: "0 auto 1rem", opacity: 0.6 }} />
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.5rem" }}>
              No Reviews Found for this Category
            </h3>
            <p style={{ color: "#94A3B8", fontSize: "0.95rem" }}>
              As customers complete pickup holds or delivery orders, their verified reviews will appear here.
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

              const isBoxOpen = activeReplyBox === rev.id;

              return (
                <div
                  key={rev.id}
                  style={{
                    background: "#0A1628",
                    border: rev.is_flagged ? "1.5px solid rgba(239, 68, 68, 0.6)" : "1px solid #1E293B",
                    borderRadius: "20px",
                    padding: "1.75rem",
                    transition: "all 0.2s ease"
                  }}
                >
                  {/* Top Bar */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF" }}>{rev.author}</span>
                        {rev.verified_purchase && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.35)", padding: "0.2rem 0.55rem", borderRadius: "999px", color: "#10B981", fontSize: "0.72rem", fontWeight: 800 }}>
                            <ShieldCheck size={13} /> Verified Buyer
                          </span>
                        )}
                        <span style={{ fontSize: "0.82rem", color: "#64748B" }}>• {formattedDate}</span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.4rem", fontSize: "0.86rem", color: "#94A3B8" }}>
                        <Package size={14} color="#00E5C9" />
                        <span style={{ color: "#E2E8F0" }}>{rev.product_title}</span>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "#050B14", padding: "0.4rem 0.75rem", borderRadius: "10px", border: "1px solid #1E293B" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={15}
                          color={star <= rev.rating ? "#F59E0B" : "#334155"}
                          fill={star <= rev.rating ? "#F59E0B" : "transparent"}
                        />
                      ))}
                      <span style={{ marginLeft: "0.35rem", fontWeight: 900, color: "#FFFFFF", fontSize: "0.9rem" }}>
                        {rev.rating}.0
                      </span>
                    </div>
                  </div>

                  {/* Customer Review Quote */}
                  <div style={{ background: "#050B14", border: "1px solid #1E293B", borderRadius: "14px", padding: "1.1rem 1.35rem", fontSize: "0.95rem", lineHeight: 1.6, color: "#E2E8F0", marginBottom: "1.25rem" }}>
                    "{rev.comment}"
                  </div>

                  {/* If Flagged Banner */}
                  {rev.is_flagged && (
                    <div
                      style={{
                        background: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.35)",
                        borderRadius: "14px",
                        padding: "0.9rem 1.25rem",
                        marginBottom: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem"
                      }}
                    >
                      <AlertTriangle size={18} color="#EF4444" style={{ flexShrink: 0 }} />
                      <div style={{ fontSize: "0.85rem", color: "#FCA5A5" }}>
                        <strong>Under Admin Moderation:</strong> You flagged this review as <em>"{rev.flag_reason}"</em>. SuperAdmin is reviewing this dispute.
                      </div>
                    </div>
                  )}

                  {/* Existing Vendor Reply */}
                  {rev.vendor_reply ? (
                    <div
                      style={{
                        background: "rgba(0, 229, 201, 0.05)",
                        border: "1px solid rgba(0, 229, 201, 0.25)",
                        borderRadius: "14px",
                        padding: "1rem 1.25rem",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.75rem",
                        marginBottom: "0.5rem"
                      }}
                    >
                      <CornerDownRight size={18} color="#00E5C9" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                          <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#00E5C9", textTransform: "uppercase" }}>
                            Your Official Store Reply
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
                  ) : (
                    /* Reply Action Bar & Input */
                    <div>
                      {!isBoxOpen ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                          <button
                            onClick={() => setActiveReplyBox(rev.id)}
                            style={{
                              background: "rgba(0, 229, 201, 0.12)",
                              border: "1px solid rgba(0, 229, 201, 0.35)",
                              color: "#00E5C9",
                              padding: "0.5rem 1rem",
                              borderRadius: "10px",
                              fontWeight: 700,
                              fontSize: "0.84rem",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.4rem",
                              cursor: "pointer"
                            }}
                          >
                            <MessageSquare size={15} /> Write Official Store Reply
                          </button>

                          {!rev.is_flagged && (
                            <button
                              onClick={() => {
                                setFlagModalReviewId(rev.id);
                                setFlagReasonText("");
                              }}
                              style={{
                                background: "transparent",
                                border: "none",
                                color: "#94A3B8",
                                fontSize: "0.82rem",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.35rem",
                                cursor: "pointer"
                              }}
                            >
                              <AlertTriangle size={14} color="#EF4444" /> Report Fake / Abusive Review
                            </button>
                          )}
                        </div>
                      ) : (
                        /* Open Reply Box */
                        <div style={{ background: "#050B14", border: "1px solid rgba(0, 229, 201, 0.3)", borderRadius: "14px", padding: "1rem" }}>
                          <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "#00E5C9", marginBottom: "0.5rem" }}>
                            Reply to {rev.author} (Publicly visible on Cayman Bazaar storefront):
                          </div>
                          <textarea
                            rows={3}
                            placeholder="Thank the customer or address their feedback warmly..."
                            value={replyTextMap[rev.id] || ""}
                            onChange={(e) => setReplyTextMap((prev) => ({ ...prev, [rev.id]: e.target.value }))}
                            style={{
                              width: "100%",
                              background: "#0A1628",
                              border: "1px solid #1E293B",
                              borderRadius: "10px",
                              color: "#FFFFFF",
                              padding: "0.75rem",
                              fontSize: "0.9rem",
                              outline: "none",
                              resize: "vertical",
                              boxSizing: "border-box"
                            }}
                          />
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.6rem", marginTop: "0.75rem" }}>
                            <button
                              onClick={() => setActiveReplyBox(null)}
                              style={{
                                background: "transparent",
                                border: "1px solid #1E293B",
                                color: "#94A3B8",
                                padding: "0.45rem 0.85rem",
                                borderRadius: "8px",
                                fontSize: "0.82rem",
                                cursor: "pointer"
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSendReply(rev.id)}
                              style={{
                                background: "#00E5C9",
                                border: "none",
                                color: "#050B14",
                                padding: "0.45rem 1rem",
                                borderRadius: "8px",
                                fontWeight: 800,
                                fontSize: "0.84rem",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.35rem",
                                cursor: "pointer"
                              }}
                            >
                              <Send size={14} /> Publish Reply
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* 5. Report / Dispute Review Modal */}
      {flagModalReviewId && (
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
              background: "#0B1526",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "20px",
              padding: "1.75rem",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "#EF4444", marginBottom: "0.5rem" }}>
              <AlertTriangle size={20} />
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
                Report Review to Admin
              </h3>
            </div>
            <p style={{ color: "#94A3B8", fontSize: "0.88rem", lineHeight: 1.5, marginBottom: "1.25rem" }}>
              Please state why this customer review violates Cayman Bazaar standards (e.g. competitor spam, customer never visited store, inappropriate language). SuperAdmin will investigate and can delete it.
            </p>

            <form onSubmit={handleReportSubmit}>
              <textarea
                required
                rows={4}
                placeholder="Reason for dispute..."
                value={flagReasonText}
                onChange={(e) => setFlagReasonText(e.target.value)}
                style={{
                  width: "100%",
                  background: "#060D19",
                  border: "1px solid #1E293B",
                  borderRadius: "12px",
                  color: "#FFFFFF",
                  padding: "0.85rem",
                  fontSize: "0.9rem",
                  outline: "none",
                  resize: "none",
                  boxSizing: "border-box",
                  marginBottom: "1.25rem"
                }}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setFlagModalReviewId(null)}
                  style={{
                    background: "transparent",
                    border: "1px solid #1E293B",
                    color: "#94A3B8",
                    padding: "0.55rem 1rem",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: "#EF4444",
                    border: "none",
                    color: "#FFFFFF",
                    padding: "0.55rem 1.2rem",
                    borderRadius: "10px",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem"
                  }}
                >
                  Submit Dispute to Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
