import React, { useEffect } from "react";
import { useMarketplace } from "../context/MarketplaceContext";
import {
  X,
  User,
  PackageCheck,
  ChevronRight,
  Gift,
  Sparkles,
  Tag,
  ShoppingBag,
  Store,
  Shield,
  MessageCircle,
  HelpCircle,
  LogOut,
  LogIn,
  ArrowRight,
  Gem,
  Waves,
  UtensilsCrossed,
  Watch,
  Shirt,
  Laptop,
  Home,
  Heart
} from "lucide-react";

// Helper to map category names to distinct Lucide icons
const getCategoryIcon = (categoryName = "") => {
  const lower = categoryName.toLowerCase();
  if (lower.includes("craft") || lower.includes("art")) return <Gem size={18} color="#00A896" />;
  if (lower.includes("beach") || lower.includes("water")) return <Waves size={18} color="#0284C7" />;
  if (lower.includes("food") || lower.includes("rum")) return <UtensilsCrossed size={18} color="#D97706" />;
  if (lower.includes("luxury") || lower.includes("duty")) return <Watch size={18} color="#7C3AED" />;
  if (lower.includes("apparel") || lower.includes("cloth")) return <Shirt size={18} color="#2563EB" />;
  if (lower.includes("souvenir")) return <Gift size={18} color="#EA580C" />;
  if (lower.includes("tech") || lower.includes("electronic")) return <Laptop size={18} color="#4F46E5" />;
  if (lower.includes("home")) return <Home size={18} color="#059669" />;
  if (lower.includes("beauty") || lower.includes("care")) return <Sparkles size={18} color="#DB2777" />;
  return <ShoppingBag size={18} color="#64748B" />;
};

export default function AccountDrawer({ isOpen, onClose, setActiveTab, setSelectedCategory }) {
  const {
    isCustomerLoggedIn,
    customerDisplayName,
    clearCustomerSession,
    openAuthModal,
    categories = [],
    userRole,
    setUserRole,
    showToast,
    CENTRAL_MARKETPLACE_WHATSAPP
  } = useMarketplace();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCategoryClick = (catId) => {
    if (setSelectedCategory) setSelectedCategory(catId);
    if (setActiveTab) setActiveTab("categories");
    onClose();
  };

  const handleNav = (tab) => {
    if (setActiveTab) setActiveTab(tab);
    onClose();
  };

  const handleSignOut = () => {
    clearCustomerSession();
    if (showToast) showToast("Signed out successfully.");
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99999, display: "flex" }}>
      {/* 1. Backdrop Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(10, 25, 47, 0.65)",
          backdropFilter: "blur(2px)",
          transition: "opacity 0.25s ease"
        }}
      />

      {/* 2. Slide-out Drawer Panel (EverythingEssential345 Style) */}
      <div
        style={{
          position: "relative",
          width: "360px",
          maxWidth: "88vw",
          height: "100%",
          background: "#FFFFFF",
          boxShadow: "6px 0 28px rgba(0, 0, 0, 0.22)",
          display: "flex",
          flexDirection: "column",
          zIndex: 100000,
          animation: "slideInFromLeft 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          overflowY: "auto",
          fontFamily: "var(--font-body, system-ui, sans-serif)"
        }}
      >
        {/* Style tag for slide animation */}
        <style>{`
          @keyframes slideInFromLeft {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        {/* 🌟 01. HEADER (EE345 Dark Navy Blue) */}
        <div
          style={{
            background: "linear-gradient(135deg, #0B1E36 0%, #071526 100%)",
            color: "#FFFFFF",
            padding: "1.5rem 1.25rem 1.35rem",
            position: "relative"
          }}
        >
          {/* Top Row: User Avatar Greeting & Close (X) button */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#00E5C9"
                }}
              >
                <User size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
                  {isCustomerLoggedIn ? `Hello, ${customerDisplayName}` : "Hello, Sign in"}
                </h3>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.22)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")}
              aria-label="Close menu"
            >
              <X size={17} />
            </button>
          </div>

          {/* Subtext */}
          <p style={{ margin: "0 0 1rem 0", fontSize: "0.82rem", color: "#94A3B8", lineHeight: 1.4 }}>
            {isCustomerLoggedIn
              ? "Access your WhatsApp orders, saved Cayman favorites, and island delivery updates."
              : "Sign in for orders, tracking and faster checkout."}
          </p>

          {/* Primary Action Button (EE345 Mint Green Pill) */}
          {!isCustomerLoggedIn ? (
            <button
              onClick={() => {
                onClose();
                if (openAuthModal) openAuthModal("customer");
              }}
              style={{
                width: "100%",
                background: "#B8EBD0",
                color: "#0B1E36",
                border: "none",
                borderRadius: "999px",
                padding: "0.68rem 1.25rem",
                fontSize: "0.92rem",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#9FE5C0")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#B8EBD0")}
            >
              <LogIn size={16} /> Sign in / Create account
            </button>
          ) : (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => handleNav("my-orders")}
                style={{
                  flex: 1,
                  background: "#B8EBD0",
                  color: "#0B1E36",
                  border: "none",
                  borderRadius: "999px",
                  padding: "0.55rem 0.85rem",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  cursor: "pointer"
                }}
              >
                My Orders
              </button>
              <button
                onClick={handleSignOut}
                style={{
                  background: "rgba(255, 255, 255, 0.12)",
                  color: "#F87171",
                  border: "1px solid rgba(248, 113, 113, 0.3)",
                  borderRadius: "999px",
                  padding: "0.55rem 0.85rem",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  cursor: "pointer"
                }}
              >
                <LogOut size={13} /> Sign out
              </button>
            </div>
          )}
        </div>

        {/* 📦 02. SECTION: YOUR SHORTCUTS (EE345 Pill Chips) */}
        <div style={{ padding: "1.1rem 1.25rem 0.75rem", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.65rem" }}>
            Your Shortcuts
          </div>

          <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
            {/* Orders */}
            <button
              onClick={() => handleNav("my-orders")}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "999px",
                padding: "0.45rem 0.85rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.84rem",
                fontWeight: 700,
                color: "#1E293B",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.15s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}
            >
              <PackageCheck size={15} color="#00A896" /> Orders
            </button>

            {/* Account */}
            <button
              onClick={() => {
                onClose();
                if (isCustomerLoggedIn) {
                  setActiveTab("my-orders");
                } else if (openAuthModal) {
                  openAuthModal("customer");
                }
              }}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "999px",
                padding: "0.45rem 0.85rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.84rem",
                fontWeight: 700,
                color: "#1E293B",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.15s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}
            >
              <User size={15} color="#3B82F6" /> Account
            </button>

            {/* Wishlist */}
            <button
              onClick={() => handleNav("categories")}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "999px",
                padding: "0.45rem 0.85rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.84rem",
                fontWeight: 700,
                color: "#1E293B",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.15s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}
            >
              <Heart size={15} color="#EF4444" /> Wishlist
            </button>
          </div>
        </div>

        {/* ✨ 03. SECTION: EXPLORE MORE FOR YOU (EE345 Quick Cards) */}
        <div style={{ padding: "1.1rem 1.25rem 0.9rem", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.65rem" }}>
            Explore More for You
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.55rem" }}>
            {/* Tile 1: Cayman Souvenirs */}
            <div
              onClick={() => handleCategoryClick("cat-6")}
              style={{
                background: "#F0FDFA",
                border: "1px solid #CCFBF1",
                borderRadius: "12px",
                padding: "0.75rem 0.5rem",
                textAlign: "center",
                cursor: "pointer",
                transition: "transform 0.15s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <div style={{ color: "#0D9488", marginBottom: "0.25rem", display: "flex", justifyContent: "center" }}>
                <Gift size={20} />
              </div>
              <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "#0F766E", lineHeight: 1.2 }}>
                Souvenirs
              </div>
            </div>

            {/* Tile 2: New Arrivals */}
            <div
              onClick={() => {
                handleNav("home");
                setTimeout(() => {
                  const el = document.getElementById("new-arrivals-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              style={{
                background: "#F0FDF4",
                border: "1px solid #DCFCE7",
                borderRadius: "12px",
                padding: "0.75rem 0.5rem",
                textAlign: "center",
                cursor: "pointer",
                transition: "transform 0.15s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <div style={{ color: "#16A34A", marginBottom: "0.25rem", display: "flex", justifyContent: "center" }}>
                <Sparkles size={20} />
              </div>
              <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "#15803D", lineHeight: 1.2 }}>
                New Arrivals
              </div>
            </div>

            {/* Tile 3: Today's Deals */}
            <div
              onClick={() => {
                handleNav("home");
                setTimeout(() => {
                  const el = document.getElementById("special-offers-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              style={{
                background: "#FFFBEB",
                border: "1px solid #FEF3C7",
                borderRadius: "12px",
                padding: "0.75rem 0.5rem",
                textAlign: "center",
                cursor: "pointer",
                transition: "transform 0.15s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <div style={{ color: "#D97706", marginBottom: "0.25rem", display: "flex", justifyContent: "center" }}>
                <Tag size={20} />
              </div>
              <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "#B45309", lineHeight: 1.2 }}>
                Today's Deals
              </div>
            </div>
          </div>
        </div>

        {/* 🏷️ 04. SECTION: BROWSE BY CATEGORY (EE345 Category List with Chevrons) */}
        <div style={{ padding: "1.1rem 1.25rem 0.75rem", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.75rem" }}>
            Browse by Category
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.65rem 0.75rem",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#F0FDFA";
                  e.currentTarget.style.paddingLeft = "0.95rem";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.paddingLeft = "0.75rem";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  {getCategoryIcon(cat.name)}
                  <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#1E293B" }}>
                    {cat.name}
                  </span>
                </div>
                <ChevronRight size={15} color="#94A3B8" />
              </div>
            ))}
          </div>
        </div>

        {/* ⚙️ 05. SECTION: YOUR ACCOUNT & MARKETPLACE SERVICES */}
        <div style={{ padding: "1.1rem 1.25rem 1.5rem" }}>
          <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
            Your Account & Services
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {/* Sign in / Account Profile */}
            <div
              onClick={() => {
                onClose();
                if (isCustomerLoggedIn) {
                  setActiveTab("my-orders");
                } else if (openAuthModal) {
                  openAuthModal("customer");
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.65rem 0.75rem",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "0.86rem",
                color: "#1E293B",
                fontWeight: 600,
                transition: "background 0.15s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <User size={16} color="#64748B" />
              <span>{isCustomerLoggedIn ? "Manage Account Profile" : "Sign in to your account"}</span>
            </div>

            {/* Vendor Portal */}
            <div
              onClick={() => {
                onClose();
                if (userRole === "vendor") {
                  setActiveTab("vendor-dashboard");
                } else {
                  openAuthModal("vendor");
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.65rem 0.75rem",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "0.86rem",
                color: "#1E293B",
                fontWeight: 600,
                transition: "background 0.15s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Store size={16} color="#0D9488" />
              <span>Sell on CaymanBazaar (Vendor Portal)</span>
            </div>

            {/* Admin Console */}
            <div
              onClick={() => {
                onClose();
                if (userRole === "admin") {
                  setActiveTab("admin-dashboard");
                } else {
                  openAuthModal("admin");
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.65rem 0.75rem",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "0.86rem",
                color: "#1E293B",
                fontWeight: 600,
                transition: "background 0.15s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Shield size={16} color="#D97706" />
              <span>Administrator Console</span>
            </div>

            {/* WhatsApp Support */}
            <a
              href={`https://wa.me/${CENTRAL_MARKETPLACE_WHATSAPP || "13459492299"}?text=Hello%20CaymanBazaar%2C%20I%20have%20an%20inquiry.`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.65rem 0.75rem",
                borderRadius: "10px",
                textDecoration: "none",
                fontSize: "0.86rem",
                color: "#16A34A",
                fontWeight: 700,
                transition: "background 0.15s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F0FDF4")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <MessageCircle size={16} color="#25D366" />
              <span>WhatsApp Island Support</span>
            </a>

            {/* FAQ */}
            <div
              onClick={() => handleNav("faq")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.65rem 0.75rem",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "0.86rem",
                color: "#64748B",
                fontWeight: 600,
                transition: "background 0.15s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <HelpCircle size={16} color="#64748B" />
              <span>FAQ & Island Delivery Guide</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

