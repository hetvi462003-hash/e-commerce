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
  Sparkles,
  Edit,
  Phone,
  Package,
  Layers
} from "lucide-react";

export default function AdminVendors() {
  const {
    vendors,
    products = [],
    toggleVendorVerification,
    registerVendor,
    approveVendor,
    rejectVendor,
    updateVendorProfile,
    showToast
  } = useMarketplace();
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);

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
    product_limit: 25,
    wallet_balance: 0
  });

  const [editFormData, setEditFormData] = useState({
    store_name: "",
    owner_name: "",
    phone: "",
    email: "",
    district: "Georgetown",
    address: "",
    store_type: "",
    specialty: "",
    bio: "",
    product_limit: 25,
    status: "active",
    verified: true
  });

  const openEditModal = (vendor) => {
    setEditingVendor(vendor);
    setEditFormData({
      store_name: vendor.store_name || "",
      owner_name: vendor.owner_name || "",
      phone: vendor.phone || vendor.whatsapp_number || "",
      email: vendor.email || "",
      district: vendor.district || "Georgetown",
      address: vendor.address || "",
      store_type: vendor.store_type || "Island Boutique",
      specialty: vendor.specialty || "",
      bio: vendor.bio || "",
      product_limit: vendor.product_limit || 25,
      status: vendor.status || "active",
      verified: Boolean(vendor.verified)
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingVendor) return;

    updateVendorProfile(editingVendor.id, {
      ...editFormData,
      product_limit: parseInt(editFormData.product_limit) || 25,
      whatsapp_number: editFormData.phone
    });

    setIsEditModalOpen(false);
    setEditingVendor(null);
    showToast(`Updated "${editFormData.store_name}" profile & product limits!`, "success");
  };

  const handleOnboardSubmit = (e) => {
    e.preventDefault();
    if (!formData.store_name.trim()) return;

    registerVendor({
      ...formData,
      product_limit: parseInt(formData.product_limit) || 25,
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
      product_limit: 25,
      wallet_balance: 0
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
              <th style={{ padding: "1rem" }}>Owner / WhatsApp</th>
              <th style={{ padding: "1rem" }}>District</th>
              <th style={{ padding: "1rem" }}>Product Upload Limit</th>
              <th style={{ padding: "1rem" }}>Status</th>
              <th style={{ padding: "1rem", textAlign: "right" }}>Management & Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => {
              const isPending = v.status === "pending_approval";
              const vendorProdCount = products.filter((p) => p.vendor_id === v.id).length;
              const limit = v.product_limit || 25;
              const isLimitReached = vendorProdCount >= limit;

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
                    <div style={{ fontWeight: 600, color: "#0F172A" }}>{v.owner_name}</div>
                    <div style={{ fontSize: "0.78rem", color: "#00A896", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginTop: "2px", fontWeight: 700 }}>
                      <Phone size={12} /> {v.phone || v.whatsapp_number || "Not specified"}
                    </div>
                  </td>

                  <td style={{ padding: "1rem", color: "#475569" }}>
                    <MapPin size={13} color="#00A896" style={{ marginRight: "4px" }} /> {v.district}
                  </td>

                  <td style={{ padding: "1rem" }}>
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      background: isLimitReached ? "#FEF2F2" : "#F0FDFA",
                      border: `1px solid ${isLimitReached ? "#FCA5A5" : "#CCFBF1"}`,
                      color: isLimitReached ? "#DC2626" : "#0F766E",
                      padding: "0.25rem 0.65rem",
                      borderRadius: "8px",
                      fontWeight: 800,
                      fontSize: "0.82rem"
                    }}>
                      <Package size={13} /> {vendorProdCount} / {limit} Listed
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#64748B", marginTop: "2px" }}>
                      Max Allowed: {limit}
                    </div>
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
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                        <button
                          onClick={() => openEditModal(v)}
                          style={{
                            background: "#F8FAFC",
                            border: "1.5px solid #CBD5E1",
                            color: "#0F172A",
                            padding: "0.35rem 0.75rem",
                            fontSize: "0.8rem",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 700,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem"
                          }}
                          title="Edit Store Profile, WhatsApp & Upload Limit"
                        >
                          <Edit size={13} /> Edit Store
                        </button>

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
                            "Verify"
                          )}
                        </button>
                      </div>
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#CBD5E1", marginBottom: "0.35rem", fontWeight: 600 }}>
                    Store WhatsApp Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+1 (345) 949-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                    Contact Email
                  </label>
                  <input
                    type="email"
                    placeholder="merchant@caymanbazaar.ky"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  Product Upload Limit (Max Products)
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.product_limit || 25}
                  onChange={(e) => setFormData({ ...formData, product_limit: parseInt(e.target.value) || 25 })}
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

      {/* Admin Edit Vendor Profile & Limit Modal */}
      {isEditModalOpen && editingVendor && (
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
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            style={{
              background: "#081325",
              border: "1.5px solid rgba(0, 168, 150, 0.4)",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "600px",
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
                <span style={{ fontSize: "0.75rem", color: "#00E5C9", fontWeight: 700, textTransform: "uppercase" }}>
                  Platform Admin Merchant Governance
                </span>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginTop: "0.2rem", color: "#FFFFFF" }}>
                  Edit Store Profile & Product Limits
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
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

            <form onSubmit={handleEditSubmit} style={{ padding: "1.75rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#CBD5E1", marginBottom: "0.35rem", fontWeight: 600 }}>
                    Store Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.store_name}
                    onChange={(e) => setEditFormData({ ...editFormData, store_name: e.target.value })}
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
                    Owner Full Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.owner_name}
                    onChange={(e) => setEditFormData({ ...editFormData, owner_name: e.target.value })}
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
                    Dedicated WhatsApp Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
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

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#CBD5E1", marginBottom: "0.35rem", fontWeight: 600 }}>
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
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
                    Island District
                  </label>
                  <select
                    value={editFormData.district}
                    onChange={(e) => setEditFormData({ ...editFormData, district: e.target.value })}
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

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#CBD5E1", marginBottom: "0.35rem", fontWeight: 600 }}>
                    Store Category / Specialty
                  </label>
                  <input
                    type="text"
                    value={editFormData.specialty}
                    onChange={(e) => setEditFormData({ ...editFormData, specialty: e.target.value })}
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

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#CBD5E1", marginBottom: "0.35rem", fontWeight: 600 }}>
                  Physical Address
                </label>
                <input
                  type="text"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.2rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#CBD5E1", marginBottom: "0.35rem", fontWeight: 700 }}>
                    Product Upload Limit (Max Products)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={editFormData.product_limit}
                    onChange={(e) => setEditFormData({ ...editFormData, product_limit: parseInt(e.target.value) || 1 })}
                    style={{
                      width: "100%",
                      background: "#050B14",
                      border: "1.5px solid #00E5C9",
                      color: "#00E5C9",
                      fontWeight: 800,
                      padding: "0.7rem 0.9rem",
                      borderRadius: "10px",
                      fontSize: "1rem"
                    }}
                  />
                  <small style={{ color: "#94A3B8", fontSize: "0.74rem" }}>
                    Sets max items vendor can add or bulk import.
                  </small>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#CBD5E1", marginBottom: "0.35rem", fontWeight: 600 }}>
                    Store Operating Status
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
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
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                    <option value="pending_approval">Pending Approval</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", background: "rgba(255, 255, 255, 0.05)", padding: "0.8rem 1rem", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                <input
                  type="checkbox"
                  id="verified-checkbox"
                  checked={editFormData.verified}
                  onChange={(e) => setEditFormData({ ...editFormData, verified: e.target.checked })}
                  style={{ width: "18px", height: "18px", accentColor: "#00A896" }}
                />
                <label htmlFor="verified-checkbox" style={{ fontSize: "0.86rem", color: "#FFFFFF", fontWeight: 600, cursor: "pointer" }}>
                  Verified Cayman Islands Merchant (Display Blue Verification Badge)
                </label>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  borderRadius: "12px",
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  cursor: "pointer"
                }}
              >
                Save Store Profile & Limit Changes
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
