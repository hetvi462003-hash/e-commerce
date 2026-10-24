import React from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import { Wallet, ArrowDownRight, ArrowUpRight, Download } from "lucide-react";
import { downloadCsv } from "../../utils/exportCsv";

export default function AdminWalletLedger() {
  const { ledger, vendors, formatPrice, showToast } = useMarketplace();

  const handleExportCsv = () => {
    const headers = ["Ledger ID", "Vendor Store", "Date", "Type", "Description", "Amount (KYD)", "Order Ref"];
    const rows = ledger.map((tx) => {
      const vendorObj = vendors.find((v) => v.id === tx.vendor_id);
      return [
        tx.id,
        vendorObj?.store_name || tx.vendor_id,
        new Date(tx.created_at || Date.now()).toLocaleDateString(),
        tx.type,
        tx.description,
        tx.amount > 0 ? `+${tx.amount.toFixed(2)}` : tx.amount.toFixed(2),
        tx.order_id || "N/A"
      ];
    });

    downloadCsv("CaymanBazaar_Global_Platform_Ledger", headers, rows);
    showToast(`Exported ${ledger.length} global platform transactions to CSV!`, "success");
  };

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem", paddingBottom: "5rem" }}>
      
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#E5A93C", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>
            <Wallet size={16} /> Audit Control
          </div>
          <h1 style={{ fontSize: "2.2rem", color: "#0F172A", marginBottom: "0.2rem" }}>Global Platform Wallet Ledger</h1>
          <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
            Complete audit trail of merchant top-up deposits and platform order commission deductions.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="btn-gold"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.2rem", borderRadius: "12px", fontSize: "0.88rem", fontWeight: 800 }}
        >
          <Download size={16} /> Export Global Ledger (.CSV)
        </button>
      </div>

      <div style={{ background: "#FFFFFF", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
              <th style={{ padding: "1rem" }}>Ledger ID</th>
              <th style={{ padding: "1rem" }}>Vendor</th>
              <th style={{ padding: "1rem" }}>Date</th>
              <th style={{ padding: "1rem" }}>Type</th>
              <th style={{ padding: "1rem" }}>Description</th>
              <th style={{ padding: "1rem", textAlign: "right" }}>Amount ($KYD)</th>
            </tr>
          </thead>
          <tbody>
            {ledger.map((tx) => {
              const vendorObj = vendors.find((v) => v.id === tx.vendor_id);
              const isDeposit = tx.amount > 0;
              return (
                <tr key={tx.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "1rem", fontWeight: 700, color: "#0F172A" }}>{tx.id}</td>
                  <td style={{ padding: "1rem", fontWeight: 600, color: "#0F4C81" }}>
                    {vendorObj?.store_name || tx.vendor_id}
                  </td>
                  <td style={{ padding: "1rem", color: "#64748B" }}>{new Date(tx.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: "1rem" }}>
                    {isDeposit ? (
                      <span className="badge badge-stock"><ArrowUpRight size={12} /> Deposit</span>
                    ) : (
                      <span className="badge badge-out-stock"><ArrowDownRight size={12} /> Commission</span>
                    )}
                  </td>
                  <td style={{ padding: "1rem", color: "#334155" }}>{tx.description}</td>
                  <td style={{ padding: "1rem", textAlign: "right", fontWeight: 800, color: isDeposit ? "#166534" : "#DC2626" }}>
                    {isDeposit ? `+${tx.amount.toFixed(2)}` : `${tx.amount.toFixed(2)}`} KYD
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
