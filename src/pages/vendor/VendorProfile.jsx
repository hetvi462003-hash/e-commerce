import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import { Settings, Store, MapPin, Clock, ShieldCheck, Share2, Globe } from "lucide-react";

export default function VendorProfile() {
  const { activeVendor, updateVendorProfile } = useMarketplace();

  if (!activeVendor) return null;

  const [storeName, setStoreName] = useState(activeVendor.store_name);
  const [bio, setBio] = useState(activeVendor.bio);
  const [district, setDistrict] = useState(activeVendor.district);
  const [address, setAddress] = useState(activeVendor.address);
  const [hours, setHours] = useState(activeVendor.hours);
  const [logo, setLogo] = useState(activeVendor.logo);
  const [banner, setBanner] = useState(activeVendor.banner);
  const [returnPolicy, setReturnPolicy] = useState(activeVendor.policies?.return_policy || "7-day return policy for unused items in original packaging. Damaged items replaced free.");
  const [pickupPolicy, setPickupPolicy] = useState(activeVendor.policies?.pickup_policy || "Items held at stall for 48 hours with 4-digit PIN.");
  const [payoutInstructions, setPayoutInstructions] = useState(activeVendor.payout_instructions || "Cayman National Bank - Acct #100482910 | Beneficiary: Cayman Artisan Hub Ltd.");
  const [instagram, setInstagram] = useState(activeVendor.social_connections?.instagram || "");

  const handleSave = (e) => {
    e.preventDefault();
    updateVendorProfile(activeVendor.id, {
      store_name: storeName,
      bio,
      district,
      address,
      hours,
      logo,
      banner,
      payout_instructions: payoutInstructions,
      policies: {
        return_policy: returnPolicy,
        pickup_policy: pickupPolicy,
        shipping_policy: "Local Grand Cayman courier delivery available."
      },
      social_connections: {
        ...activeVendor.social_connections,
        instagram
      }
    });
  };

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem", paddingBottom: "5rem", maxWidth: "900px" }}>
      
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#00A896", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>
          <Settings size={16} /> Store Customizer & Settings
        </div>
        <h1 style={{ fontSize: "2.2rem", color: "#0F172A", marginBottom: "0.2rem" }}>My Store Profile & Settings</h1>
        <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
          Customize your storefront appearance, logo, operating hours, payout instructions, and customer return policies.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ background: "#FFFFFF", borderRadius: "20px", border: "1.5px solid #E2E8F0", padding: "2rem", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        
        <div>
          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem", display: "block" }}>Store Name *</label>
          <input type="text" required value={storeName} onChange={(e) => setStoreName(e.target.value)} />
        </div>

        <div>
          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem", display: "block" }}>Store Bio / Tagline</label>
          <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem", display: "block" }}>Grand Cayman District</label>
            <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} />
          </div>

          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem", display: "block" }}>Store Operating Hours & Days</label>
            <input type="text" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="e.g. Mon - Sat (9:00 AM - 6:00 PM)" />
          </div>
        </div>

        <div>
          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem", display: "block" }}>Physical Address / Pickup Spot</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem", display: "block" }}>Logo Image URL</label>
            <input type="url" value={logo} onChange={(e) => setLogo(e.target.value)} />
          </div>

          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem", display: "block" }}>Banner Image URL</label>
            <input type="url" value={banner} onChange={(e) => setBanner(e.target.value)} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem", display: "block" }}>Customer Return & Refund Policy</label>
            <textarea rows={2} value={returnPolicy} onChange={(e) => setReturnPolicy(e.target.value)} placeholder="e.g. 7-day return policy for unopened items." />
          </div>

          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem", display: "block" }}>Reserve for Pickup Policy</label>
            <textarea rows={2} value={pickupPolicy} onChange={(e) => setPickupPolicy(e.target.value)} placeholder="e.g. 48-hour hold duration with 4-digit PIN." />
          </div>
        </div>

        <div>
          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem", display: "block" }}>Payout Instructions & Bank Details (for Wallet Top-ups & Settlements)</label>
          <input
            type="text"
            value={payoutInstructions}
            onChange={(e) => setPayoutInstructions(e.target.value)}
            placeholder="e.g. Butterfield Bank / Cayman National Bank, Branch, Account #"
          />
          <small style={{ color: "#64748B", fontSize: "0.78rem" }}>Used by Platform Admin for wire transfers and monthly wallet invoice reconciliations.</small>
        </div>

        <div>
          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem", display: "block" }}>Instagram Handle</label>
          <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@your_store_handle" />
        </div>

        <button type="submit" className="btn-primary" style={{ padding: "0.85rem", fontSize: "1rem", marginTop: "1rem" }}>
          Save Store Profile Updates
        </button>

      </form>

    </div>
  );
}
