import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import {
  TrendingUp,
  BarChart3,
  Download,
  Calendar,
  FileSpreadsheet,
  Building2,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";

import { downloadCsv } from "../../utils/exportCsv";

export default function AdminReports() {
  const { vendors, orders, ledger, formatPrice, showToast } = useMarketplace();
  const [reportMonth, setReportMonth] = useState("October 2026");

  const completedOrders = orders.filter((o) => o.status === "Completed");
  const totalGMV = completedOrders.reduce((acc, o) => acc + o.total_amount, 0);
  const platformCommissions = completedOrders.reduce((acc, o) => acc + (o.commission_amount || 0), 0);

  // Dynamic District Breakdown calculated from live orders
  const districtMap = {};
  completedOrders.forEach((o) => {
    const vendorObj = vendors.find((v) => v.id === o.vendor_id);
    const dist = vendorObj?.district || "Georgetown";
    if (!districtMap[dist]) {
      districtMap[dist] = { district: dist, sales: 0, orders: 0, comm: 0 };
    }
    districtMap[dist].sales += o.total_amount || 0;
    districtMap[dist].orders += 1;
    districtMap[dist].comm += o.commission_amount || ((o.total_amount || 0) * 0.1);
  });

  const districtData = Object.values(districtMap).length > 0
    ? Object.values(districtMap)
    : [
        { district: "Seven Mile Beach", sales: 0, orders: 0, comm: 0 },
        { district: "Georgetown", sales: 0, orders: 0, comm: 0 }
      ];

  const handleExport = (type) => {
    if (type === "CSV") {
      const headers = ["District", "Sales Volume ($KYD)", "Completed Orders", "10% Platform Commission ($KYD)"];
      const rows = districtData.map((d) => [
        d.district,
        d.sales.toFixed(2),
        d.orders,
        d.comm.toFixed(2)
      ]);
      downloadCsv(`CaymanBazaar_Financial_Report_${reportMonth.replace(/\s+/g, "_")}`, headers, rows);
      showToast(`Exported ${reportMonth} Cayman Marketplace Financial Summary (CSV)`, "success");
    } else {
      window.print();
    }
  };

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem", paddingBottom: "5rem" }}>
      
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#F59E0B", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>
            <TrendingUp size={16} /> Financial Analytics
          </div>
          <h1 style={{ fontSize: "2.2rem", color: "#0F172A", marginBottom: "0.2rem" }}>Revenue & Commission Reports</h1>
          <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
            Audit marketplace gross merchandise volume (GMV), automated 10% commission ledgers, and district performance.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
          <select
            value={reportMonth}
            onChange={(e) => setReportMonth(e.target.value)}
            style={{ width: "auto", background: "#FFFFFF", fontWeight: 700, color: "#0F172A" }}
          >
            <option>October 2026 (Current Cycle)</option>
            <option>September 2026</option>
            <option>August 2026</option>
          </select>

          <button onClick={() => handleExport("PDF")} className="btn-outline">
            <Download size={15} /> Export PDF
          </button>
          <button onClick={() => handleExport("CSV")} className="btn-gold">
            <FileSpreadsheet size={15} /> Export Ledger CSV
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
        
        <div style={{ background: "#FFFFFF", padding: "1.5rem", borderRadius: "20px", border: "1px solid #E2E8F0", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600, textTransform: "uppercase" }}>Monthly Platform GMV</div>
          <div style={{ fontSize: "2rem", fontWeight: 900, color: "#0F172A", marginTop: "0.2rem" }}>
            ${totalGMV.toFixed(2)} KYD
          </div>
          <div style={{ fontSize: "0.78rem", color: "#166534", marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "0.2rem" }}>
            <ArrowUpRight size={14} /> +18.4% vs last billing cycle
          </div>
        </div>

        <div style={{ background: "#FFFFFF", padding: "1.5rem", borderRadius: "20px", border: "1px solid #E2E8F0", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600, textTransform: "uppercase" }}>10% Platform Revenue</div>
          <div style={{ fontSize: "2rem", fontWeight: 900, color: "#00A896", marginTop: "0.2rem" }}>
            ${platformCommissions.toFixed(2)} KYD
          </div>
          <div style={{ fontSize: "0.78rem", color: "#00A896", marginTop: "0.4rem" }}>
            Earned from fulfilled orders
          </div>
        </div>

        <div style={{ background: "#FFFFFF", padding: "1.5rem", borderRadius: "20px", border: "1px solid #E2E8F0", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600, textTransform: "uppercase" }}>Registered Vendors</div>
          <div style={{ fontSize: "2rem", fontWeight: 900, color: "#F59E0B", marginTop: "0.2rem" }}>
            {vendors.length} Active
          </div>
          <div style={{ fontSize: "0.78rem", color: "#B45309", marginTop: "0.4rem" }}>
            Licensed Island Artisans
          </div>
        </div>

        <div style={{ background: "#FFFFFF", padding: "1.5rem", borderRadius: "20px", border: "1px solid #E2E8F0", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600, textTransform: "uppercase" }}>Monthly Invoices</div>
          <div style={{ fontSize: "2rem", fontWeight: 900, color: "#0F4C81", marginTop: "0.2rem" }}>
            {vendors.length} Generated
          </div>
          <div style={{ fontSize: "0.78rem", color: "#64748B", marginTop: "0.4rem" }}>
            Cycle 1st of month • 14-day terms
          </div>
        </div>

      </div>

      {/* District Revenue Breakdown Table */}
      <div style={{ background: "#FFFFFF", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "var(--shadow-sm)", padding: "1.75rem", marginBottom: "2.5rem" }}>
        <h3 style={{ fontSize: "1.2rem", color: "#0F172A", marginBottom: "1.25rem" }}>Island District Performance Breakdown</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
              <th style={{ padding: "0.85rem 1rem" }}>District</th>
              <th style={{ padding: "0.85rem 1rem" }}>Gross Merchandise Value (GMV)</th>
              <th style={{ padding: "0.85rem 1rem" }}>Orders Fulfilled</th>
              <th style={{ padding: "0.85rem 1rem" }}>Marketplace 10% Commission</th>
              <th style={{ padding: "0.85rem 1rem", textAlign: "right" }}>Share of Island Volume</th>
            </tr>
          </thead>
          <tbody>
            {districtData.map((d, idx) => {
              const share = ((d.sales / 1850) * 100).toFixed(1);
              return (
                <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "1rem", fontWeight: 700, color: "#0F172A" }}>📍 {d.district}</td>
                  <td style={{ padding: "1rem", fontWeight: 700 }}>${d.sales.toFixed(2)} KYD</td>
                  <td style={{ padding: "1rem", color: "#64748B" }}>{d.orders} orders</td>
                  <td style={{ padding: "1rem", color: "#00A896", fontWeight: 700 }}>+${d.comm.toFixed(2)} KYD</td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: "80px", height: "8px", background: "#E2E8F0", borderRadius: "999px", overflow: "hidden" }}>
                        <div style={{ width: `${share}%`, height: "100%", background: "#00BFA5" }} />
                      </div>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>{share}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
