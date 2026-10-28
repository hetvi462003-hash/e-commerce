import React from "react";
import { HelpCircle, Clock, DollarSign, Wallet, ShieldCheck, MessageSquare, Store, Truck } from "lucide-react";

export default function FaqPage() {
  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem", maxWidth: "900px" }}>
      
      <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#00A896", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>
          <HelpCircle size={16} /> Help & Customer Support
        </div>
        <h1 style={{ fontSize: "2.4rem", color: "#0F172A", marginTop: "0.3rem", fontWeight: 900 }}>Marketplace Policy & FAQ</h1>
        <p style={{ color: "#64748B", fontSize: "1rem" }}>
          Everything you need to know about WhatsApp Checkout, Stall Collection, Courier Delivery, and Payment Arrangements.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Q1 */}
        <div style={{ background: "#FFFFFF", padding: "1.75rem", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{ background: "#E6FBF2", color: "#00A896", width: "42px", height: "42px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <MessageSquare size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.15rem", color: "#0F172A", marginBottom: "0.5rem" }}>How does WhatsApp Checkout work?</h3>
              <p style={{ color: "#475569", fontSize: "0.92rem", lineHeight: 1.6 }}>
                Browse vendor stalls, select your items, and click <strong>Submit Order via WhatsApp</strong>. 
                Our platform generates a unique order reference (e.g. <strong>#CB-1042</strong>) and creates a pre-formatted message itemizing your products, quantities, prices, and vendor details. 
                When WhatsApp opens, simply tap <strong>Send</strong> to submit your order request directly to our concierge team.
              </p>
            </div>
          </div>
        </div>

        {/* Q2 */}
        <div style={{ background: "#FFFFFF", padding: "1.75rem", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{ background: "#F0FDFA", color: "#0D9488", width: "42px", height: "42px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Store size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.15rem", color: "#0F172A", marginBottom: "0.5rem" }}>How does Collection at Stall work?</h3>
              <p style={{ color: "#475569", fontSize: "0.92rem", lineHeight: 1.6 }}>
                If you choose "Collection at Stall" during checkout, the vendor prepares your order for in-person pickup at their physical stall counter or boutique on Grand Cayman. 
                You will receive confirmation via WhatsApp when your order status changes to <strong>Ready for Collection</strong>. 
                Simply mention your Order Reference (#CB-XXXX) upon arrival.
              </p>
            </div>
          </div>
        </div>

        {/* Q3 */}
        <div style={{ background: "#FFFFFF", padding: "1.75rem", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{ background: "#EFF6FF", color: "#1D4ED8", width: "42px", height: "42px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Truck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.15rem", color: "#0F172A", marginBottom: "0.5rem" }}>How does Island Courier Delivery work?</h3>
              <p style={{ color: "#475569", fontSize: "0.92rem", lineHeight: 1.6 }}>
                For courier delivery across Grand Cayman (Seven Mile Beach, George Town, West Bay, Bodden Town, etc.), provide your address or hotel room number. 
                The order is packed and dispatched via local island courier. You can pay via Cash on Delivery ($KYD or $USD) or pre-arrange a local bank transfer.
              </p>
            </div>
          </div>
        </div>

        {/* Q4 */}
        <div style={{ background: "#FFFFFF", padding: "1.75rem", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{ background: "#FEF3C7", color: "#D97706", width: "42px", height: "42px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <DollarSign size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.15rem", color: "#0F172A", marginBottom: "0.5rem" }}>What payment methods are supported?</h3>
              <p style={{ color: "#475569", fontSize: "0.92rem", lineHeight: 1.6 }}>
                Under the initial marketplace release, online credit card gateways are excluded. 
                Payment is handled offline through: <strong>Cash on Collection</strong>, <strong>Cash on Delivery</strong>, or <strong>Local Cayman Bank Transfer</strong> (Butterfield Bank / Cayman National Bank). 
                Payment instructions are coordinated directly through the WhatsApp confirmation chat.
              </p>
            </div>
          </div>
        </div>

        {/* Q5 */}
        <div style={{ background: "#FFFFFF", padding: "1.75rem", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{ background: "#FDF2F8", color: "#DB2777", width: "42px", height: "42px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.15rem", color: "#0F172A", marginBottom: "0.5rem" }}>Are products guaranteed authentic?</h3>
              <p style={{ color: "#475569", fontSize: "0.92rem", lineHeight: 1.6 }}>
                Yes! Every vendor registered on CaymanBazaar undergoes review and approval by our platform administrator. 
                Verified merchants display the "Verified Cayman Merchant" badge. All artisanal crafts, Caymanite mineral jewellery, Tortuga rum cakes, and duty-free goods are sourced locally within the Cayman Islands.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
