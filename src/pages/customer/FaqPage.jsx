import React from "react";
import { HelpCircle, Clock, DollarSign, Wallet, ShieldCheck, QrCode } from "lucide-react";

export default function FaqPage() {
  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem", maxWidth: "900px" }}>
      
      <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#00A896", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>
          <HelpCircle size={16} /> Help & Documentation Center
        </div>
        <h1 style={{ fontSize: "2.4rem", color: "#0F172A", marginTop: "0.3rem" }}>Marketplace Policy & FAQ</h1>
        <p style={{ color: "#64748B", fontSize: "1rem" }}>
          Everything you need to know about Reserve for Pickup PINs, Cash on Delivery, and Vendor Wallet rules.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Q1 */}
        <div style={{ background: "#FFFFFF", padding: "1.75rem", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{ background: "#FEF3C7", color: "#D97706", width: "42px", height: "42px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <QrCode size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.15rem", color: "#0F172A", marginBottom: "0.5rem" }}>How does 4-Digit PIN & QR Store Pickup work?</h3>
              <p style={{ color: "#475569", fontSize: "0.92rem", lineHeight: 1.6 }}>
                When you choose "Reserve for Store Pickup" at checkout, our system reserves your selected items and generates a unique 4-digit PIN code (e.g. 4829) and QR Pass. 
                The vendor holds the item at their Cayman physical store for 24–48 hours. Upon arrival, simply show your PIN/QR code to the store clerk, who will input it into their Vendor Portal to verify and complete your purchase.
              </p>
            </div>
          </div>
        </div>

        {/* Q2 */}
        <div style={{ background: "#FFFFFF", padding: "1.75rem", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{ background: "#EFF6FF", color: "#1D4ED8", width: "42px", height: "42px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <DollarSign size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.15rem", color: "#0F172A", marginBottom: "0.5rem" }}>How does Cash on Delivery (COD) work?</h3>
              <p style={{ color: "#475569", fontSize: "0.92rem", lineHeight: 1.6 }}>
                Cash on Delivery allows you to place an order without entering any credit card details online. The vendor packs your item and dispatches it via local Cayman courier. You pay the exact order total in cash ($KYD or $USD) directly to the delivery driver upon receiving your package at your hotel, condo, or home address.
              </p>
            </div>
          </div>
        </div>

        {/* Q3 */}
        <div style={{ background: "#FFFFFF", padding: "1.75rem", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{ background: "#ECFDF5", color: "#059669", width: "42px", height: "42px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Wallet size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.15rem", color: "#0F172A", marginBottom: "0.5rem" }}>How do Vendor Wallets & Platform Commissions work?</h3>
              <p style={{ color: "#475569", fontSize: "0.92rem", lineHeight: 1.6 }}>
                Because customers pay cash directly to vendors (offline), CaymanBazaar uses a pre-paid Vendor Wallet system. 
                Vendors maintain a credit balance in their wallet. When an order is marked <strong>Completed</strong> (via PIN verification or courier drop), the platform automatically deducts the platform commission (e.g. 10%) from the vendor's wallet balance. 
                If a vendor's wallet balance drops to $0 or lower, their store products are automatically hidden from the public catalog until they top up their wallet balance.
              </p>
            </div>
          </div>
        </div>

        {/* Q4 */}
        <div style={{ background: "#FFFFFF", padding: "1.75rem", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{ background: "#FDF2F8", color: "#DB2777", width: "42px", height: "42px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.15rem", color: "#0F172A", marginBottom: "0.5rem" }}>Are products guaranteed authentic?</h3>
              <p style={{ color: "#475569", fontSize: "0.92rem", lineHeight: 1.6 }}>
                Yes! Every vendor registered on CaymanBazaar undergoes verification by our platform admin. Verified merchants display the "Verified Cayman Merchant" badge. All artisanal crafts, Caymanite minerals, rum cakes, and duty-free luxury items are sourced locally within the Cayman Islands.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
