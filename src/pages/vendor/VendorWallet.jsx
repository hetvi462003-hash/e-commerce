import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import { Wallet, PlusCircle, ArrowDownRight, ArrowUpRight, Download, AlertCircle, FileText } from "lucide-react";
import { downloadCsv } from "../../utils/exportCsv";

export default function VendorWallet() {
  const { activeVendor, ledger, topupVendorWallet, formatPrice, showToast } = useMarketplace();
  const [topupAmount, setTopupAmount] = useState(100);
  const [isTopupOpen, setIsTopupOpen] = useState(false);

  if (!activeVendor) return null;

  const vendorLedger = ledger.filter((l) => l.vendor_id === activeVendor.id);
  const isSuspended = activeVendor.wallet_balance <= 0;
  const isNearDepletion = activeVendor.wallet_balance > 0 && activeVendor.wallet_balance < 25;

  const handleTopupSubmit = (e) => {
    e.preventDefault();
    topupVendorWallet(activeVendor.id, topupAmount);
    setIsTopupOpen(false);
  };

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
            <Wallet size={16} /> Financial Control
          </div>
          <h1 style={{ fontSize: "2.2rem", color: "#0F172A", marginBottom: "0.2rem" }}>Wallet & Platform Ledger</h1>
          <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
            Pre-paid wallet credit balance, completed order commission deductions, and monthly billing invoices.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.8rem" }}>
          <button onClick={handleExportCsv} className="btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <Download size={16} /> Export Statement (.CSV)
          </button>
          <button onClick={() => setIsTopupOpen(true)} className="btn-gold">
            <PlusCircle size={16} /> Top-Up Wallet Balance
          </button>
        </div>
      </div>

      {/* Wallet Card */}
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
          <div style={{ fontSize: "0.82rem", color: "#CBD5E1", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>
            Current Wallet Credit Balance
          </div>
          <div style={{ fontSize: "2.8rem", fontWeight: 900, color: isSuspended ? "#FF6B6B" : "#F59E0B" }}>
            ${activeVendor.wallet_balance.toFixed(2)} KYD
          </div>
          <div style={{ fontSize: "0.85rem", color: "#CBD5E1", marginTop: "0.4rem" }}>
            Platform Commission Rate: <strong>{(activeVendor.commission_rate * 100).toFixed(0)}%</strong> per completed sale
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", padding: "1.25rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.15)", maxWidth: "340px" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.3rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <AlertCircle size={16} color="#F59E0B" /> Wallet Auto-Hide Policy Rule
          </div>
          <p style={{ fontSize: "0.78rem", color: "#CBD5E1", lineHeight: 1.45 }}>
            Because customers pay cash offline, commission is automatically deducted from your wallet balance upon order completion. If wallet balance falls to $0 or lower, store products are auto-hidden.
          </p>
        </div>
      </div>

      {/* Wallet Ledger Table */}
      <div style={{ background: "#FFFFFF", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "var(--shadow-sm)", padding: "1.5rem" }}>
        <h3 style={{ fontSize: "1.2rem", color: "#0F172A", marginBottom: "1.25rem" }}>Wallet Transaction History</h3>

        {vendorLedger.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>No ledger transactions recorded yet.</div>
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
                        <span className="badge badge-stock"><ArrowUpRight size={12} /> Deposit</span>
                      ) : (
                        <span className="badge badge-out-stock"><ArrowDownRight size={12} /> Commission</span>
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

      {/* Top-Up Modal */}
      {isTopupOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div className="animate-fade-in" style={{ background: "#FFFFFF", borderRadius: "20px", maxWidth: "420px", width: "100%", padding: "2rem", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <h3 style={{ fontSize: "1.3rem", color: "#0F172A", marginBottom: "0.5rem" }}>Top-Up Vendor Wallet Credit</h3>
            <p style={{ fontSize: "0.85rem", color: "#64748B", marginBottom: "1.5rem" }}>
              Add credit to maintain active product listings and pay platform commissions.
            </p>

            <form onSubmit={handleTopupSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem", display: "block" }}>Select Preset Credit Amount ($KYD)</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginBottom: "1rem" }}>
                  {[50, 100, 250].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopupAmount(amt)}
                      style={{
                        background: topupAmount === amt ? "#00A896" : "#F8FAFC",
                        color: topupAmount === amt ? "#FFFFFF" : "#0F172A",
                        border: topupAmount === amt ? "1.5px solid #00A896" : "1.5px solid #CBD5E1",
                        padding: "0.6rem",
                        borderRadius: "10px",
                        fontWeight: 700,
                        fontSize: "0.9rem"
                      }}
                    >
                      ${amt} KYD
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem", display: "block" }}>Custom Top-Up Amount</label>
                <input type="number" required value={topupAmount} onChange={(e) => setTopupAmount(Number(e.target.value))} />
              </div>

              <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setIsTopupOpen(false)} className="btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-gold" style={{ flex: 1 }}>
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
