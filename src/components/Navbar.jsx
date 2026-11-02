import React, { useState } from "react";
import { useMarketplace } from "../context/MarketplaceContext";
import AccountDrawer from "./AccountDrawer";
import {
  ShoppingBag,
  Store,
  Grid,
  Search,
  MapPin,
  Clock,
  LayoutDashboard,
  Package,
  Settings,
  HelpCircle,
  PackageCheck,
  Compass,
  CheckCircle2,
  Sparkles,
  Map,
  AlertTriangle,
  BarChart3,
  Star,
  MessageSquare,
  MessageCircle,
  Menu,
  Heart,
  X,
  User,
  ChevronDown,
  Sun,
  Moon,
  Monitor,
  Mic,
  ShoppingCart,
  ExternalLink,
  ShieldCheck
} from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, setIsCartOpen, setSelectedProduct, selectedCategory = "all", setSelectedCategory }) {
  const {
    userRole,
    setUserRole,
    cart,
    activeVendor,
    orders,
    reviews = [],
    products = [],
    categories = [],
    customerPhoneSession,
    isCustomerLoggedIn,
    customerDisplayName,
    themeMode,
    setThemeMode,
    isDarkMode,
    showToast
  } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // 🎙️ Voice Search recognition handler
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (showToast) {
        showToast("Voice search is not supported in this browser. Please use Chrome or Edge.");
      } else {
        alert("Voice search is not supported in this browser. Please use Chrome or Edge.");
      }
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        if (showToast) showToast("🎙️ Listening... Speak your search query.");
      };

      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setSearchQuery(transcript);
          if (showToast) showToast(`🎙️ Voice Search: "${transcript}"`);
          if (setActiveTab) setActiveTab("categories");
        }
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          if (showToast) showToast("Microphone access blocked. Please allow mic permission in your browser.");
        } else if (event.error === "no-speech") {
          if (showToast) showToast("No speech detected. Please try speaking again.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Voice search error:", err);
      setIsListening(false);
    }
  };

  const searchResults = searchQuery.trim().length >= 2
    ? products.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || (p.category_name && p.category_name.toLowerCase().includes(searchQuery.toLowerCase()))).slice(0, 5)
    : [];

  const totalCartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const flaggedCount = reviews.filter((r) => r.is_flagged).length;

  // Vendor pending orders badge count
  const vendorPendingOrders = orders.filter(
    (o) => o.vendor_id === activeVendor?.id && o.status !== "Completed" && o.status !== "Cancelled"
  ).length;
  const isCustomer = userRole === "customer";

  return (
    <header style={{
      background: isDarkMode ? "#0F172A" : "#FFFFFF",
      borderBottom: isDarkMode ? "1px solid #1E293B" : "1px solid #E5E7EB",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: isDarkMode ? "0 4px 20px rgba(0, 0, 0, 0.4)" : "0 2px 10px rgba(0, 0, 0, 0.05)",
      transition: "background 0.2s ease, border-color 0.2s ease"
    }}>
      {/* Top Island Trust & Delivery Bar */}
      {isCustomer && (
        <div style={{
          background: isDarkMode ? "#0B1322" : "#F8FAFC",
          borderBottom: isDarkMode ? "1px solid #1E293B" : "1px solid #E2E8F0",
          padding: "0.35rem 1rem",
          textAlign: "center",
          fontSize: "0.76rem",
          fontWeight: 700,
          color: isDarkMode ? "#94A3B8" : "#475569",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem",
          flexWrap: "wrap",
          transition: "background 0.2s ease"
        }}>
          <span>🌴 <strong style={{ color: "#00A896" }}>Grand Cayman</strong> Online Shopping</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>⚡ <strong style={{ color: "#16A34A" }}>Fast Local Delivery</strong> across Cayman</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>🛡️ <strong style={{ color: isDarkMode ? "#F8FAFC" : "#0F172A" }}>100% Quality Items</strong></span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>💎 <strong style={{ color: "#00A896" }}>0% Island Sales Tax</strong></span>
        </div>
      )}

      {/* Customer Header Row (EE345 style) */}
      {isCustomer && (
        <div className="container" style={{ padding: "0.75rem 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.25rem" }}>
            
            {/* 3-Line Hamburger Menu & Brand Logo (EE345 style) */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flexShrink: 0 }}>
              {/* 3 Lines Hamburger Menu Button */}
              <button
                id="header-hamburger-trigger"
                onClick={() => setIsAccountDrawerOpen(true)}
                style={{
                  background: isAccountDrawerOpen ? (isDarkMode ? "#1E293B" : "#F1F5F9") : "transparent",
                  border: "none",
                  color: isDarkMode ? "#F8FAFC" : "#0F172A",
                  cursor: "pointer",
                  padding: "0.45rem",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s ease, color 0.15s ease"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? "#1E293B" : "#F1F5F9")}
                onMouseLeave={(e) => {
                  if (!isAccountDrawerOpen) e.currentTarget.style.background = "transparent";
                }}
                title="Toggle Navigation Menu"
                aria-label="Toggle Navigation Menu"
              >
                <Menu size={24} strokeWidth={2.2} />
              </button>

              {/* Brand Logo */}
              <div
                onClick={() => setActiveTab("home")}
                style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer" }}
              >
                <div style={{
                  background: "#0F172A",
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#00E5C9"
                }}>
                  <ShoppingBag size={22} />
                </div>
                <div>
                  <div style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.35rem",
                    fontWeight: 900,
                    color: isCustomer ? (isDarkMode ? "#F8FAFC" : "#0F172A") : "#FFFFFF",
                    lineHeight: 1,
                    letterSpacing: "-0.03em"
                  }}>
                    CAYMAN<span style={{ color: "#00A896" }}>BAZAAR</span>
                  </div>
                  <div style={{
                    fontSize: "0.65rem",
                    color: isCustomer ? (isDarkMode ? "#94A3B8" : "#64748B") : "#94A3B8",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase"
                  }}>
                    Online Shopping • Grand Cayman
                  </div>
                </div>
              </div>
            </div>

            {/* Centered Search Bar (EE345 style) with Live Search Dropdown */}
            <div style={{
              flex: 1,
              maxWidth: "620px",
              position: "relative"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                background: isDarkMode ? "#1E293B" : "#F1F5F9",
                borderRadius: "999px",
                padding: "0.25rem 0.35rem 0.25rem 1rem",
                border: isDarkMode ? "1.5px solid #334155" : "1.5px solid #CBD5E1",
                transition: "all 0.2s ease"
              }}>
                <input
                  type="text"
                  placeholder={isListening ? "Listening... Speak now..." : "Search"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setActiveTab("categories");
                  }}
                  style={{
                    flex: 1,
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    fontSize: "0.9rem",
                    color: isDarkMode ? "#F8FAFC" : "#0F172A",
                    fontWeight: 500
                  }}
                />
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  title={isListening ? "Listening... Speak now" : "Voice Search (Click and speak)"}
                  style={{
                    background: isListening ? "#FEE2E2" : "transparent",
                    border: "none",
                    color: isListening ? "#EF4444" : (isDarkMode ? "#94A3B8" : "#64748B"),
                    cursor: "pointer",
                    padding: "0.25rem",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "0.35rem",
                    animation: isListening ? "voicePulse 1.2s infinite" : "none",
                    transition: "all 0.2s ease"
                  }}
                >
                  <Mic size={17} strokeWidth={2.2} />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("categories")}
                  style={{
                    background: "#D1FAE5",
                    color: "#047857",
                    border: "none",
                    borderRadius: "12px",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "all 0.15s ease"
                  }}
                  title="Search"
                >
                  <Search size={17} strokeWidth={2.2} />
                </button>
              </div>

              {/* Live Search Suggestions Dropdown */}
              {searchResults.length > 0 && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: 0,
                  right: 0,
                  background: "#FFFFFF",
                  borderRadius: "14px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                  border: "1px solid #E2E8F0",
                  padding: "0.5rem",
                  zIndex: 1000
                }}>
                  {searchResults.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        if (setSelectedProduct) setSelectedProduct(prod);
                        setActiveTab("product-detail");
                        setSearchQuery("");
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.55rem 0.75rem",
                        borderRadius: "10px",
                        cursor: "pointer",
                        transition: "background 0.15s ease"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <img
                        src={prod.images?.[0] || prod.image || prod.image_url}
                        alt=""
                        style={{ width: "38px", height: "38px", borderRadius: "8px", objectFit: "cover" }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {prod.title}
                        </div>
                        <div style={{ fontSize: "0.74rem", color: "#64748B" }}>
                          {prod.category_name || "Catalog"}
                        </div>
                      </div>
                      <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#0F172A" }}>
                        CI${Number(prod.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Customer Navigation Icons (EE345 style: Support, Account, Wishlist, Cart) */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
              
              {/* Support WhatsApp Pill */}
              <a
                href="https://wa.me/13459492299?text=Hello%20CaymanBazaar%2C%20I%20need%20some%20assistance."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#0F172A",
                  color: "#FFFFFF",
                  padding: "0.45rem 0.95rem",
                  borderRadius: "999px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  textDecoration: "none"
                }}
              >
                <MessageCircle size={15} color="#25D366" />
                <span>Support</span>
              </a>

              {/* Theme Toggle Pill (Light / Dark / System) */}
              <div
                className="hide-on-mobile"
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: isDarkMode ? "#1E293B" : "#F1F5F9",
                  borderRadius: "999px",
                  padding: "0.2rem 0.3rem",
                  border: isDarkMode ? "1px solid #334155" : "1px solid #E2E8F0",
                  gap: "0.2rem",
                  transition: "all 0.2s ease"
                }}
              >
                {/* Sun (Light Mode) */}
                <button
                  type="button"
                  onClick={() => {
                    setThemeMode("light");
                    if (showToast) showToast("☀️ Light mode activated");
                  }}
                  style={{
                    background: themeMode === "light" ? "#D1FAE5" : "transparent",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: themeMode === "light" ? "#065F46" : (isDarkMode ? "#94A3B8" : "#64748B"),
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 0.15s ease"
                  }}
                  title="Light mode"
                  aria-label="Light mode"
                >
                  <Sun size={13} strokeWidth={2.2} />
                </button>

                {/* Moon (Dark Mode) */}
                <button
                  type="button"
                  onClick={() => {
                    setThemeMode("dark");
                    if (showToast) showToast("🌙 Dark mode activated");
                  }}
                  style={{
                    background: themeMode === "dark" ? (isDarkMode ? "#0F766E" : "#0F172A") : "transparent",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: themeMode === "dark" ? "#FFFFFF" : (isDarkMode ? "#94A3B8" : "#64748B"),
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 0.15s ease"
                  }}
                  title="Dark mode"
                  aria-label="Dark mode"
                >
                  <Moon size={13} strokeWidth={2.2} />
                </button>

                {/* Monitor (System Mode) */}
                <button
                  type="button"
                  onClick={() => {
                    setThemeMode("system");
                    if (showToast) showToast("💻 System theme synchronized");
                  }}
                  style={{
                    background: themeMode === "system" ? (isDarkMode ? "#334155" : "#E2E8F0") : "transparent",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: themeMode === "system" ? (isDarkMode ? "#38BDF8" : "#0F172A") : (isDarkMode ? "#94A3B8" : "#64748B"),
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 0.15s ease"
                  }}
                  title="System mode (Auto-detect)"
                  aria-label="System mode"
                >
                  <Monitor size={13} strokeWidth={2.2} />
                </button>
              </div>

              {/* EE345 Account Pill Toggle */}
              <div
                id="account-drawer-toggle"
                onClick={() => setIsAccountDrawerOpen(true)}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.55rem",
                  padding: "0.35rem 0.85rem",
                  borderRadius: "999px",
                  border: isDarkMode ? "1.5px solid #334155" : "1.5px solid #CBD5E1",
                  background: isAccountDrawerOpen ? (isDarkMode ? "#334155" : "#F1F5F9") : (isDarkMode ? "#1E293B" : "#FFFFFF"),
                  transition: "all 0.15s ease",
                  userSelect: "none"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? "#334155" : "#F8FAFC")}
                onMouseLeave={(e) => {
                  if (!isAccountDrawerOpen) e.currentTarget.style.background = isDarkMode ? "#1E293B" : "#FFFFFF";
                }}
                title="Hello, Sign in / Account Shortcuts"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isDarkMode ? "#F8FAFC" : "#0F172A",
                    flexShrink: 0
                  }}
                >
                  <User size={19} strokeWidth={2} />
                </div>
                <div className="hide-on-mobile" style={{ textAlign: "left", lineHeight: 1.15 }}>
                  <div style={{ fontSize: "0.68rem", color: isDarkMode ? "#94A3B8" : "#64748B", fontWeight: 500 }}>
                    {isCustomerLoggedIn ? `Hello, ${customerDisplayName}` : "Hello, sign in"}
                  </div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 800, color: isDarkMode ? "#F8FAFC" : "#0F172A" }}>
                    Account
                  </div>
                </div>
              </div>

              {/* Wishlist Icon (EE345 style) */}
              <button
                onClick={() => setActiveTab("categories")}
                style={{
                  background: "none",
                  border: "none",
                  color: isDarkMode ? "#F8FAFC" : "#0F172A",
                  cursor: "pointer",
                  padding: "0.45rem",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.15s ease, color 0.15s ease"
                }}
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart size={22} strokeWidth={1.8} color={isDarkMode ? "#F8FAFC" : "#0F172A"} />
              </button>

              {/* Cart Icon with Red Counter Badge (EE345 style) */}
              <button
                onClick={() => setActiveTab("cart")}
                style={{
                  background: "none",
                  border: "none",
                  color: isDarkMode ? "#F8FAFC" : "#0F172A",
                  cursor: "pointer",
                  padding: "0.45rem",
                  borderRadius: "8px",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.15s ease, color 0.15s ease"
                }}
                title="Shopping Cart"
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={22} strokeWidth={1.8} color={isDarkMode ? "#F8FAFC" : "#0F172A"} />
                {totalCartCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "0px",
                      right: "-2px",
                      background: "#EF4444",
                      color: "#FFFFFF",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      minWidth: "18px",
                      height: "18px",
                      borderRadius: "999px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 4px",
                      lineHeight: 1,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                    }}
                  >
                    {totalCartCount}
                  </span>
                )}
              </button>
              </div>
            </div>
          </div>
        )}

      {/* Clean Category & Shopping Sub-Bar */}
      {isCustomer && (
        <div style={{
          background: isDarkMode ? "#0F172A" : "#FFFFFF",
          borderTop: isDarkMode ? "1px solid #1E293B" : "1px solid #F1F5F9",
          borderBottom: isDarkMode ? "1px solid #1E293B" : "1px solid #E5E7EB",
          overflowX: "auto",
          whiteSpace: "nowrap",
          transition: "background 0.2s ease, border-color 0.2s ease"
        }}>
          <div
            className="container"
            style={{
              padding: "0.45rem 1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "max-content",
              gap: "0.5rem"
            }}
          >
            <button
              onClick={() => setActiveTab("home")}
              style={{
                background: activeTab === "home" ? (isDarkMode ? "#00A896" : "#0F172A") : "transparent",
                color: activeTab === "home" ? "#FFFFFF" : (isDarkMode ? "#94A3B8" : "#334155"),
                padding: "0.35rem 0.85rem",
                borderRadius: "999px",
                fontSize: "0.82rem",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              Home
            </button>

            <button
              onClick={() => {
                if (setSelectedCategory) setSelectedCategory("all");
                setActiveTab("categories");
              }}
              style={{
                background: activeTab === "categories" && selectedCategory === "all" ? (isDarkMode ? "#00A896" : "#0F172A") : "transparent",
                color: activeTab === "categories" && selectedCategory === "all" ? "#FFFFFF" : (isDarkMode ? "#94A3B8" : "#334155"),
                padding: "0.35rem 0.85rem",
                borderRadius: "999px",
                fontSize: "0.82rem",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              All Products
            </button>

            <span style={{ color: isDarkMode ? "#334155" : "#CBD5E1", margin: "0 0.25rem" }}>•</span>

            {categories.map((cat) => {
              const isCatActive = activeTab === "categories" && selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (setSelectedCategory) setSelectedCategory(cat.id);
                    setActiveTab("categories");
                  }}
                  style={{
                    background: isCatActive ? (isDarkMode ? "#00A896" : "#0F172A") : "transparent",
                    color: isCatActive ? "#FFFFFF" : (isDarkMode ? "#94A3B8" : "#475569"),
                    padding: "0.35rem 0.85rem",
                    fontSize: "0.82rem",
                    fontWeight: isCatActive ? 700 : 600,
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "999px",
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (!isCatActive) e.currentTarget.style.color = "#00A896";
                  }}
                  onMouseLeave={(e) => {
                    if (!isCatActive) e.currentTarget.style.color = isDarkMode ? "#94A3B8" : "#475569";
                  }}
                >
                  {cat.name}
                </button>
              );
            })}

            <span style={{ color: "#CBD5E1", margin: "0 0.25rem" }}>•</span>

            <button
              onClick={() => {
                setActiveTab("home");
                setTimeout(() => {
                  const el = document.getElementById("special-offers-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              style={{
                background: "#FEF2F2",
                color: "#DC2626",
                padding: "0.3rem 0.75rem",
                borderRadius: "999px",
                fontSize: "0.78rem",
                fontWeight: 800,
                border: "1px solid #FECACA",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem"
              }}
            >
              <span>🔥 Special Offers</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Container for non-customers (Vendor & Admin Light Theme) */}
      {!isCustomer && (
        <div className="container" style={{ padding: "0.85rem 1.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem" }}>

            {/* Brand Logo & Context Badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <div
                onClick={() => setActiveTab(userRole === "vendor" ? "vendor-dashboard" : "admin-dashboard")}
                style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer" }}
              >
                <div style={{
                  background: "#0F172A",
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: userRole === "vendor" ? "#00E5C9" : "#F59E0B"
                }}>
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <div style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.25rem",
                    fontWeight: 900,
                    color: "#0F172A",
                    lineHeight: 1,
                    letterSpacing: "-0.03em"
                  }}>
                    CAYMAN<span style={{ color: "#00A896" }}>BAZAAR</span>
                  </div>
                  <div style={{
                    fontSize: "0.65rem",
                    color: "#64748B",
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase"
                  }}>
                    {userRole === "vendor" ? "Merchant Workspace" : "SuperAdmin Console"}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <span style={{
                background: userRole === "vendor" ? "#F0FDFA" : "#FFFBEB",
                color: userRole === "vendor" ? "#0D9488" : "#B45309",
                border: userRole === "vendor" ? "1px solid #CCFBF1" : "1px solid #FEF3C7",
                padding: "0.25rem 0.65rem",
                borderRadius: "999px",
                fontSize: "0.74rem",
                fontWeight: 800,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem"
              }}>
                {userRole === "vendor" ? <Store size={12} /> : <ShieldCheck size={12} />}
                <span>{userRole === "vendor" ? "Vendor Partner" : "SuperAdmin"}</span>
              </span>
            </div>

            {/* Vendor Portal Navigation Links */}
            {userRole === "vendor" && (
              <nav className="desktop-nav-links" style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexWrap: "wrap", marginLeft: "auto" }}>
                <button
                  onClick={() => setActiveTab("vendor-dashboard")}
                  style={{
                    background: activeTab === "vendor-dashboard" ? "#F0FDFA" : "transparent",
                    color: activeTab === "vendor-dashboard" ? "#0D9488" : "#334155",
                    fontWeight: activeTab === "vendor-dashboard" ? 800 : 600,
                    fontSize: "0.86rem",
                    padding: "0.45rem 0.85rem",
                    borderRadius: "10px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    border: activeTab === "vendor-dashboard" ? "1px solid #99F6E4" : "1px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <LayoutDashboard size={15} /> Dashboard
                </button>

                <button
                  onClick={() => setActiveTab("vendor-products")}
                  style={{
                    background: activeTab === "vendor-products" ? "#F0FDFA" : "transparent",
                    color: activeTab === "vendor-products" ? "#0D9488" : "#334155",
                    fontWeight: activeTab === "vendor-products" ? 800 : 600,
                    fontSize: "0.86rem",
                    padding: "0.45rem 0.85rem",
                    borderRadius: "10px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    border: activeTab === "vendor-products" ? "1px solid #99F6E4" : "1px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <Package size={15} /> Products
                </button>

                <button
                  onClick={() => setActiveTab("vendor-orders")}
                  style={{
                    background: activeTab === "vendor-orders" ? "#F0FDFA" : "transparent",
                    color: activeTab === "vendor-orders" ? "#0D9488" : "#334155",
                    fontWeight: activeTab === "vendor-orders" ? 800 : 600,
                    fontSize: "0.86rem",
                    padding: "0.45rem 0.85rem",
                    borderRadius: "10px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    border: activeTab === "vendor-orders" ? "1px solid #99F6E4" : "1px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <Package size={15} /> Orders
                  {vendorPendingOrders > 0 && (
                    <span style={{ background: "#F59E0B", color: "#FFFFFF", fontSize: "0.72rem", borderRadius: "10px", padding: "0.15rem 0.45rem", fontWeight: 900 }}>
                      {vendorPendingOrders}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("vendor-profile")}
                  style={{
                    background: activeTab === "vendor-profile" ? "#F0FDFA" : "transparent",
                    color: activeTab === "vendor-profile" ? "#0D9488" : "#334155",
                    fontWeight: activeTab === "vendor-profile" ? 800 : 600,
                    fontSize: "0.86rem",
                    padding: "0.45rem 0.85rem",
                    borderRadius: "10px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    border: activeTab === "vendor-profile" ? "1px solid #99F6E4" : "1px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <Settings size={15} /> Store Profile
                </button>

                <button
                  onClick={() => setActiveTab("vendor-reviews")}
                  style={{
                    background: activeTab === "vendor-reviews" ? "#F0FDFA" : "transparent",
                    color: activeTab === "vendor-reviews" ? "#0D9488" : "#334155",
                    fontWeight: activeTab === "vendor-reviews" ? 800 : 600,
                    fontSize: "0.86rem",
                    padding: "0.45rem 0.85rem",
                    borderRadius: "10px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    border: activeTab === "vendor-reviews" ? "1px solid #99F6E4" : "1px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <Star size={15} /> Reviews
                </button>

                {/* Back to Customer Marketplace */}
                <button
                  onClick={() => {
                    setUserRole("customer");
                    setActiveTab("home");
                  }}
                  style={{
                    background: "#F1F5F9",
                    border: "1px solid #E2E8F0",
                    color: "#0F172A",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    padding: "0.45rem 0.85rem",
                    borderRadius: "8px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    marginLeft: "0.5rem"
                  }}
                  title="View Customer Storefront"
                >
                  <span>Storefront</span>
                  <ExternalLink size={13} />
                </button>
              </nav>
            )}

            {/* Admin Navigation Links */}
            {userRole === "admin" && (
              <nav className="desktop-nav-links" style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexWrap: "wrap", marginLeft: "auto" }}>
                <button
                  onClick={() => setActiveTab("admin-dashboard")}
                  style={{
                    background: activeTab === "admin-dashboard" ? "#FFFBEB" : "transparent",
                    color: activeTab === "admin-dashboard" ? "#B45309" : "#334155",
                    fontWeight: activeTab === "admin-dashboard" ? 800 : 600,
                    fontSize: "0.84rem",
                    padding: "0.45rem 0.8rem",
                    borderRadius: "10px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    border: activeTab === "admin-dashboard" ? "1px solid #FDE68A" : "1px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <LayoutDashboard size={14} /> Overview
                </button>

                <button
                  onClick={() => setActiveTab("admin-vendors")}
                  style={{
                    background: activeTab === "admin-vendors" ? "#FFFBEB" : "transparent",
                    color: activeTab === "admin-vendors" ? "#B45309" : "#334155",
                    fontWeight: activeTab === "admin-vendors" ? 800 : 600,
                    fontSize: "0.84rem",
                    padding: "0.45rem 0.8rem",
                    borderRadius: "10px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    border: activeTab === "admin-vendors" ? "1px solid #FDE68A" : "1px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <Store size={14} /> Vendors
                </button>

                <button
                  onClick={() => setActiveTab("admin-orders")}
                  style={{
                    background: activeTab === "admin-orders" ? "#FFFBEB" : "transparent",
                    color: activeTab === "admin-orders" ? "#B45309" : "#334155",
                    fontWeight: activeTab === "admin-orders" ? 800 : 600,
                    fontSize: "0.84rem",
                    padding: "0.45rem 0.8rem",
                    borderRadius: "10px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    border: activeTab === "admin-orders" ? "1px solid #FDE68A" : "1px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <Package size={14} /> Orders
                </button>

                <button
                  onClick={() => setActiveTab("admin-reviews")}
                  style={{
                    background: activeTab === "admin-reviews" ? "#FFFBEB" : "transparent",
                    color: activeTab === "admin-reviews" ? "#B45309" : "#334155",
                    fontWeight: activeTab === "admin-reviews" ? 800 : 600,
                    fontSize: "0.84rem",
                    padding: "0.45rem 0.8rem",
                    borderRadius: "10px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    border: activeTab === "admin-reviews" ? "1px solid #FDE68A" : "1px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <Star size={14} /> Reviews
                  {flaggedCount > 0 && (
                    <span style={{ background: "#EF4444", color: "#FFFFFF", fontSize: "0.7rem", borderRadius: "999px", padding: "0.1rem 0.45rem", fontWeight: 900 }}>
                      {flaggedCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("admin-reports")}
                  style={{
                    background: activeTab === "admin-reports" ? "#FFFBEB" : "transparent",
                    color: activeTab === "admin-reports" ? "#B45309" : "#334155",
                    fontWeight: activeTab === "admin-reports" ? 800 : 600,
                    fontSize: "0.84rem",
                    padding: "0.45rem 0.8rem",
                    borderRadius: "10px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    border: activeTab === "admin-reports" ? "1px solid #FDE68A" : "1px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <BarChart3 size={14} /> Reports
                </button>

                {/* Back to Customer Marketplace */}
                <button
                  onClick={() => {
                    setUserRole("customer");
                    setActiveTab("home");
                  }}
                  style={{
                    background: "#F1F5F9",
                    border: "1px solid #E2E8F0",
                    color: "#0F172A",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    padding: "0.45rem 0.85rem",
                    borderRadius: "8px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    marginLeft: "0.5rem"
                  }}
                  title="View Customer Storefront"
                >
                  <span>Storefront</span>
                  <ExternalLink size={13} />
                </button>
              </nav>
            )}

          {/* Mobile Responsive Header Controls */}
          <div className="mobile-nav-toggle" style={{ display: "none", alignItems: "center", gap: "0.6rem", marginLeft: "auto" }}>
            {userRole === "customer" && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="btn-primary"
                style={{
                  padding: "0.5rem 0.95rem",
                  borderRadius: "999px",
                  fontSize: "0.85rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem"
                }}
              >
                <ShoppingBag size={16} />
                {totalCartCount > 0 && (
                  <span style={{ background: "#FF5A5F", color: "#FFFFFF", fontSize: "0.72rem", fontWeight: 900, borderRadius: "999px", padding: "0.1rem 0.45rem" }}>
                    {totalCartCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => {
                if (userRole === "customer") {
                  setIsAccountDrawerOpen(true);
                } else {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }
              }}
              style={{
                background: (isMobileMenuOpen || isAccountDrawerOpen) ? "rgba(0, 229, 201, 0.2)" : "rgba(255, 255, 255, 0.08)",
                border: (isMobileMenuOpen || isAccountDrawerOpen) ? "1.5px solid #00E5C9" : "1px solid rgba(255, 255, 255, 0.15)",
                color: (isMobileMenuOpen || isAccountDrawerOpen) ? "#00E5C9" : "#FFFFFF",
                padding: "0.55rem 0.75rem",
                borderRadius: "12px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              aria-label="Toggle Navigation Menu"
            >
              {(isMobileMenuOpen || isAccountDrawerOpen) ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>
      )}

      {/* Mobile Responsive Navigation Drawer */}
      {isMobileMenuOpen && (
        <div
          className="mobile-nav-drawer"
          style={{
            background: "linear-gradient(180deg, #050B14 0%, #0A1C36 100%)",
            borderTop: "1px solid rgba(0, 229, 201, 0.25)",
            borderBottom: "2px solid #00E5C9",
            padding: "1.25rem 1.5rem 1.75rem",
            animation: "modalPopIn 0.25s ease forwards"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", paddingBottom: "0.6rem", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <div style={{ fontSize: "0.8rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 800 }}>
              {userRole === "customer" ? "🌴 Cayman Shopper Menu" : userRole === "vendor" ? `🏪 ${activeVendor?.store_name || "Vendor Portal"}` : "🛡️ SuperAdmin Master Console"}
            </div>
            <span style={{ fontSize: "0.75rem", color: "#00E5C9", fontWeight: 700 }}>Mobile Access</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))", gap: "0.55rem" }}>
            {userRole === "customer" && (
              <>
                <button
                  onClick={() => { setActiveTab("home"); setIsMobileMenuOpen(false); }}
                  style={{
                    background: activeTab === "home" ? "rgba(0, 229, 201, 0.2)" : "#091322",
                    border: activeTab === "home" ? "1px solid #00E5C9" : "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    padding: "0.75rem",
                    color: activeTab === "home" ? "#00E5C9" : "#E2E8F0",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  <Compass size={16} /> Home
                </button>

                <button
                  onClick={() => { setActiveTab("categories"); setIsMobileMenuOpen(false); }}
                  style={{
                    background: activeTab === "categories" ? "rgba(0, 229, 201, 0.2)" : "#091322",
                    border: activeTab === "categories" ? "1px solid #00E5C9" : "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    padding: "0.75rem",
                    color: activeTab === "categories" ? "#00E5C9" : "#E2E8F0",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  <Grid size={16} /> Catalog
                </button>

                <button
                  onClick={() => { setActiveTab("my-orders"); setIsMobileMenuOpen(false); }}
                  style={{
                    background: activeTab === "my-orders" ? "rgba(0, 229, 201, 0.2)" : "#091322",
                    border: activeTab === "my-orders" ? "1px solid #00E5C9" : "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    padding: "0.75rem",
                    color: activeTab === "my-orders" ? "#00E5C9" : "#E2E8F0",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  <PackageCheck size={16} /> My Orders
                </button>

                <button
                  onClick={() => { setActiveTab("faq"); setIsMobileMenuOpen(false); }}
                  style={{
                    background: activeTab === "faq" ? "rgba(0, 229, 201, 0.2)" : "#091322",
                    border: activeTab === "faq" ? "1px solid #00E5C9" : "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    padding: "0.75rem",
                    color: activeTab === "faq" ? "#00E5C9" : "#E2E8F0",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  <HelpCircle size={16} /> FAQ
                </button>

                <button
                  onClick={() => { setActiveTab("contact"); setIsMobileMenuOpen(false); }}
                  style={{
                    background: activeTab === "contact" ? "rgba(0, 229, 201, 0.2)" : "#091322",
                    border: activeTab === "contact" ? "1px solid #00E5C9" : "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    padding: "0.75rem",
                    color: activeTab === "contact" ? "#00E5C9" : "#E2E8F0",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  <MapPin size={16} /> Contact
                </button>
              </>
            )}

            {userRole === "vendor" && (
              <>
                <button onClick={() => { setActiveTab("vendor-dashboard"); setIsMobileMenuOpen(false); }} style={{ background: activeTab === "vendor-dashboard" ? "#F0FDFA" : "#FFFFFF", border: activeTab === "vendor-dashboard" ? "1.5px solid #0D9488" : "1px solid #E2E8F0", color: "#0D9488", padding: "0.75rem", borderRadius: "12px", fontWeight: 700, fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><LayoutDashboard size={15} /> Dashboard</button>
                <button onClick={() => { setActiveTab("vendor-products"); setIsMobileMenuOpen(false); }} style={{ background: activeTab === "vendor-products" ? "#F0FDFA" : "#FFFFFF", border: activeTab === "vendor-products" ? "1.5px solid #0D9488" : "1px solid #E2E8F0", color: "#0F172A", padding: "0.75rem", borderRadius: "12px", fontWeight: 700, fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><Package size={15} /> Products</button>
                <button onClick={() => { setActiveTab("vendor-orders"); setIsMobileMenuOpen(false); }} style={{ background: activeTab === "vendor-orders" ? "#F0FDFA" : "#FFFFFF", border: activeTab === "vendor-orders" ? "1.5px solid #0D9488" : "1px solid #E2E8F0", color: "#0F172A", padding: "0.75rem", borderRadius: "12px", fontWeight: 700, fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><Package size={15} /> Orders</button>
                <button onClick={() => { setActiveTab("vendor-profile"); setIsMobileMenuOpen(false); }} style={{ background: activeTab === "vendor-profile" ? "#F0FDFA" : "#FFFFFF", border: activeTab === "vendor-profile" ? "1.5px solid #0D9488" : "1px solid #E2E8F0", color: "#0F172A", padding: "0.75rem", borderRadius: "12px", fontWeight: 700, fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><Settings size={15} /> Store Profile</button>
                <button onClick={() => { setActiveTab("vendor-reviews"); setIsMobileMenuOpen(false); }} style={{ background: activeTab === "vendor-reviews" ? "#F0FDFA" : "#FFFFFF", border: activeTab === "vendor-reviews" ? "1.5px solid #0D9488" : "1px solid #E2E8F0", color: "#0F172A", padding: "0.75rem", borderRadius: "12px", fontWeight: 700, fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><Star size={15} /> Reviews</button>
              </>
            )}

            {userRole === "admin" && (
              <>
                <button onClick={() => { setActiveTab("admin-dashboard"); setIsMobileMenuOpen(false); }} style={{ background: activeTab === "admin-dashboard" ? "#FFFBEB" : "#FFFFFF", border: activeTab === "admin-dashboard" ? "1.5px solid #D97706" : "1px solid #E2E8F0", color: "#B45309", padding: "0.75rem", borderRadius: "12px", fontWeight: 700, fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><LayoutDashboard size={15} /> Overview</button>
                <button onClick={() => { setActiveTab("admin-vendors"); setIsMobileMenuOpen(false); }} style={{ background: activeTab === "admin-vendors" ? "#FFFBEB" : "#FFFFFF", border: activeTab === "admin-vendors" ? "1.5px solid #D97706" : "1px solid #E2E8F0", color: "#0F172A", padding: "0.75rem", borderRadius: "12px", fontWeight: 700, fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><Store size={15} /> Vendors</button>
                <button onClick={() => { setActiveTab("admin-orders"); setIsMobileMenuOpen(false); }} style={{ background: activeTab === "admin-orders" ? "#FFFBEB" : "#FFFFFF", border: activeTab === "admin-orders" ? "1.5px solid #D97706" : "1px solid #E2E8F0", color: "#0F172A", padding: "0.75rem", borderRadius: "12px", fontWeight: 700, fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><Package size={15} /> Orders</button>
                <button onClick={() => { setActiveTab("admin-reviews"); setIsMobileMenuOpen(false); }} style={{ background: activeTab === "admin-reviews" ? "#FFFBEB" : "#FFFFFF", border: activeTab === "admin-reviews" ? "1.5px solid #D97706" : "1px solid #E2E8F0", color: "#0F172A", padding: "0.75rem", borderRadius: "12px", fontWeight: 700, fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><Star size={15} /> Reviews</button>
                <button onClick={() => { setActiveTab("admin-reports"); setIsMobileMenuOpen(false); }} style={{ background: activeTab === "admin-reports" ? "#FFFBEB" : "#FFFFFF", border: activeTab === "admin-reports" ? "1.5px solid #D97706" : "1px solid #E2E8F0", color: "#0F172A", padding: "0.75rem", borderRadius: "12px", fontWeight: 700, fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><BarChart3 size={15} /> Reports</button>
              </>
            )}
          </div>
        </div>
      )}
      {/* 🚀 EE345 Slide-In Toggle Navigation & Account Drawer */}
      <AccountDrawer
        isOpen={isAccountDrawerOpen}
        onClose={() => setIsAccountDrawerOpen(false)}
        setActiveTab={setActiveTab}
        setSelectedCategory={setSelectedCategory}
      />
    </header>
  );
}
