import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import { CAYMAN_DISTRICTS } from "../../data/mockData";
import {
  Settings,
  Store,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Image,
  Camera,
  Globe,
  Building,
  CreditCard,
  Share2,
  Save,
  ExternalLink,
  FileText,
  Sparkles,
  Star,
  ShoppingBag
} from "lucide-react";

export default function VendorProfile({ setActiveTab, setSelectedVendor }) {
  const { activeVendor, updateVendorProfile, showToast } = useMarketplace();

  if (!activeVendor) return null;

  const [storeName, setStoreName] = useState(activeVendor.store_name || "");
  const [bio, setBio] = useState(activeVendor.bio || "");
  const [district, setDistrict] = useState(activeVendor.district || "Georgetown");
  const [address, setAddress] = useState(activeVendor.address || "");
  const [hours, setHours] = useState(activeVendor.hours || activeVendor.operating_hours || "Mon - Sat: 9:00 AM - 6:00 PM");
  const [logo, setLogo] = useState(activeVendor.logo || "");
  const [banner, setBanner] = useState(activeVendor.banner || activeVendor.photo || "/cayman_market_promenade.jpg");
  const [returnPolicy, setReturnPolicy] = useState(
    activeVendor.policies?.return_policy || "7-day return policy for unused items in original packaging. Damaged items replaced free."
  );
  const [pickupPolicy, setPickupPolicy] = useState(() => {
    const p = activeVendor.policies?.pickup_policy;
    if (!p || p.includes("PIN") || p.includes("QR") || p.includes("pin") || p.includes("qr")) {
      return "Items held at stall counter for collection. Please mention your order reference (#CB-XXXX) upon arrival.";
    }
    return p;
  });
  const [payoutInstructions, setPayoutInstructions] = useState(
    activeVendor.payout_instructions || "Butterfield Bank (Cayman) - Account #100482910 | Beneficiary: " + (activeVendor.owner_name || activeVendor.store_name)
  );
  const [instagram, setInstagram] = useState(activeVendor.social_connections?.instagram || "@georgetown_gems_ky");

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);

    updateVendorProfile(activeVendor.id, {
      store_name: storeName.trim(),
      bio: bio.trim(),
      district,
      address: address.trim(),
      hours: hours.trim(),
      operating_hours: hours.trim(),
      logo: logo.trim(),
      banner: banner.trim(),
      photo: banner.trim(),
      payout_instructions: payoutInstructions.trim(),
      policies: {
        return_policy: returnPolicy.trim(),
        pickup_policy: pickupPolicy.trim(),
        shipping_policy: "Local Grand Cayman courier delivery available."
      },
      social_connections: {
        ...activeVendor.social_connections,
        instagram: instagram.trim()
      }
    });

    setTimeout(() => {
      setIsSaving(false);
      showToast("Stall profile and storefront appearance saved successfully!", "success");
    }, 300);
  };

  const handlePreviewPublicStore = () => {
    if (setSelectedVendor) {
      setSelectedVendor(activeVendor);
    }
    if (setActiveTab) {
      setActiveTab("store-detail");
    }
  };

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", paddingBottom: "6rem" }}>
      
      {/* 1. LUXURY TOP COMMAND HEADER */}
      <div
        style={{
          background: "linear-gradient(135deg, #071529 0%, #0D2545 100%)",
          borderBottom: "1px solid rgba(0, 229, 201, 0.25)",
          padding: "2.5rem 1.5rem 2.25rem",
          color: "#FFFFFF",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
        }}
      >
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(0, 229, 201, 0.12)", border: "1px solid rgba(0, 229, 201, 0.35)", padding: "0.3rem 0.8rem", borderRadius: "999px", color: "#00E5C9", fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>
                <Store size={14} /> {activeVendor.stall_number || "Craft Stall"} • Stall Management Hub
              </div>
              <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFFFFF", margin: 0, letterSpacing: "-0.01em" }}>
                Stall Customizer & Profile Settings
              </h1>
              <p style={{ color: "#94A3B8", fontSize: "0.92rem", marginTop: "0.4rem", maxWidth: "620px", lineHeight: 1.5 }}>
                Customize your Grand Cayman digital storefront, showcase artisanal branding, manage pickup hours, and configure direct offline bank transfer instructions.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handlePreviewPublicStore}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#FFFFFF",
                  padding: "0.65rem 1.25rem",
                  borderRadius: "12px",
                  fontSize: "0.86rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  transition: "all 0.2s"
                }}
              >
                <span>View Live Storefront</span>
                <ExternalLink size={14} color="#00E5C9" />
              </button>

              <button
                type="button"
                onClick={handleSave}
                style={{
                  background: "linear-gradient(135deg, #00E5C9 0%, #00A896 100%)",
                  color: "#050B14",
                  border: "none",
                  padding: "0.65rem 1.4rem",
                  borderRadius: "12px",
                  fontSize: "0.86rem",
                  fontWeight: 900,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  boxShadow: "0 4px 15px rgba(0, 229, 201, 0.35)",
                  transition: "all 0.2s"
                }}
              >
                <Save size={15} />
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE: TWO COLUMN BALANCED LAYOUT */}
      <div className="container" style={{ padding: "2.5rem 1.5rem" }}>
        
        <form onSubmit={handleSave}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "2rem", alignItems: "start" }}>
            
            {/* LEFT COLUMN: SPACIOUS ORGANIZED SETTINGS CARDS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              
              {/* Card 1: Brand Identity & Location */}
              <div style={{ background: "#FFFFFF", borderRadius: "20px", border: "1.5px solid #E2E8F0", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem", borderBottom: "1px solid #F1F5F9", paddingBottom: "0.85rem" }}>
                  <div style={{ background: "#E6FBF2", color: "#00A896", width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Store size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                      Stall Identity & Story
                    </h3>
                    <p style={{ fontSize: "0.78rem", color: "#64748B", margin: 0 }}>
                      Public store name, district, and bio presented to island shoppers
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  
                  {/* Store Name */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                      Store / Stall Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="e.g. Georgetown Duty-Free Gems"
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        borderRadius: "12px",
                        border: "1.5px solid #CBD5E1",
                        fontSize: "0.92rem",
                        fontWeight: 600,
                        color: "#0F172A",
                        outline: "none",
                        background: "#F8FAFC"
                      }}
                    />
                  </div>

                  {/* Bio / Tagline */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                      Storefront Bio / Artisan Story
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Describe your craft specialties, local Cayman materials, and what makes your booth unique..."
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        borderRadius: "12px",
                        border: "1.5px solid #CBD5E1",
                        fontSize: "0.88rem",
                        color: "#0F172A",
                        lineHeight: 1.55,
                        outline: "none",
                        background: "#F8FAFC",
                        resize: "vertical"
                      }}
                    />
                  </div>

                  {/* District & Operating Hours Row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                        Grand Cayman District *
                      </label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem",
                          borderRadius: "12px",
                          border: "1.5px solid #CBD5E1",
                          fontSize: "0.88rem",
                          fontWeight: 700,
                          color: "#0F172A",
                          outline: "none",
                          background: "#F8FAFC",
                          cursor: "pointer"
                        }}
                      >
                        {CAYMAN_DISTRICTS.map((d) => (
                          <option key={d} value={d}>
                            📍 {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                        Store Operating Hours
                      </label>
                      <input
                        type="text"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        placeholder="e.g. Mon - Sat: 9:00 AM - 6:00 PM"
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem",
                          borderRadius: "12px",
                          border: "1.5px solid #CBD5E1",
                          fontSize: "0.88rem",
                          color: "#0F172A",
                          outline: "none",
                          background: "#F8FAFC"
                        }}
                      />
                    </div>
                  </div>

                  {/* Physical Address */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                      Physical Address / Stall Counter Spot
                    </label>
                    <div style={{ position: "relative" }}>
                      <MapPin size={16} color="#00A896" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. Harbour Drive, Suite 201, Cruise Port Walkway, Georgetown"
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem 0.75rem 2.4rem",
                          borderRadius: "12px",
                          border: "1.5px solid #CBD5E1",
                          fontSize: "0.88rem",
                          color: "#0F172A",
                          outline: "none",
                          background: "#F8FAFC"
                        }}
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Card 2: Visual Media & Storefront Imagery */}
              <div style={{ background: "#FFFFFF", borderRadius: "20px", border: "1.5px solid #E2E8F0", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem", borderBottom: "1px solid #F1F5F9", paddingBottom: "0.85rem" }}>
                  <div style={{ background: "#EFF6FF", color: "#1D4ED8", width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Camera size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                      Storefront Imagery & Badging
                    </h3>
                    <p style={{ fontSize: "0.78rem", color: "#64748B", margin: 0 }}>
                      Stall logo avatar and panoramic banner image displayed on marketplace directories
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  
                  {/* Banner Image with Visual Preview */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                      Storefront Panoramic Banner Image
                    </label>
                    
                    <div style={{ height: "130px", borderRadius: "14px", overflow: "hidden", marginBottom: "0.75rem", border: "1.5px solid #CBD5E1", background: "#050B14", position: "relative" }}>
                      <img
                        src={banner || "/cayman_market_promenade.jpg"}
                        alt="Banner Preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => { e.currentTarget.src = "/cayman_market_promenade.jpg"; }}
                      />
                      <div style={{ position: "absolute", bottom: "8px", right: "10px", background: "rgba(5, 11, 20, 0.8)", backdropFilter: "blur(4px)", color: "#FFFFFF", fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.5rem", borderRadius: "6px" }}>
                        Live Banner Preview
                      </div>
                    </div>

                    <input
                      type="text"
                      value={banner}
                      onChange={(e) => setBanner(e.target.value)}
                      placeholder="/cayman_duty_free_boutique.jpg or https://images.unsplash.com/..."
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        borderRadius: "10px",
                        border: "1.5px solid #CBD5E1",
                        fontSize: "0.82rem",
                        color: "#0F172A",
                        outline: "none",
                        background: "#F8FAFC"
                      }}
                    />
                    <small style={{ color: "#64748B", fontSize: "0.74rem", display: "block", marginTop: "3px" }}>
                      Recommended: 1200 x 400px panoramic island photography or stall booth image.
                    </small>
                  </div>

                  {/* Logo Image with Circular Thumbnail Preview */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                      Stall Logo / Circular Avatar
                    </label>

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.6rem" }}>
                      <div style={{ width: "64px", height: "64px", borderRadius: "16px", overflow: "hidden", border: "2px solid #00A896", background: "#091322", flexShrink: 0, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                        <img
                          src={logo || "https://images.unsplash.com/photo-1541643600914-78b084683601?w=150"}
                          alt="Logo Preview"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1541643600914-78b084683601?w=150"; }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <input
                          type="text"
                          value={logo}
                          onChange={(e) => setLogo(e.target.value)}
                          placeholder="Logo image URL or SVG graphic string"
                          style={{
                            width: "100%",
                            padding: "0.65rem 0.85rem",
                            borderRadius: "10px",
                            border: "1.5px solid #CBD5E1",
                            fontSize: "0.82rem",
                            color: "#0F172A",
                            outline: "none",
                            background: "#F8FAFC"
                          }}
                        />
                        <small style={{ color: "#64748B", fontSize: "0.74rem", display: "block", marginTop: "3px" }}>
                          Square 1:1 image or brand icon (e.g. 200 x 200px).
                        </small>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Card 3: Bank Details & Offline Settlements */}
              <div style={{ background: "#FFFFFF", borderRadius: "20px", border: "1.5px solid #E2E8F0", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem", borderBottom: "1px solid #F1F5F9", paddingBottom: "0.85rem" }}>
                  <div style={{ background: "#FEF3C7", color: "#D97706", width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                      Bank Transfer & Direct Payouts
                    </h3>
                    <p style={{ fontSize: "0.78rem", color: "#64748B", margin: 0 }}>
                      Cayman banking instructions provided to customers paying offline via WhatsApp
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                      Local Cayman Bank Account Instructions *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={payoutInstructions}
                      onChange={(e) => setPayoutInstructions(e.target.value)}
                      placeholder="e.g. Cayman National Bank / Butterfield Bank&#10;Account #: 100482910&#10;Beneficiary: Island Artisan Boutique Ltd."
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        borderRadius: "12px",
                        border: "1.5px solid #CBD5E1",
                        fontSize: "0.88rem",
                        color: "#0F172A",
                        lineHeight: 1.5,
                        outline: "none",
                        background: "#F8FAFC",
                        fontFamily: "monospace"
                      }}
                    />
                  </div>

                  <div style={{ background: "rgba(0, 168, 150, 0.08)", border: "1px solid rgba(0, 168, 150, 0.25)", borderRadius: "12px", padding: "0.85rem 1rem", fontSize: "0.8rem", color: "#0F766E", lineHeight: 1.45 }}>
                    💡 <strong>How offline payments work in Cayman Islands:</strong> When customers order on WhatsApp and choose "Local Bank Transfer", these wire details are shared in the chat so funds land directly in your Cayman account.
                  </div>
                </div>
              </div>

              {/* Card 4: Policies & Social Connections */}
              <div style={{ background: "#FFFFFF", borderRadius: "20px", border: "1.5px solid #E2E8F0", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem", borderBottom: "1px solid #F1F5F9", paddingBottom: "0.85rem" }}>
                  <div style={{ background: "#F3E8FF", color: "#7E22CE", width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                      Customer Policies & Social Handles
                    </h3>
                    <p style={{ fontSize: "0.78rem", color: "#64748B", margin: 0 }}>
                      Stall collection instructions, warranty terms, and Instagram showcase
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  
                  {/* Return Policy */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                      Customer Return & Refund Terms
                    </label>
                    <textarea
                      rows={2}
                      value={returnPolicy}
                      onChange={(e) => setReturnPolicy(e.target.value)}
                      placeholder="e.g. 7-day return policy for unopened items in original packaging."
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        borderRadius: "12px",
                        border: "1.5px solid #CBD5E1",
                        fontSize: "0.88rem",
                        color: "#0F172A",
                        lineHeight: 1.5,
                        outline: "none",
                        background: "#F8FAFC"
                      }}
                    />
                  </div>

                  {/* Stall Collection Policy */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                      Stall Counter Collection Instructions
                    </label>
                    <textarea
                      rows={2}
                      value={pickupPolicy}
                      onChange={(e) => setPickupPolicy(e.target.value)}
                      placeholder="e.g. Items held at stall counter. Present your Order Reference (#CB-XXXX) upon pickup."
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        borderRadius: "12px",
                        border: "1.5px solid #CBD5E1",
                        fontSize: "0.88rem",
                        color: "#0F172A",
                        lineHeight: 1.5,
                        outline: "none",
                        background: "#F8FAFC"
                      }}
                    />
                  </div>

                  {/* Instagram Handle */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                      Official Instagram Handle
                    </label>
                    <div style={{ position: "relative" }}>
                      <Share2 size={16} color="#E1306C" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                      <input
                        type="text"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="@georgetown_gems_ky"
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem 0.75rem 2.4rem",
                          borderRadius: "12px",
                          border: "1.5px solid #CBD5E1",
                          fontSize: "0.88rem",
                          color: "#0F172A",
                          fontWeight: 600,
                          outline: "none",
                          background: "#F8FAFC"
                        }}
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Big Bottom Save Button */}
              <button
                type="submit"
                style={{
                  background: "linear-gradient(135deg, #00E5C9 0%, #00A896 100%)",
                  color: "#050B14",
                  border: "none",
                  padding: "1rem 2rem",
                  borderRadius: "14px",
                  fontSize: "1rem",
                  fontWeight: 900,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  boxShadow: "0 6px 20px rgba(0, 229, 201, 0.4)",
                  transition: "all 0.2s"
                }}
              >
                <Save size={18} />
                <span>{isSaving ? "Saving Store Profile..." : "Save Store Profile & Publish Changes"}</span>
              </button>

            </div>

            {/* RIGHT COLUMN: STICKY LIVE STOREFRONT PREVIEW */}
            <div style={{ position: "sticky", top: "100px" }}>
              
              <div style={{ background: "#FFFFFF", borderRadius: "20px", border: "1.5px solid #E2E8F0", padding: "1.5rem", boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
                
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#00A896", textTransform: "uppercase", letterSpacing: "0.05em", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    <Sparkles size={13} /> Live Customer Storefront Preview
                  </div>
                  <span style={{ background: "#DCFCE7", color: "#15803D", fontSize: "0.7rem", fontWeight: 800, padding: "0.15rem 0.5rem", borderRadius: "999px" }}>
                    ● Instant Sync
                  </span>
                </div>

                {/* Replica of Luxury Store Card */}
                <div
                  style={{
                    borderRadius: "18px",
                    overflow: "hidden",
                    border: "1.5px solid #E2E8F0",
                    background: "#FFFFFF",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.06)"
                  }}
                >
                  {/* Banner */}
                  <div style={{ height: "150px", position: "relative", overflow: "hidden", background: "#050B14" }}>
                    <img
                      src={banner || "/cayman_market_promenade.jpg"}
                      alt={storeName}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => { e.currentTarget.src = "/cayman_market_promenade.jpg"; }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(5,11,20,0.15) 0%, rgba(5,11,20,0.7) 100%)" }} />

                    <div style={{ position: "absolute", top: "10px", left: "10px" }}>
                      <span style={{ background: "rgba(5, 11, 20, 0.85)", border: "1px solid rgba(245, 158, 11, 0.4)", color: "#FDE68A", fontSize: "0.72rem", fontWeight: 800, padding: "0.2rem 0.6rem", borderRadius: "6px" }}>
                        {activeVendor.stall_number || "Stall #01"}
                      </span>
                    </div>

                    <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                      <span style={{ background: "rgba(5, 11, 20, 0.85)", color: "#10B981", fontSize: "0.7rem", fontWeight: 800, padding: "0.22rem 0.6rem", borderRadius: "999px", display: "inline-flex", alignItems: "center", gap: "0.3rem", border: "1px solid rgba(16, 185, 129, 0.4)" }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981" }}></span> Open Pavilion
                      </span>
                    </div>
                  </div>

                  {/* Stall Profile Details */}
                  <div style={{ padding: "1.25rem", paddingTop: 0 }}>
                    
                    {/* Avatar & Rating Row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "-30px", marginBottom: "0.75rem" }}>
                      <img
                        src={logo || "https://images.unsplash.com/photo-1541643600914-78b084683601?w=150"}
                        alt={storeName}
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "16px",
                          border: "3px solid #FFFFFF",
                          objectFit: "cover",
                          background: "#050B14",
                          boxShadow: "0 6px 16px rgba(0,0,0,0.15)"
                        }}
                        onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1541643600914-78b084683601?w=150"; }}
                      />
                      <div style={{ background: "#FEF3C7", color: "#B45309", padding: "0.25rem 0.65rem", borderRadius: "8px", fontSize: "0.78rem", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "0.3rem", border: "1px solid #FDE68A" }}>
                        <Star size={12} fill="#B45309" /> 5.0 (Verified)
                      </div>
                    </div>

                    {/* Store Title */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.25rem" }}>
                      <h4 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                        {storeName || "My Stall Name"}
                      </h4>
                      <CheckCircle2 size={15} color="#00A896" />
                    </div>

                    {/* District & Location */}
                    <div style={{ fontSize: "0.78rem", color: "#64748B", display: "flex", alignItems: "center", gap: "0.3rem", marginBottom: "0.6rem" }}>
                      <MapPin size={12} color="#00A896" />
                      <span>{district}, Grand Cayman</span>
                    </div>

                    {/* Bio */}
                    <p style={{ fontSize: "0.82rem", color: "#475569", lineHeight: 1.45, marginBottom: "0.9rem" }}>
                      {bio || "Artisanal specialty goods, handcrafted souvenirs, and Caribbean treasures."}
                    </p>

                    {/* Badges */}
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.9rem" }}>
                      <span style={{ fontSize: "0.7rem", color: "#00A896", background: "#E6FBF2", padding: "0.2rem 0.55rem", borderRadius: "6px", fontWeight: 800 }}>
                        🏪 Stall Collection
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "#1D4ED8", background: "#EFF6FF", padding: "0.2rem 0.55rem", borderRadius: "6px", fontWeight: 800 }}>
                        🚚 Island Courier COD
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "#D97706", background: "#FEF3C7", padding: "0.2rem 0.55rem", borderRadius: "6px", fontWeight: 800 }}>
                        🏦 Bank Transfer
                      </span>
                    </div>

                    {/* Hours */}
                    <div style={{ fontSize: "0.76rem", color: "#64748B", display: "flex", alignItems: "center", gap: "0.35rem", borderTop: "1px solid #F1F5F9", paddingTop: "0.75rem", marginBottom: "1rem" }}>
                      <Clock size={12} />
                      <span>{hours}</span>
                    </div>

                    <button
                      type="button"
                      onClick={handlePreviewPublicStore}
                      style={{
                        width: "100%",
                        background: "#0A1C36",
                        color: "#FFFFFF",
                        border: "none",
                        padding: "0.65rem",
                        borderRadius: "10px",
                        fontWeight: 800,
                        fontSize: "0.82rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.4rem"
                      }}
                    >
                      <span>Preview Full Pavilion Page</span>
                      <ExternalLink size={13} color="#00E5C9" />
                    </button>

                  </div>

                </div>

                <div style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.76rem", color: "#94A3B8" }}>
                  Changes saved here immediately update your listing on the CaymanBazaar homepage and directory.
                </div>

              </div>

            </div>

          </div>
        </form>

      </div>

    </div>
  );
}
