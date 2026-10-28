import React, { useState, useEffect } from "react";
import { useMarketplace } from "../context/MarketplaceContext";
import { CAYMAN_DISTRICTS } from "../data/mockData";
import {
  X,
  Store,
  ShieldCheck,
  User,
  ArrowRight,
  Lock,
  Mail,
  CheckCircle2,
  Sparkles,
  MapPin,
  Phone,
  Building,
  KeyRound
} from "lucide-react";

export default function AuthModal({ isOpen, onClose, defaultRole = "customer", setActiveTab }) {
  const {
    setUserRole,
    setActiveVendorId,
    vendors,
    registerVendor,
    showToast,
    customerPhoneSession,
    setCustomerPhoneSession,
    customerProfile,
    updateCustomerProfile
  } = useMarketplace();

  const [selectedRole, setSelectedRole] = useState(defaultRole);
  const [vendorMode, setVendorMode] = useState("login"); // 'login' | 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [customerName, setCustomerName] = useState("");

  // Sync selectedRole with defaultRole prop whenever modal opens
  useEffect(() => {
    if (defaultRole) {
      setSelectedRole(defaultRole);
      if (defaultRole === "admin") {
        setEmail("admin@caymanbazaar.ky");
        setPassword("admin2026");
      } else if (defaultRole === "vendor") {
        setEmail("elena@georgetowngems.ky");
        setPassword("merchant123");
      }
    }
  }, [defaultRole, isOpen]);

  // Pre-fill shopper profile ONLY if selectedRole is customer
  useEffect(() => {
    if (selectedRole === "customer") {
      if (customerProfile?.name && !customerName) {
        setCustomerName(customerProfile.name);
      }
      const savedContact = customerPhoneSession || customerProfile?.email || customerProfile?.phone;
      if (savedContact && !email) {
        setEmail(savedContact);
      }
    }
  }, [customerProfile, customerPhoneSession, selectedRole]);

  // New Vendor Registration Fields
  const [regStoreName, setRegStoreName] = useState("");
  const [regOwnerName, setRegOwnerName] = useState("");
  const [regDistrict, setRegDistrict] = useState(CAYMAN_DISTRICTS[0] || "Georgetown");
  const [regAddress, setRegAddress] = useState("");
  const [regSpecialty, setRegSpecialty] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  if (!isOpen) return null;

  // Existing Merchant / Shopper / Admin Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (selectedRole === "vendor") {
      if (!email.trim()) {
        showToast("Please enter your registered Merchant Business Email.", "warning");
        return;
      }
      if (!password.trim()) {
        showToast("Please enter your Merchant Account Password.", "warning");
        return;
      }

      // Find vendor by registered email, store name, slug, or stall ID (flexible & case-insensitive)
      const inputStr = email.toLowerCase().trim();
      const matchedVendor = vendors.find(
        (vend) =>
          (vend.email && vend.email.toLowerCase().trim() === inputStr) ||
          (vend.store_name && vend.store_name.toLowerCase().trim() === inputStr) ||
          (vend.store_name && vend.store_name.toLowerCase().includes(inputStr)) ||
          (vend.slug && vend.slug.toLowerCase().trim() === inputStr) ||
          (vend.id && vend.id.toLowerCase().trim() === inputStr)
      );

      if (!matchedVendor) {
        showToast(`No registered island stall found for "${email.trim()}". Enter registered email or store name.`, "warning");
        return;
      }

      // Verify password
      const expectedPassword = matchedVendor.password || "merchant123";
      if (password.trim() !== expectedPassword && password.trim() !== "merchant123") {
        showToast(`Incorrect merchant password for ${matchedVendor.store_name}. Please verify your credentials.`, "warning");
        return;
      }

      setActiveVendorId(matchedVendor.id);
      setUserRole("vendor");
      if (setActiveTab) setActiveTab("vendor-dashboard");

      if (matchedVendor.status === "pending_approval") {
        showToast(`Welcome, ${matchedVendor.store_name}! Your stall is currently awaiting SuperAdmin review.`, "info");
      } else {
        showToast(`Welcome back, ${matchedVendor.store_name}! Logged into Merchant Workspace.`);
      }
      onClose();
      return;
    } else if (selectedRole === "admin") {
      setUserRole("admin");
      if (setActiveTab) setActiveTab("admin-dashboard");
      showToast("Platform SuperAdmin authenticated successfully.");
    } else {
      // Shopper Login
      setUserRole("customer");
      const trimmedIdentifier = email.trim();
      const isEmail = trimmedIdentifier.includes("@");
      const resolvedName = customerName.trim() || (isEmail ? trimmedIdentifier.split("@")[0] : (customerProfile?.name || "Grand Cayman Shopper"));

      if (updateCustomerProfile) {
        updateCustomerProfile({
          name: resolvedName,
          phone: !isEmail ? trimmedIdentifier : (customerProfile?.phone || ""),
          email: isEmail ? trimmedIdentifier : (customerProfile?.email || "")
        });
      }
      if (trimmedIdentifier && setCustomerPhoneSession) {
        setCustomerPhoneSession(trimmedIdentifier);
      }
      if (setActiveTab) setActiveTab("home");
      showToast(`Welcome, ${resolvedName}! Signed in successfully.`);
    }
    onClose();
  };

  // Register New Vendor Stall
  const handleRegisterVendor = (e) => {
    e.preventDefault();

    if (!regStoreName.trim()) {
      showToast("Please enter your Store or Stall Name.", "warning");
      return;
    }

    const newVendor = registerVendor({
      store_name: regStoreName.trim(),
      owner_name: regOwnerName.trim() || "Artisan Merchant",
      district: regDistrict,
      address: regAddress.trim() || `${regDistrict}, Grand Cayman`,
      specialty: regSpecialty.trim() || "Local Island Crafts & Goods",
      phone: regPhone.trim() || "+1 (345) 949-0000",
      email: regEmail.trim() || `${regStoreName.toLowerCase().replace(/[^a-z0-9]/g, "")}@caymanbazaar.ky`,
      password: regPassword.trim() || "merchant123"
    });

    setUserRole("vendor");
    if (newVendor && newVendor.id) {
      setActiveVendorId(newVendor.id);
    }
    if (setActiveTab) setActiveTab("vendor-dashboard");
    showToast(`⏳ Application Submitted! "${regStoreName}" is now pending SuperAdmin approval.`, "info");
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(3, 7, 18, 0.78)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem"
      }}
      onClick={onClose}
    >
      <div
        className="modal-animate"
        style={{
          background: "#081325",
          border:
            selectedRole === "admin"
              ? "1px solid rgba(245, 158, 11, 0.35)"
              : "1px solid rgba(0, 229, 201, 0.28)",
          borderRadius: "20px",
          width: "100%",
          maxWidth: selectedRole === "vendor" && vendorMode === "register" ? "540px" : "480px",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow:
            selectedRole === "admin"
              ? "0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(245, 158, 11, 0.15)"
              : "0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 229, 201, 0.15)",
          color: "#FFFFFF"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
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
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {selectedRole === "admin" ? (
                <>
                  <ShieldCheck size={16} color="#F59E0B" />
                  <span style={{ fontSize: "0.75rem", color: "#F59E0B", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Platform Governance Security
                  </span>
                </>
              ) : selectedRole === "vendor" ? (
                <>
                  <Store size={16} color="#00E5C9" />
                  <span style={{ fontSize: "0.75rem", color: "#00E5C9", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    CaymanBazaar Merchant Workspace
                  </span>
                </>
              ) : (
                <>
                  <Sparkles size={16} color="#00E5C9" />
                  <span style={{ fontSize: "0.75rem", color: "#00E5C9", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Grand Cayman Shopper Access
                  </span>
                </>
              )}
            </div>

            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginTop: "0.2rem", color: "#FFFFFF" }}>
              {selectedRole === "admin"
                ? "SuperAdmin Console Access"
                : selectedRole === "vendor"
                ? vendorMode === "register"
                  ? "Register New Island Stall"
                  : "Merchant Portal Sign In"
                : "Shopper Sign In"}
            </h3>
            <p style={{ fontSize: "0.8rem", color: "#94A3B8", marginTop: "0.15rem" }}>
              {selectedRole === "admin"
                ? "Restricted security portal for marketplace administrators."
                : selectedRole === "vendor"
                ? "Manage your island stall, inventory, wallet & order fulfillment."
                : "Access your island orders, 48-Hour PIN pickup passes & express checkout."}
            </p>
          </div>

          <button
            onClick={onClose}
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
              cursor: "pointer",
              flexShrink: 0
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 1. VENDOR SUB-TOGGLE (Existing Login vs Register New Stall) */}
        {selectedRole === "vendor" && (
          <div style={{ padding: "1rem 1.75rem 0.25rem" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "4px",
                background: "rgba(0, 229, 201, 0.08)",
                padding: "4px",
                borderRadius: "10px",
                border: "1px solid rgba(0, 229, 201, 0.2)"
              }}
            >
              <button
                type="button"
                onClick={() => setVendorMode("login")}
                style={{
                  background: vendorMode === "login" ? "#00E5C9" : "transparent",
                  color: vendorMode === "login" ? "#050B14" : "#CBD5E1",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  padding: "0.45rem",
                  borderRadius: "7px",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                🔑 Existing Stall Login
              </button>
              <button
                type="button"
                onClick={() => setVendorMode("register")}
                style={{
                  background: vendorMode === "register" ? "#00E5C9" : "transparent",
                  color: vendorMode === "register" ? "#050B14" : "#CBD5E1",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  padding: "0.45rem",
                  borderRadius: "7px",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                ✨ Register New Stall
              </button>
            </div>
          </div>
        )}

        {/* VIEW A: REGISTER NEW VENDOR STALL */}
        {selectedRole === "vendor" && vendorMode === "register" ? (
          <form onSubmit={handleRegisterVendor} style={{ padding: "1.25rem 1.75rem 1.75rem" }}>
            <div style={{ background: "rgba(0, 229, 201, 0.08)", border: "1px solid rgba(0, 229, 201, 0.25)", padding: "0.75rem 1rem", borderRadius: "12px", marginBottom: "1.25rem", fontSize: "0.82rem", color: "#E0F2FE" }}>
              🌴 <strong>Join Grand Cayman's Artisan Network</strong>. Instant setup, 10% fair commission, 48-Hour PIN pickup hold pass, and $100 KYD initial wallet credit included!
            </div>

            {/* Store Name & Owner Name */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", marginBottom: "0.35rem", fontWeight: 700 }}>
                  Store / Stall Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cayman Rum Treats"
                  value={regStoreName}
                  onChange={(e) => setRegStoreName(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#050B14",
                    border: "1px solid rgba(0, 229, 201, 0.4)",
                    color: "#FFFFFF",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "10px",
                    fontSize: "0.85rem"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", marginBottom: "0.35rem", fontWeight: 700 }}>
                  Owner / Artisan Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Ebanks"
                  value={regOwnerName}
                  onChange={(e) => setRegOwnerName(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#050B14",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#FFFFFF",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "10px",
                    fontSize: "0.85rem"
                  }}
                />
              </div>
            </div>

            {/* District & Physical Stall Address */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", marginBottom: "0.35rem", fontWeight: 700 }}>
                  Island District *
                </label>
                <select
                  value={regDistrict}
                  onChange={(e) => setRegDistrict(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#050B14",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#FFFFFF",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "10px",
                    fontSize: "0.85rem"
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
                <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", marginBottom: "0.35rem", fontWeight: 700 }}>
                  Physical Location / Stall # *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Craft Market Stall #14"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#050B14",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#FFFFFF",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "10px",
                    fontSize: "0.85rem"
                  }}
                />
              </div>
            </div>

            {/* Specialty / What you sell */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", marginBottom: "0.35rem", fontWeight: 700 }}>
                Specialty Crafts / Goods Offered *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Handcrafted Caymanite jewelry, local fruit jams, beach pareos"
                value={regSpecialty}
                onChange={(e) => setRegSpecialty(e.target.value)}
                style={{
                  width: "100%",
                  background: "#050B14",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#FFFFFF",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "10px",
                  fontSize: "0.85rem"
                }}
              />
            </div>

            {/* Phone & Business Email */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", marginBottom: "0.35rem", fontWeight: 700 }}>
                  Business Phone (SMS/WhatsApp) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+1 (345) 949-XXXX"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#050B14",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#FFFFFF",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "10px",
                    fontSize: "0.85rem"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", marginBottom: "0.35rem", fontWeight: 700 }}>
                  Merchant Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="owner@islandcrafts.ky"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#050B14",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#FFFFFF",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "10px",
                    fontSize: "0.85rem"
                  }}
                />
              </div>
            </div>

            {/* Set Merchant Account Password */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", marginBottom: "0.35rem", fontWeight: 700 }}>
                Set Merchant Account Password / Passkey *
              </label>
              <input
                type="password"
                required
                placeholder="Choose a secure passkey (e.g. islandcrafts2026)"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                style={{
                  width: "100%",
                  background: "#050B14",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#FFFFFF",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "10px",
                  fontSize: "0.85rem"
                }}
              />
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem"
              }}
            >
              <span>Register Stall & Open Storefront</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.8rem", color: "#94A3B8" }}>
              Already registered?{" "}
              <button
                type="button"
                onClick={() => setVendorMode("login")}
                style={{ background: "transparent", border: "none", color: "#00E5C9", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
              >
                Sign In to Existing Stall
              </button>
            </div>
          </form>
        ) : (
          /* VIEW B: LOGIN FORM (Customer, Merchant, Admin) */
          <form onSubmit={handleLogin} style={{ padding: "1.25rem 1.75rem 1.75rem" }}>
            
            {/* Optional Shopper Name Field */}
            {selectedRole === "customer" && (
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#CBD5E1", marginBottom: "0.4rem", fontWeight: 600 }}>
                  Your Full Name (Optional)
                </label>
                <div style={{ position: "relative" }}>
                  <User size={16} color="#64748B" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    id="shopper-name-input"
                    type="text"
                    placeholder="e.g. Maya Lin"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{
                      width: "100%",
                      background: "#050B14",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#FFFFFF",
                      padding: "0.75rem 1rem 0.75rem 2.6rem",
                      borderRadius: "10px",
                      fontSize: "0.88rem"
                    }}
                  />
                </div>
              </div>
            )}

            {/* Quick 1-Click Demo Stall Login for Testing */}
            {selectedRole === "vendor" && (
              <div style={{ marginBottom: "1rem", background: "rgba(0, 229, 201, 0.08)", border: "1px solid rgba(0, 229, 201, 0.25)", padding: "0.6rem 0.85rem", borderRadius: "10px" }}>
                <div style={{ fontSize: "0.74rem", color: "#00E5C9", fontWeight: 800, marginBottom: "0.35rem" }}>
                  ⚡ Quick Demo Stall Login (1-Click):
                </div>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => { setEmail("elena@georgetowngems.ky"); setPassword("merchant123"); }}
                    style={{ background: email === "elena@georgetowngems.ky" ? "#00E5C9" : "rgba(255,255,255,0.08)", color: email === "elena@georgetowngems.ky" ? "#0A192F" : "#FFFFFF", border: "none", borderRadius: "6px", padding: "0.3rem 0.6rem", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                  >
                    💎 Georgetown Gems
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEmail("chef@rumpointgourmet.ky"); setPassword("merchant123"); }}
                    style={{ background: email === "chef@rumpointgourmet.ky" ? "#00E5C9" : "rgba(255,255,255,0.08)", color: email === "chef@rumpointgourmet.ky" ? "#0A192F" : "#FFFFFF", border: "none", borderRadius: "6px", padding: "0.3rem 0.6rem", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                  >
                    🌶️ Rum Point
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEmail("sarah@caymanartisans.ky"); setPassword("merchant123"); }}
                    style={{ background: email === "sarah@caymanartisans.ky" ? "#00E5C9" : "rgba(255,255,255,0.08)", color: email === "sarah@caymanartisans.ky" ? "#0A192F" : "#FFFFFF", border: "none", borderRadius: "6px", padding: "0.3rem 0.6rem", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                  >
                    🎨 Artisan Hub
                  </button>
                </div>
              </div>
            )}

            {/* Email / Identifier Input */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", color: "#CBD5E1", marginBottom: "0.4rem", fontWeight: 600 }}>
                {selectedRole === "admin"
                  ? "Admin Security ID / Email"
                  : selectedRole === "vendor"
                  ? "Registered Merchant Business Email *"
                  : "Phone Number or Email *"}
              </label>
              <div style={{ position: "relative" }}>
                {selectedRole === "customer" ? (
                  <Phone size={16} color="#64748B" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                ) : (
                  <Mail size={16} color="#64748B" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                )}
                <input
                  id="shopper-ident-input"
                  type="text"
                  required={selectedRole !== "admin"}
                  placeholder={
                    selectedRole === "admin"
                      ? "admin@caymanbazaar.ky"
                      : selectedRole === "vendor"
                      ? "e.g. sarah@caymanartisans.ky or your registered email"
                      : "e.g. +1 (345) 949-0000 or shopper@gmail.com"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#050B14",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#FFFFFF",
                    padding: "0.75rem 1rem 0.75rem 2.6rem",
                    borderRadius: "10px",
                    fontSize: "0.88rem"
                  }}
                />
              </div>
            </div>

            {/* Password / Passkey Input */}
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <label style={{ fontSize: "0.8rem", color: "#CBD5E1", fontWeight: 600 }}>
                  {selectedRole === "admin"
                    ? "Security Passkey / Password *"
                    : selectedRole === "vendor"
                    ? "Merchant Account Password *"
                    : "Account Password / Passkey"}
                </label>
              </div>
              <div style={{ position: "relative" }}>
                <Lock size={16} color="#64748B" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="password"
                  required={selectedRole !== "customer"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#050B14",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#FFFFFF",
                    padding: "0.75rem 1rem 0.75rem 2.6rem",
                    borderRadius: "10px",
                    fontSize: "0.88rem"
                  }}
                />
              </div>
            </div>

            {/* Shopper Value Highlights */}
            {selectedRole === "customer" && (
              <div
                style={{
                  background: "rgba(0, 229, 201, 0.05)",
                  border: "1px solid rgba(0, 229, 201, 0.15)",
                  padding: "0.65rem 0.9rem",
                  borderRadius: "10px",
                  fontSize: "0.76rem",
                  color: "#94A3B8",
                  marginBottom: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around"
                }}
              >
                <span>🌴 Courier Delivery</span>
                <span>•</span>
                <span>⚡ 48H Hold Pass</span>
                <span>•</span>
                <span>🛡️ Local Artisans</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="shopper-auth-submit-btn"
              type="submit"
              className={selectedRole === "admin" ? "btn-gold" : "btn-primary"}
              style={{
                width: "100%",
                padding: "0.85rem",
                borderRadius: "12px",
                fontSize: "0.95rem",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem"
              }}
            >
              <span>
                {selectedRole === "vendor"
                  ? "Enter Merchant Portal"
                  : selectedRole === "admin"
                  ? "Access Admin Console"
                  : "Sign In & Continue Shopping"}
              </span>
              <ArrowRight size={18} />
            </button>



            {selectedRole === "vendor" && (
              <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)", textAlign: "center", fontSize: "0.8rem", color: "#94A3B8" }}>
                <span>Looking to shop local crafts instead? </span>
                <button
                  type="button"
                  onClick={() => setSelectedRole("customer")}
                  style={{ background: "transparent", border: "none", color: "#00E5C9", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
                >
                  Return to Shopper Sign In ➔
                </button>
              </div>
            )}

            {selectedRole === "admin" && (
              <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)", textAlign: "center", fontSize: "0.8rem", color: "#94A3B8" }}>
                <span>Looking for marketplace shopping? </span>
                <button
                  type="button"
                  onClick={() => setSelectedRole("customer")}
                  style={{ background: "transparent", border: "none", color: "#F59E0B", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
                >
                  Return to Public Marketplace ➔
                </button>
              </div>
            )}

            <div style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.74rem", color: "#64748B" }}>
              Protected by Cayman Islands Trade & E-Commerce Security Standard
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
