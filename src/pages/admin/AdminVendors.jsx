import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import { CAYMAN_DISTRICTS } from "../../data/mockData";
import {
  Store,
  CheckCircle2,
  XCircle,
  Wallet,
  ShieldCheck,
  MapPin,
  PlusCircle,
  X,
  Building2,
  Sparkles
} from "lucide-react";

export default function AdminVendors() {
  const { vendors, toggleVendorVerification, registerVendor, approveVendor, rejectVendor } = useMarketplace();
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);

  const pendingVendors = vendors.filter((v) => v.status === "pending_approval");

  const [formData, setFormData] = useState({
    store_name: "",
    store_type: "Artisan Boutique",
    owner_name: "",
    email: "",
    phone: "",
    district: "Georgetown",
    address: "",
    specialty: "",
    bio: "",
    wallet_balance: 100
  });

  const handleOnboardSubmit = (e) => {
    e.preventDefault();
    if (!formData.store_name.trim()) return;

    registerVendor({
      ...formData,
      store_type: formData.store_type || "Island Boutique",
      address: formData.address || `${formData.district} Commercial Promenade, Grand Cayman`
    });

    setIsOnboardModalOpen(false);
    setFormData({
      store_name: "",
      store_type: "Artisan Boutique",
      owner_name: "",
      email: "",
      phone: "",
      district: "Georgetown",
      address: "",
      specialty: "",
      bio: "",
      wallet_balance: 100
    });
  };

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem", paddingBottom: "5rem" }}>
      
      {/* Header with Admin Action */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem",
          marginBottom: "2rem"
        }}
      >
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#F59E0B", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>
            <Store size={16} /> Merchant Governance & Approvals
          </div>
          <h1 style={{ fontSize: "2.2rem", color: "#0F172A", marginBottom: "0.2rem" }}>Vendor Directory & Verifications</h1>
          <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
            Verify Cayman Island merchant licenses, manage commission rates, and approve new applicant stores.
          </p>
        </div>

        {/* Admin Button: Onboard New Merchant */}
        <button
          onClick={() => setIsOnboardModalOpen(true)}
          className="btn-gold"
          style={{
            padding: "0.75rem 1.4rem",
            borderRadius: "12px",
            fontSize: "0.9rem",
            fontWeight: 800,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer"
          }}
        >
          <PlusCircle size={17} />
          <span>Onboard New Merchant</span>
        </button>
      </div>

      {/* ⏳ PENDING APPROVAL APPLICATIONS QUEUE */}
      {pendingVendors.length > 0 && (
        <div style={{ background: "#FEF3C7", border: "1.5px solid #F59E0B", borderRadius: "16px", padding: "1.5rem", marginBottom: "2rem", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.8rem", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span style={{ background: "#D97706", color: "#FFFFFF", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem" }}>
                {pendingVendors.length}
              </span>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#92400E" }}>
                Pending Island Merchant Registrations Awaiting Approval
              </h3>
            </div>
            <span style={{ fontSize: "0.78rem", color: "#B45309", fontWeight: 700 }}>
              🛡️ Cayman Islands Trade Standards Enforcement
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {pendingVendors.map((pv) => (
              <div
                key={pv.id}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #FCD34D",
                  borderRadius: "12px",
                  padding: "1rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "1rem"
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <strong style={{ fontSize: "1rem", color: "#0F172A" }}>{pv.store_name}</strong>
                    <span style={{ background: "#FEF3C7", color: "#B45309", padding: "0.2rem 0.55rem", borderRadius: "6px", fontSize: "0.72rem", fontWeight: 800 }}>
                      {pv.store_type || "Boutique"}
                    </span>
                    <span style={{ color: "#64748B", fontSize: "0.78rem" }}>• {pv.district}</span>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#475569", marginTop: "0.25rem" }}>
                    Owner: <strong>{pv.owner_name}</strong> • Phone: {pv.phone} • Email: {pv.email}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#64748B", marginTop: "0.2rem" }}>
                    Specialty: {pv.specialty} • Address: {pv.address}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.6rem" }}>
                  <button
                    onClick={() => approveVendor(pv.id)}
                    className="btn-primary"
                    style={{ padding: "0.5rem 1rem", fontSize: "0.84rem", fontWeight: 800 }}
                  >
                    <CheckCircle2 size={15} /> Approve & Activate Store
                  </button>
                  <button
                    onClick={() => rejectVendor(pv.id)}
                    style={{
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      color: "#DC2626",
                      padding: "0.5rem 0.85rem",
                      borderRadius: "10px",
                      fontSize: "0.84rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    <XCircle size={15} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Vendor Directory Table */}
      <div style={{ background: "#FFFFFF", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
              <th style={{ padding: "1rem" }}>Vendor Store</th>
              <th style={{ padding: "1rem" }}>Owner / Contact</th>
              <th style={{ padding: "1rem" }}>District</th>
              <th style={{ padding: "1rem" }}>Commission Rate</th>
              <th style={{ padding: "1rem" }}>Status</th>
              <th style={{ padding: "1rem", textAlign: "right" }}>Actions / Verification</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => {
              const isPending = v.status === "pending_approval";
              return (
                <tr key={v.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                      <img src={v.logo} alt={v.store_name} style={{ width: "42px", height: "42px", borderRadius: "10px", objectFit: "cover" }} />
                      <div>
                        <div style={{ fontWeight: 700, color: "#0F172A" }}>{v.store_name}</div>
                        <div style={{ fontSize: "0.78rem", color: "#64748B" }}>{v.store_type || v.district || "Boutique"}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: "1rem" }}>
                    <div>{v.owner_name}</div>
                    <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>{v.phone}</div>
                  </td>

                  <td style={{ padding: "1rem", color: "#475569" }}>
                    <MapPin size={13} color="#00A896" style={{ marginRight: "4px" }} /> {v.district}
                  </td>

                  <td style={{ padding: "1rem", fontWeight: 800, color: "#00A896" }}>
                    {Number((v.commission_rate || 0.1) * 100).toFixed(0)}% Flat Take
                  </td>

                  <td style={{ padding: "1rem" }}>
                    {isPending ? (
                      <span style={{ background: "#FEF3C7", color: "#B45309", padding: "0.25rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 800, border: "1px solid #FCD34D" }}>
                        ⏳ Pending Approval
                      </span>
                    ) : v.status === "inactive" ? (
                      <span className="badge badge-out-stock">Inactive</span>
                    ) : (
                      <span className="badge badge-stock">Active</span>
                    )}
                  </td>

                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    {isPending ? (
                      <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                        <button
                          onClick={() => approveVendor(v.id)}
                          className="btn-primary"
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.78rem", fontWeight: 800 }}
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => rejectVendor(v.id)}
                          style={{
                            background: "rgba(239, 68, 68, 0.1)",
                            color: "#DC2626",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            padding: "0.35rem 0.65rem",
                            borderRadius: "8px",
                            fontSize: "0.78rem",
                            cursor: "pointer",
                            fontWeight: 700
                          }}
                        >
                          ✕ Reject
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => toggleVendorVerification(v.id)}
                        className={v.verified ? "btn-outline" : "btn-gold"}
                        style={{ padding: "0.35rem 0.8rem", fontSize: "0.8rem", borderRadius: "8px", cursor: "pointer" }}
                      >
                        {v.verified ? (
                          <>
                            <CheckCircle2 size={14} color="#0284C7" /> Verified
                          </>
                        ) : (
                          "Verify Merchant"
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Admin Onboard Modal */}
      {isOnboardModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(3, 7, 18, 0.75)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem"
          }}
          onClick={() => setIsOnboardModalOpen(false)}
        >
          <div
            style={{
              background: "#081325",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "540px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.7)",
              color: "#FFFFFF"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "1.5rem 1.75rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div>
                <span style={{ fontSize: "0.75rem", color: "#F59E0B", fontWeight: 700, textTransform: "uppercase" }}>
                  Platform Admin Console
                </span>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginTop: "0.2rem", color: "#FFFFFF" }}>
                  Onboard & Approve New Store
                </h3>
              </div>
              <button
                onClick={() => setIsOnboardModalOpen(false)}
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#94A3B8",
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleOnboardSubmit} style={{ padding: "1.75rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#CBD5E1", marginBottom: "0.35rem", fontWeight: 600 }}>
                    Store / Boutique Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Seven Mile Conch Crafts"
                    value={formData.store_name}
                    onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                    style={{
                      width: "100%",
                      background: "#050B14",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#FFFFFF",
                      padding: "0.7rem 0.9rem",
                      borderRadius: "10px",
                      fontSize: "0.88rem"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#CBD5E1", marginBottom: "0.35rem", fontWeight: 600 }}>
                    Store Category / Type
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Artisan Boutique, Gourmet Shop"
                    value={formData.store_type}
                    onChange={(e) => setFormData({ ...formData, store_type: e.target.value })}
                    style={{
                      width: "100%",
                      background: "#050B14",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#FFFFFF",
                      padding: "0.7rem 0.9rem",
                      borderRadius: "10px",
                      fontSize: "0.88rem"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#CBD5E1", marginBottom: "0.35rem", fontWeight: 600 }}>
                    Owner Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Miller"
                    value={formData.owner_name}
                    onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                    style={{
                      width: "100%",
                      background: "#050B14",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#FFFFFF",
                      padding: "0.7rem 0.9rem",
                      borderRadius: "10px",
                      fontSize: "0.88rem"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#CBD5E1", marginBottom: "0.35rem", fontWeight: 600 }}>
                    Island District
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    style={{
                      width: "100%",
                      background: "#050B14",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#FFFFFF",
                      padding: "0.7rem 0.9rem",
                      borderRadius: "10px",
                      fontSize: "0.88rem"
                    }}
                  >
                    {CAYMAN_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#CBD5E1", marginBottom: "0.35rem", fontWeight: 600 }}>
                  Specialty
                </label>
                <input
                  type="text"
                  placeholder="e.g. Caribbean Sea Glass, Coconut Soaps"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  style={{
                    width: "100%",
                    background: "#050B14",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#FFFFFF",
                    padding: "0.7rem 0.9rem",
                    borderRadius: "10px",
                    fontSize: "0.88rem"
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#CBD5E1", marginBottom: "0.35rem", fontWeight: 600 }}>
                  Platform Commission Rate (%)
                </label>
                <input
                  type="number"
                  value={formData.commission_rate ? formData.commission_rate * 100 : 10}
                  onChange={(e) => setFormData({ ...formData, commission_rate: Number(e.target.value) / 100 })}
                  style={{
                    width: "100%",
                    background: "#050B14",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#00E5C9",
                    fontWeight: 700,
                    padding: "0.7rem 0.9rem",
                    borderRadius: "10px",
                    fontSize: "0.88rem"
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-gold"
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  borderRadius: "12px",
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  cursor: "pointer"
                }}
              >
                Approve & Add Store to Platform
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
