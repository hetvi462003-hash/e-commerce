import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import {
  Megaphone,
  Sparkles,
  MousePointer,
  Eye,
  CheckCircle2,
  PauseCircle,
  Play,
  TrendingUp,
  Store
} from "lucide-react";

export default function AdminAds() {
  const { ads, showToast, formatPrice } = useMarketplace();
  const [adList, setAdList] = useState([
    ...ads,
    {
      id: "ad-503",
      vendor_id: "v-102",
      vendor_name: "Seven Mile Surf & Watersports",
      type: "featured_store",
      title: "Seven Mile Beach Snorkel Gear & Watersports Shack",
      budget_type: "per_day",
      daily_budget: 15.00,
      balance_credit: 60.00,
      impressions: 2150,
      clicks: 240,
      status: "active"
    },
    {
      id: "ad-504",
      vendor_id: "v-104",
      vendor_name: "Georgetown Duty-Free Gems",
      type: "sponsored_product",
      title: "Genuine Caribbean Larimar & Silver Compass Necklace",
      budget_type: "per_click",
      daily_budget: 8.00,
      balance_credit: 32.00,
      impressions: 1120,
      clicks: 135,
      status: "active"
    }
  ]);

  const toggleAdStatus = (id) => {
    setAdList((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const newStatus = a.status === "active" ? "paused" : "active";
          showToast(`Ad Campaign ${id} status set to ${newStatus}.`);
          return { ...a, status: newStatus };
        }
        return a;
      })
    );
  };

  const totalImpressions = adList.reduce((acc, a) => acc + (a.impressions || 0), 0);
  const totalClicks = adList.reduce((acc, a) => acc + (a.clicks || 0), 0);
  const totalAdRevenue = adList.reduce((acc, a) => acc + (a.daily_budget * 5 || 0), 0);

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem", paddingBottom: "5rem" }}>
      
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#F59E0B", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>
          <Megaphone size={16} /> Sponsored Placements
        </div>
        <h1 style={{ fontSize: "2.2rem", color: "#0F172A", marginBottom: "0.2rem" }}>Platform Ads Management</h1>
        <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
          Govern sponsored store promotions, manage paid homepage carousel slots, and inspect vendor ad billing credits.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
        
        <div style={{ background: "#FFFFFF", padding: "1.5rem", borderRadius: "18px", border: "1px solid #E2E8F0", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600, textTransform: "uppercase" }}>Total Ad Revenue Earned</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#00A896", marginTop: "0.2rem" }}>
            ${totalAdRevenue.toFixed(2)} KYD
          </div>
          <div style={{ fontSize: "0.78rem", color: "#64748B", marginTop: "0.3rem" }}>Platform ad billing pool</div>
        </div>

        <div style={{ background: "#FFFFFF", padding: "1.5rem", borderRadius: "18px", border: "1px solid #E2E8F0", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600, textTransform: "uppercase" }}>Total Served Impressions</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#0F172A", marginTop: "0.2rem" }}>
            {totalImpressions.toLocaleString()}
          </div>
          <div style={{ fontSize: "0.78rem", color: "#166534", marginTop: "0.3rem" }}>Across all visitor views</div>
        </div>

        <div style={{ background: "#FFFFFF", padding: "1.5rem", borderRadius: "18px", border: "1px solid #E2E8F0", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600, textTransform: "uppercase" }}>Total Sponsored Clicks</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#F59E0B", marginTop: "0.2rem" }}>
            {totalClicks.toLocaleString()}
          </div>
          <div style={{ fontSize: "0.78rem", color: "#B45309", marginTop: "0.3rem" }}>Average CTR: {((totalClicks / (totalImpressions || 1)) * 100).toFixed(1)}%</div>
        </div>

        <div style={{ background: "#FFFFFF", padding: "1.5rem", borderRadius: "18px", border: "1px solid #E2E8F0", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600, textTransform: "uppercase" }}>Active Campaigns</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#0F4C81", marginTop: "0.2rem" }}>
            {adList.filter((a) => a.status === "active").length} Live
          </div>
          <div style={{ fontSize: "0.78rem", color: "#64748B", marginTop: "0.3rem" }}>{adList.length} total campaigns</div>
        </div>

      </div>

      {/* Campaigns Table */}
      <div style={{ background: "#FFFFFF", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
              <th style={{ padding: "1rem" }}>Campaign & Merchant</th>
              <th style={{ padding: "1rem" }}>Placement Type</th>
              <th style={{ padding: "1rem" }}>Budget Model</th>
              <th style={{ padding: "1rem" }}>Impressions</th>
              <th style={{ padding: "1rem" }}>Clicks (CTR)</th>
              <th style={{ padding: "1rem" }}>Credit Balance</th>
              <th style={{ padding: "1rem" }}>Status</th>
              <th style={{ padding: "1rem", textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {adList.map((ad) => (
              <tr key={ad.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                <td style={{ padding: "1rem" }}>
                  <div style={{ fontWeight: 700, color: "#0F172A" }}>{ad.title}</div>
                  <div style={{ fontSize: "0.78rem", color: "#00A896" }}>{ad.vendor_name} ({ad.id})</div>
                </td>

                <td style={{ padding: "1rem" }}>
                  <span
                    style={{
                      background: ad.type === "featured_store" ? "#FEF3C7" : "#E0F2FE",
                      color: ad.type === "featured_store" ? "#B45309" : "#0284C7",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: 800
                    }}
                  >
                    {ad.type === "featured_store" ? "Featured Store" : "Sponsored Product"}
                  </span>
                </td>

                <td style={{ padding: "1rem", color: "#475569" }}>
                  ${ad.daily_budget?.toFixed(2)} KYD / {ad.budget_type === "per_day" ? "Day" : "Click"}
                </td>

                <td style={{ padding: "1rem", color: "#0F172A", fontWeight: 600 }}>
                  {ad.impressions?.toLocaleString()}
                </td>

                <td style={{ padding: "1rem", color: "#0F172A", fontWeight: 600 }}>
                  {ad.clicks} ({((ad.clicks / (ad.impressions || 1)) * 100).toFixed(1)}%)
                </td>

                <td style={{ padding: "1rem", fontWeight: 800, color: "#00A896" }}>
                  ${ad.balance_credit?.toFixed(2)} KYD
                </td>

                <td style={{ padding: "1rem" }}>
                  <span
                    style={{
                      background: ad.status === "active" ? "#DCFCE7" : "#FEE2E2",
                      color: ad.status === "active" ? "#166534" : "#991B1B",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: 800
                    }}
                  >
                    {ad.status === "active" ? "Live" : "Paused"}
                  </span>
                </td>

                <td style={{ padding: "1rem", textAlign: "right" }}>
                  <button
                    onClick={() => toggleAdStatus(ad.id)}
                    style={{
                      background: ad.status === "active" ? "#FEE2E2" : "#DCFCE7",
                      color: ad.status === "active" ? "#991B1B" : "#166534",
                      padding: "0.35rem 0.8rem",
                      borderRadius: "8px",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    {ad.status === "active" ? "Pause Ad" : "Activate Ad"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
