import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import { Megaphone, Sparkles, Plus, Eye, MousePointer, CreditCard, CheckCircle2 } from "lucide-react";

export default function VendorAds() {
  const { activeVendor, ads, createAdCampaign, products, formatPrice } = useMarketplace();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adType, setAdType] = useState("featured_store");
  const [selectedProdId, setSelectedProdId] = useState(products[0]?.id || "");
  const [budgetType, setBudgetType] = useState("per_day");
  const [dailyBudget, setDailyBudget] = useState(10);
  const [adTitle, setAdTitle] = useState("Special Island Promotion");

  if (!activeVendor) return null;

  const vendorAds = ads.filter((a) => a.vendor_id === activeVendor.id);
  const vendorProducts = products.filter((p) => p.vendor_id === activeVendor.id);

  const handleCreateAd = (e) => {
    e.preventDefault();
    createAdCampaign({
      type: adType,
      title: adTitle,
      product_id: adType === "sponsored_product" ? selectedProdId : null,
      budget_type: budgetType,
      daily_budget: parseFloat(dailyBudget),
      balance_credit: parseFloat(dailyBudget) * 5
    });
    setIsModalOpen(false);
  };

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem", paddingBottom: "5rem" }}>
      
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#D97706", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>
            <Sparkles size={16} /> Marketing & Promotion
          </div>
          <h1 style={{ fontSize: "2.2rem", color: "#0F172A", marginBottom: "0.2rem" }}>Sponsored Ads Manager</h1>
          <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
            Promote your store on the CaymanBazaar home page carousel or feature products at top of search results.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn-gold">
          <Plus size={18} /> Launch Sponsored Campaign
        </button>
      </div>

      {/* Campaigns Table */}
      <div style={{ background: "#FFFFFF", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "var(--shadow-sm)", padding: "1.5rem" }}>
        <h3 style={{ fontSize: "1.2rem", color: "#0F172A", marginBottom: "1.25rem" }}>Active Promotion Campaigns</h3>

        {vendorAds.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#94A3B8" }}>No active ad campaigns launched.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                <th style={{ padding: "0.85rem 1rem" }}>Campaign Title</th>
                <th style={{ padding: "0.85rem 1rem" }}>Ad Placement Type</th>
                <th style={{ padding: "0.85rem 1rem" }}>Budget Model</th>
                <th style={{ padding: "0.85rem 1rem" }}>Impressions</th>
                <th style={{ padding: "0.85rem 1rem" }}>Clicks</th>
                <th style={{ padding: "0.85rem 1rem" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {vendorAds.map((ad) => (
                <tr key={ad.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "#0F172A" }}>{ad.title}</td>
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <span className="badge badge-sponsored">
                      {ad.type === "featured_store" ? "Featured Store Banner" : "Sponsored Product"}
                    </span>
                  </td>
                  <td style={{ padding: "0.85rem 1rem", color: "#475569" }}>${ad.daily_budget}/day ({ad.budget_type})</td>
                  <td style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "#0F4C81" }}>
                    <Eye size={14} style={{ marginRight: "4px" }} /> {ad.impressions.toLocaleString()}
                  </td>
                  <td style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "#00A896" }}>
                    <MousePointer size={14} style={{ marginRight: "4px" }} /> {ad.clicks}
                  </td>
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <span className="badge badge-stock">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Ad Modal */}
      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div className="animate-fade-in" style={{ background: "#FFFFFF", borderRadius: "20px", maxWidth: "480px", width: "100%", padding: "2rem", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <h3 style={{ fontSize: "1.3rem", color: "#0F172A", marginBottom: "0.5rem" }}>Create Sponsored Ad</h3>
            <p style={{ fontSize: "0.85rem", color: "#64748B", marginBottom: "1.2rem" }}>
              Boost your store visibility across Grand Cayman visitors and buyers.
            </p>

            <form onSubmit={handleCreateAd} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem", display: "block" }}>Ad Placement Type</label>
                <select value={adType} onChange={(e) => setAdType(e.target.value)}>
                  <option value="featured_store">Featured Store Hero Banner</option>
                  <option value="sponsored_product">Sponsored Product Card</option>
                </select>
              </div>

              {adType === "sponsored_product" && (
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem", display: "block" }}>Select Product to Sponsor</label>
                  <select value={selectedProdId} onChange={(e) => setSelectedProdId(e.target.value)}>
                    {vendorProducts.map((p) => (
                      <option key={p.id} value={p.id}>{p.title} (${p.price} KYD)</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem", display: "block" }}>Campaign Title / Headline</label>
                <input type="text" required value={adTitle} onChange={(e) => setAdTitle(e.target.value)} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem", display: "block" }}>Daily Budget ($KYD)</label>
                  <input type="number" required value={dailyBudget} onChange={(e) => setDailyBudget(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem", display: "block" }}>Billing Type</label>
                  <select value={budgetType} onChange={(e) => setBudgetType(e.target.value)}>
                    <option value="per_day">Per Day</option>
                    <option value="per_click">Per Click ($0.50)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.6rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-gold" style={{ flex: 1 }}>
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
