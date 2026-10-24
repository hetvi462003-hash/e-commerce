import React from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import { Package, Clock, DollarSign, QrCode } from "lucide-react";

export default function AdminOrders() {
  const { orders, formatPrice } = useMarketplace();

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem", paddingBottom: "5rem" }}>
      
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#E5A93C", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>
          <Package size={16} /> Order Governance
        </div>
        <h1 style={{ fontSize: "2.2rem", color: "#0F172A", marginBottom: "0.2rem" }}>Marketplace Order Audits</h1>
        <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
          Real-time global transaction log across all Cayman island vendors.
        </p>
      </div>

      <div style={{ background: "#FFFFFF", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
              <th style={{ padding: "1rem" }}>Order ID</th>
              <th style={{ padding: "1rem" }}>Vendor</th>
              <th style={{ padding: "1rem" }}>Customer</th>
              <th style={{ padding: "1rem" }}>Checkout Mode</th>
              <th style={{ padding: "1rem" }}>Total ($KYD)</th>
              <th style={{ padding: "1rem" }}>Commission Deducted</th>
              <th style={{ padding: "1rem" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((ord) => (
              <tr key={ord.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                <td style={{ padding: "1rem", fontWeight: 700, color: "#0F172A" }}>#{ord.id}</td>
                <td style={{ padding: "1rem", color: "#00A896", fontWeight: 600 }}>{ord.vendor_name}</td>
                <td style={{ padding: "1rem" }}>
                  <div>{ord.customer_name}</div>
                  <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>{ord.customer_phone}</div>
                </td>
                <td style={{ padding: "1rem" }}>
                  {ord.type === "PICKUP" ? (
                    <span className="badge badge-pickup">Pickup (PIN: {ord.pin_code})</span>
                  ) : (
                    <span className="badge badge-cod">COD Courier</span>
                  )}
                </td>
                <td style={{ padding: "1rem", fontWeight: 800 }}>{formatPrice(ord.total_amount)}</td>
                <td style={{ padding: "1rem", color: "#059669", fontWeight: 700 }}>
                  ${ord.commission_amount?.toFixed(2)} KYD
                </td>
                <td style={{ padding: "1rem" }}>
                  <span className="badge" style={{ background: "#E0F2FE", color: "#0284C7" }}>
                    {ord.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
