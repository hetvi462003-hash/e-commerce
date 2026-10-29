import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import { Share2, Camera, Globe, MessageCircle, CheckCircle2, Save, ExternalLink } from "lucide-react";

export default function VendorSocial() {
  const { activeVendor, updateVendorProfile, showToast } = useMarketplace();

  const [instagram, setInstagram] = useState(activeVendor?.social_connections?.instagram || "");
  const [facebook, setFacebook] = useState(activeVendor?.social_connections?.facebook || "");
  const [whatsapp, setWhatsapp] = useState(activeVendor?.phone || "");
  const [isSaving, setIsSaving] = useState(false);

  if (!activeVendor) return null;

  const handleSaveSocials = (e) => {
    e.preventDefault();
    setIsSaving(true);

    if (updateVendorProfile) {
      updateVendorProfile(activeVendor.id, {
        phone: whatsapp.trim() || activeVendor.phone,
        social_connections: {
          instagram: instagram.trim(),
          facebook: facebook.trim()
        }
      });
    }

    setTimeout(() => {
      setIsSaving(false);
      showToast("Storefront social media channels updated successfully!", "success");
    }, 400);
  };

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem", paddingBottom: "5rem", maxWidth: "980px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#00A896", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>
          <Share2 size={16} /> Store Connectivity
        </div>
        <h1 style={{ fontSize: "2.2rem", color: "#0F172A", marginBottom: "0.2rem" }}>Social Media & Channels</h1>
        <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
          Connect your official Instagram handle, Facebook page, and WhatsApp concierge. These links will appear directly on your customer storefront.
        </p>
      </div>

      <form onSubmit={handleSaveSocials}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          
          {/* Instagram */}
          <div style={{ background: "#FFFFFF", padding: "1.75rem", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div style={{ background: "#FDF2F8", color: "#DB2777", width: "42px", height: "42px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Camera size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: "1.05rem", color: "#0F172A", fontWeight: 700 }}>Instagram Store</h4>
                <div style={{ fontSize: "0.75rem", color: "#64748B" }}>Public handle on your store</div>
              </div>
            </div>

            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
              Instagram Handle
            </label>
            <input
              type="text"
              placeholder="@your_store_handle"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                borderRadius: "10px",
                border: "1.5px solid #CBD5E1",
                fontSize: "0.88rem",
                marginBottom: "0.75rem"
              }}
            />
            {instagram && (
              <a
                href={`https://instagram.com/${instagram.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: "0.75rem", color: "#DB2777", display: "inline-flex", alignItems: "center", gap: "0.25rem", textDecoration: "none", fontWeight: 600 }}
              >
                <span>Preview: instagram.com/{instagram.replace("@", "")}</span>
                <ExternalLink size={11} />
              </a>
            )}
          </div>

          {/* Facebook */}
          <div style={{ background: "#FFFFFF", padding: "1.75rem", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div style={{ background: "#EFF6FF", color: "#1D4ED8", width: "42px", height: "42px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Globe size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: "1.05rem", color: "#0F172A", fontWeight: 700 }}>Facebook Page</h4>
                <div style={{ fontSize: "0.75rem", color: "#64748B" }}>Link to your Facebook store</div>
              </div>
            </div>

            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
              Facebook Page URL / Username
            </label>
            <input
              type="text"
              placeholder="e.g. https://facebook.com/yourstore"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                borderRadius: "10px",
                border: "1.5px solid #CBD5E1",
                fontSize: "0.88rem",
                marginBottom: "0.75rem"
              }}
            />
          </div>

          {/* WhatsApp Direct */}
          <div style={{ background: "#FFFFFF", padding: "1.75rem", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div style={{ background: "#DCFCE7", color: "#15803D", width: "42px", height: "42px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MessageCircle size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: "1.05rem", color: "#0F172A", fontWeight: 700 }}>WhatsApp Concierge</h4>
                <div style={{ fontSize: "0.75rem", color: "#64748B" }}>Direct customer inquiry number</div>
              </div>
            </div>

            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
              WhatsApp Phone Number *
            </label>
            <input
              type="text"
              required
              placeholder="+1 (345) 949-XXXX"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                borderRadius: "10px",
                border: "1.5px solid #CBD5E1",
                fontSize: "0.88rem",
                marginBottom: "0.75rem"
              }}
            />
          </div>

        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary"
          style={{ padding: "0.85rem 1.75rem", fontSize: "0.95rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Save size={18} />
          <span>{isSaving ? "Saving Changes..." : "Save Storefront Channels"}</span>
        </button>
      </form>
    </div>
  );
}
