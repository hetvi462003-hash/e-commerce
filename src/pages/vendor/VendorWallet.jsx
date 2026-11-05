import React from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import { Wallet, ArrowDownRight, ArrowUpRight, Download, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { downloadCsv } from "../../utils/exportCsv";

export default function VendorWallet() {
  const { activeVendor, ledger, formatPrice, showToast } = useMarketplace();

  if (!activeVendor) return null;

  const vendorLedger = ledger.filter((l) => l.vendor_id === activeVendor.id);

  const handleExportCsv = () => {
    const headers = ["Transaction ID", "Date", "Type", "Description", "Amount (KYD)", "Order Reference"];
    const rows = vendorLedger.map((tx) => [
      tx.id,
      new Date(tx.created_at || Date.now()).toLocaleDateString(),
      tx.type,
      tx.description,
      tx.amount > 0 ? `+${tx.amount.toFixed(2)}` : tx.amount.toFixed(2),
      tx.order_id || "N/A"
    ]);

    const sanitizedStoreName = activeVendor.store_name.replace(/[^a-zA-Z0-9]/g, "_");
    downloadCsv(`CaymanBazaar_${sanitizedStoreName}_Ledger_Statement`, headers, rows);
    showToast(`Exported ${vendorLedger.length} ledger transactions to CSV!`, "success");
  };

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem", paddingBottom: "5rem" }}>
      
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#00A896", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>
            <Wallet size={16} /> Direct Sales & Financial Ledger
          </div>
          <h1 style={{ fontSize: "2.2rem", color: "#0F172A", marginBottom: "0.2rem" }}>Store Settlement & Ledger</h1>
          <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
            Direct customer WhatsApp transactions, 0% platform commission policy, and financial audit reports.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.8rem" }}>
          <button onClick={handleExportCsv} className="btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <Download size={16} /> Export Statement (.CSV)
          </button>
        </div>
      </div>

      {/* 0% Commission & No Credit Required Card */}
      <div
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #0F4C81 100%)",
          color: "#FFFFFF",
          borderRadius: "20px",
          padding: "2rem",
          boxShadow: "var(--shadow-md)",
          marginBottom: "2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem"
        }}
      >
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(16, 185, 129, 0.2)", border: "1px solid rgba(16, 185, 129, 0.4)", padding: "0.25rem 0.75rem", borderRadius: "999px", color: "#34D399", fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "0.75rem" }}>
            <CheckCircle2 size={14} /> 0% Platform Commission
          </div>
          <div style={{ fontSize: "2.8rem", fontWeight: 900, color: "#F59E0B", lineHeight: 1.1 }}>
            100% Direct Sales
          </div>
          <div style={{ fontSize: "0.9rem", color: "#CBD5E1", marginTop: "0.6rem" }}>
            Store Credit Policy: <strong style={{ color: "#34D399" }}>Waived</strong> (No wallet pre-payment or deposit required)
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)", padding: "1.25rem 1.5rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.15)", maxWidth: "380px" }}>
          <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Sparkles size={16} color="#F59E0B" /> Direct Merchant Payment Policy
          </div>
          <p style={{ fontSize: "0.82rem", color: "#E2E8F0", lineHeight: 1.5, margin: 0 }}>
            Cayman Bazaar operates with <strong>0% take-rate commissions</strong> and <strong>no credit deduction fees</strong>. Customers place orders directly via WhatsApp and pay your store via Cash-on-Delivery, in-store pickup, or direct bank transfer.
          </p>
        </div>
      </div>

      {/* Wallet Ledger Table */}
      <div style={{ background: "#FFFFFF", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "var(--shadow-sm)", padding: "1.5rem" }}>
        <h3 style={{ fontSize: "1.2rem", color: "#0F172A", marginBottom: "1.25rem" }}>Financial Transaction History</h3>

        {vendorLedger.length === 0 ? (
          <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "#94A3B8" }}>
            <Wallet size={36} style={{ margin: "0 auto 0.75rem", opacity: 0.5 }} />
            <div style={{ fontWeight: 700, color: "#475569", fontSize: "1rem" }}>No fee transactions or commission deductions</div>
            <div style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>All customer orders are paid directly to your store with 100% revenue retention.</div>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                <th style={{ padding: "0.85rem 1rem" }}>Transaction ID</th>
                <th style={{ padding: "0.85rem 1rem" }}>Date</th>
                <th style={{ padding: "0.85rem 1rem" }}>Type</th>
                <th style={{ padding: "0.85rem 1rem" }}>Description</th>
                <th style={{ padding: "0.85rem 1rem", textAlign: "right" }}>Amount ($KYD)</th>
              </tr>
            </thead>
            <tbody>
              {vendorLedger.map((tx) => {
                const isDeposit = tx.amount > 0;
                return (
                  <tr key={tx.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "#0F172A" }}>{tx.id}</td>
                    <td style={{ padding: "0.85rem 1rem", color: "#64748B" }}>{new Date(tx.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      {isDeposit ? (
                        <span className="badge badge-stock"><ArrowUpRight size={12} /> Revenue</span>
                      ) : (
                        <span className="badge badge-out-stock"><ArrowDownRight size={12} /> Direct Settlement</span>
                      )}
                    </td>
                    <td style={{ padding: "0.85rem 1rem", color: "#334155" }}>{tx.description}</td>
                    <td style={{ padding: "0.85rem 1rem", textAlign: "right", fontWeight: 800, color: isDeposit ? "#166534" : "#DC2626" }}>
                      {isDeposit ? `+${tx.amount.toFixed(2)}` : `${tx.amount.toFixed(2)}`} KYD
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

    </div>
  );
}
