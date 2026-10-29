import React, { useState } from "react";
import { useMarketplace } from "../context/MarketplaceContext";
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
  X
} from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, setIsCartOpen }) {
  const { userRole, cart, activeVendor, orders, reviews = [], customerPhoneSession, isCustomerLoggedIn, customerDisplayName } = useMarketplace();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const flaggedCount = reviews.filter((r) => r.is_flagged).length;

  // Vendor pending orders badge count
  const vendorPendingOrders = orders.filter(
    (o) => o.vendor_id === activeVendor?.id && o.status !== "Completed" && o.status !== "Cancelled"
  ).length;
  const isCustomer = userRole === "customer";

  return (
    <header style={{
      background: isCustomer ? "#FFFFFF" : "rgba(5, 11, 20, 0.94)",
      borderBottom: isCustomer ? "1px solid #E5E7EB" : "1px solid rgba(255, 255, 255, 0.1)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: isCustomer ? "0 2px 10px rgba(0, 0, 0, 0.05)" : "0 10px 30px rgba(0, 0, 0, 0.5)"
    }}>
      {/* Top Island Trust & Delivery Bar */}
      {isCustomer && (
        <div style={{
          background: "#F8FAFC",
          borderBottom: "1px solid #E2E8F0",
          padding: "0.35rem 1rem",
          textAlign: "center",
          fontSize: "0.76rem",
          fontWeight: 700,
          color: "#475569",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem",
          flexWrap: "wrap"
        }}>
          <span>🌴 <strong style={{ color: "#00A896" }}>Grand Cayman</strong> Online Shopping</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>⚡ <strong style={{ color: "#16A34A" }}>Fast Local Delivery</strong> across Cayman</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>🛡️ <strong style={{ color: "#0F172A" }}>100% Quality Items</strong></span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>💎 <strong style={{ color: "#00A896" }}>0% Island Sales Tax</strong></span>
        </div>
      )}

      {/* Customer Header Row (EE345 style) */}
      {isCustomer && (
        <div className="container" style={{ padding: "0.75rem 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.25rem" }}>
            
            {/* Brand Logo (EE345 style) */}
            <div
              onClick={() => setActiveTab("home")}
              style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", flexShrink: 0 }}
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
                  color: isCustomer ? "#0F172A" : "#FFFFFF",
                  lineHeight: 1,
                  letterSpacing: "-0.03em"
                }}>
                  CAYMAN<span style={{ color: "#00A896" }}>BAZAAR</span>
                </div>
                <div style={{
                  fontSize: "0.65rem",
                  color: isCustomer ? "#64748B" : "#94A3B8",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase"
                }}>
                  Online Shopping • Grand Cayman
                </div>
              </div>
            </div>

            {/* Centered Search Bar (EE345 style) */}
            <div style={{
              flex: 1,
              maxWidth: "540px",
              display: "flex",
              alignItems: "center",
              background: "#F1F5F9",
              borderRadius: "999px",
              padding: "0.25rem 0.35rem 0.25rem 1rem",
              border: "1.5px solid #CBD5E1"
            }}>
              <input
                type="text"
                placeholder="Search products, rum cake, dive gear, electronics..."
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
                  fontSize: "0.88rem",
                  color: "#0F172A",
                  fontWeight: 500
                }}
              />
              <button
                type="button"
                onClick={() => setActiveTab("categories")}
                style={{
                  background: "#00A896",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "999px",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0
                }}
              >
                <Search size={16} />
              </button>
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

              {/* My Orders / Account */}
              <button
                onClick={() => setActiveTab("my-orders")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#334155",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  cursor: "pointer",
                  padding: "0.45rem 0.65rem",
                  borderRadius: "8px"
                }}
              >
                <PackageCheck size={18} color="#0F172A" />
                <span className="hide-on-mobile">My Orders</span>
              </button>

                {/* Cart Page Trigger (EE345 style) */}
                <button
                  onClick={() => setActiveTab("cart")}
                  style={{
                    background: "#00A896",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "999px",
                    padding: "0.45rem 1.15rem",
                    fontSize: "0.86rem",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0, 168, 150, 0.3)"
                  }}
                >
                  <ShoppingBag size={17} />
                  <span>Cart</span>
                  {totalCartCount > 0 && (
                    <span
                      style={{
                        background: "#FFFFFF",
                        color: "#00A896",
                        fontSize: "0.74rem",
                        fontWeight: 900,
                        borderRadius: "999px",
                        padding: "0.1rem 0.45rem",
                        marginLeft: "0.2rem"
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

      {/* EE345 Sub-Navigation Category Bar */}
      {isCustomer && (
        <div style={{
          background: "#FFFFFF",
          borderTop: "1px solid #F1F5F9",
          borderBottom: "1px solid #E5E7EB",
          overflowX: "auto",
          whiteSpace: "nowrap"
        }}>
          <div className="container" style={{ padding: "0.4rem 1.5rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <button
              onClick={() => setActiveTab("home")}
              style={{
                background: activeTab === "home" ? "#0F172A" : "transparent",
                color: activeTab === "home" ? "#FFFFFF" : "#334155",
                padding: "0.35rem 0.85rem",
                borderRadius: "999px",
                fontSize: "0.82rem",
                fontWeight: 700,
                border: "none",
                cursor: "pointer"
              }}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              style={{
                background: activeTab === "categories" ? "#0F172A" : "transparent",
                color: activeTab === "categories" ? "#FFFFFF" : "#334155",
                padding: "0.35rem 0.85rem",
                borderRadius: "999px",
                fontSize: "0.82rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer"
              }}
            >
              Shop
            </button>
            <button
              onClick={() => {
                setActiveTab("home");
                setTimeout(() => {
                  const el = document.getElementById("new-arrivals-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              style={{
                background: "transparent",
                color: "#334155",
                padding: "0.35rem 0.85rem",
                borderRadius: "999px",
                fontSize: "0.82rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer"
              }}
            >
              New Arrivals
            </button>
            <button
              onClick={() => {
                setActiveTab("home");
                setTimeout(() => {
                  const el = document.getElementById("special-offers-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              style={{
                background: "transparent",
                color: "#334155",
                padding: "0.35rem 0.85rem",
                borderRadius: "999px",
                fontSize: "0.82rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer"
              }}
            >
              Special Offers
            </button>
            <a
              href="https://wa.me/13459492299?text=Hello%20CaymanBazaar%2C%20I%20need%20customer%20support."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "transparent",
                color: "#334155",
                padding: "0.35rem 0.85rem",
                borderRadius: "999px",
                fontSize: "0.82rem",
                fontWeight: 600,
                textDecoration: "none"
              }}
            >
              Customer Support
            </a>
            <button
              onClick={() => setActiveTab("contact")}
              style={{
                background: activeTab === "contact" ? "#0F172A" : "transparent",
                color: activeTab === "contact" ? "#FFFFFF" : "#334155",
                padding: "0.35rem 0.85rem",
                borderRadius: "999px",
                fontSize: "0.82rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer"
              }}
            >
              Contact Us
            </button>

            <span style={{ color: "#CBD5E1", margin: "0 0.35rem" }}>|</span>

            {[
              { id: "cat-1", name: "Artisanal Crafts" },
              { id: "cat-2", name: "Beach & Watersports" },
              { id: "cat-3", name: "Gourmet Food & Rum" },
              { id: "cat-4", name: "Duty-Free Luxury" },
              { id: "cat-5", name: "Island Apparel" },
              { id: "cat-6", name: "Cayman Souvenirs" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab("categories")}
                style={{
                  background: "transparent",
                  color: "#64748B",
                  padding: "0.35rem 0.75rem",
                  fontSize: "0.82rem",
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer"
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Container Close for non-customers */}
      {!isCustomer && (
        <div className="container" style={{ padding: "0.85rem 1.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem" }}>

          {/* Vendor Portal Navigation */}
          {userRole === "vendor" && (
            <nav className="desktop-nav-links" style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginLeft: "auto" }}>
              <button
                onClick={() => setActiveTab("vendor-dashboard")}
                style={{
                  background: activeTab === "vendor-dashboard" ? "rgba(0, 229, 201, 0.18)" : "transparent",
                  color: activeTab === "vendor-dashboard" ? "#00E5C9" : "#CBD5E1",
                  fontWeight: 800,
                  fontSize: "0.86rem",
                  padding: "0.5rem 0.85rem",
                  borderRadius: "10px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  border: activeTab === "vendor-dashboard" ? "1px solid rgba(0, 229, 201, 0.4)" : "1px solid transparent"
                }}
              >
                <LayoutDashboard size={15} /> Dashboard
              </button>

              <button
                onClick={() => setActiveTab("vendor-products")}
                style={{
                  background: activeTab === "vendor-products" ? "rgba(0, 229, 201, 0.18)" : "transparent",
                  color: activeTab === "vendor-products" ? "#00E5C9" : "#CBD5E1",
                  fontWeight: 800,
                  fontSize: "0.86rem",
                  padding: "0.5rem 0.85rem",
                  borderRadius: "10px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  border: activeTab === "vendor-products" ? "1px solid rgba(0, 229, 201, 0.4)" : "1px solid transparent"
                }}
              >
                <Package size={15} /> Store Products
              </button>

              <button
                onClick={() => setActiveTab("vendor-orders")}
                style={{
                  background: activeTab === "vendor-orders" ? "rgba(0, 229, 201, 0.18)" : "transparent",
                  color: activeTab === "vendor-orders" ? "#00E5C9" : "#CBD5E1",
                  fontWeight: 800,
                  fontSize: "0.86rem",
                  padding: "0.5rem 0.85rem",
                  borderRadius: "10px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  border: activeTab === "vendor-orders" ? "1px solid rgba(0, 229, 201, 0.4)" : "1px solid transparent"
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
                  background: activeTab === "vendor-profile" ? "rgba(0, 229, 201, 0.18)" : "transparent",
                  color: activeTab === "vendor-profile" ? "#00E5C9" : "#CBD5E1",
                  fontWeight: 800,
                  fontSize: "0.86rem",
                  padding: "0.5rem 0.85rem",
                  borderRadius: "10px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  border: activeTab === "vendor-profile" ? "1px solid rgba(0, 229, 201, 0.4)" : "1px solid transparent"
                }}
              >
                <Settings size={15} /> Store Profile
              </button>

              <button
                onClick={() => setActiveTab("vendor-reviews")}
                style={{
                  background: activeTab === "vendor-reviews" ? "rgba(0, 229, 201, 0.18)" : "transparent",
                  color: activeTab === "vendor-reviews" ? "#00E5C9" : "#CBD5E1",
                  fontWeight: 800,
                  fontSize: "0.86rem",
                  padding: "0.5rem 0.85rem",
                  borderRadius: "10px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  border: activeTab === "vendor-reviews" ? "1px solid rgba(0, 229, 201, 0.4)" : "1px solid transparent"
                }}
              >
                <Star size={15} /> Reviews
              </button>
            </nav>
          )}

          {/* Admin Navigation */}
          {userRole === "admin" && (
            <nav className="desktop-nav-links" style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap", marginLeft: "auto" }}>
              <button
                onClick={() => setActiveTab("admin-dashboard")}
                style={{
                  background: activeTab === "admin-dashboard" ? "rgba(245, 158, 11, 0.22)" : "transparent",
                  color: activeTab === "admin-dashboard" ? "#FBBF24" : "#CBD5E1",
                  fontWeight: 800,
                  fontSize: "0.84rem",
                  padding: "0.45rem 0.8rem",
                  borderRadius: "10px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  border: activeTab === "admin-dashboard" ? "1px solid rgba(245, 158, 11, 0.45)" : "1px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <LayoutDashboard size={14} /> Overview
              </button>

              <button
                onClick={() => setActiveTab("admin-vendors")}
                style={{
                  background: activeTab === "admin-vendors" ? "rgba(245, 158, 11, 0.22)" : "transparent",
                  color: activeTab === "admin-vendors" ? "#FBBF24" : "#CBD5E1",
                  fontWeight: 800,
                  fontSize: "0.84rem",
                  padding: "0.45rem 0.8rem",
                  borderRadius: "10px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  border: activeTab === "admin-vendors" ? "1px solid rgba(245, 158, 11, 0.45)" : "1px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <Store size={14} /> Vendors
              </button>

              <button
                onClick={() => setActiveTab("admin-orders")}
                style={{
                  background: activeTab === "admin-orders" ? "rgba(245, 158, 11, 0.22)" : "transparent",
                  color: activeTab === "admin-orders" ? "#FBBF24" : "#CBD5E1",
                  fontWeight: 800,
                  fontSize: "0.84rem",
                  padding: "0.45rem 0.8rem",
                  borderRadius: "10px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  border: activeTab === "admin-orders" ? "1px solid rgba(245, 158, 11, 0.45)" : "1px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <Package size={14} /> Orders
              </button>

              <button
                onClick={() => setActiveTab("admin-reviews")}
                style={{
                  background: activeTab === "admin-reviews" ? "rgba(245, 158, 11, 0.22)" : "transparent",
                  color: activeTab === "admin-reviews" ? "#FBBF24" : "#CBD5E1",
                  fontWeight: 800,
                  fontSize: "0.84rem",
                  padding: "0.45rem 0.8rem",
                  borderRadius: "10px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  border: activeTab === "admin-reviews" ? "1px solid rgba(245, 158, 11, 0.45)" : "1px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
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
                  background: activeTab === "admin-reports" ? "rgba(245, 158, 11, 0.22)" : "transparent",
                  color: activeTab === "admin-reports" ? "#FBBF24" : "#CBD5E1",
                  fontWeight: 800,
                  fontSize: "0.84rem",
                  padding: "0.45rem 0.8rem",
                  borderRadius: "10px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  border: activeTab === "admin-reports" ? "1px solid rgba(245, 158, 11, 0.45)" : "1px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <BarChart3 size={14} /> Reports
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
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                background: isMobileMenuOpen ? "rgba(0, 229, 201, 0.2)" : "rgba(255, 255, 255, 0.08)",
                border: isMobileMenuOpen ? "1.5px solid #00E5C9" : "1px solid rgba(255, 255, 255, 0.15)",
                color: isMobileMenuOpen ? "#00E5C9" : "#FFFFFF",
                padding: "0.55rem 0.75rem",
                borderRadius: "12px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
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
                  <Compass size={16} /> Marketplace
                </button>

                <button
                  onClick={() => { setActiveTab("stores"); setIsMobileMenuOpen(false); }}
                  style={{
                    background: activeTab === "stores" ? "rgba(0, 229, 201, 0.2)" : "#091322",
                    border: activeTab === "stores" ? "1px solid #00E5C9" : "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    padding: "0.75rem",
                    color: activeTab === "stores" ? "#00E5C9" : "#E2E8F0",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  <Store size={16} /> Island Stores
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
                <button onClick={() => { setActiveTab("vendor-dashboard"); setIsMobileMenuOpen(false); }} style={{ background: "#091322", border: "1px solid rgba(255,255,255,0.1)", color: "#00E5C9", padding: "0.75rem", borderRadius: "12px", fontWeight: 700, fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><LayoutDashboard size={15} /> Dashboard</button>
                <button onClick={() => { setActiveTab("vendor-products"); setIsMobileMenuOpen(false); }} style={{ background: "#091322", border: "1px solid rgba(255,255,255,0.1)", color: "#E2E8F0", padding: "0.75rem", borderRadius: "12px", fontWeight: 700, fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><Package size={15} /> Products</button>
                <button onClick={() => { setActiveTab("vendor-orders"); setIsMobileMenuOpen(false); }} style={{ background: "#091322", border: "1px solid rgba(255,255,255,0.1)", color: "#E2E8F0", padding: "0.75rem", borderRadius: "12px", fontWeight: 700, fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><Package size={15} /> Orders</button>
                <button onClick={() => { setActiveTab("vendor-profile"); setIsMobileMenuOpen(false); }} style={{ background: "#091322", border: "1px solid rgba(255,255,255,0.1)", color: "#E2E8F0", padding: "0.75rem", borderRadius: "12px", fontWeight: 700, fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><Settings size={15} /> Store Profile</button>
                <button onClick={() => { setActiveTab("vendor-reviews"); setIsMobileMenuOpen(false); }} style={{ background: "#091322", border: "1px solid rgba(255,255,255,0.1)", color: "#E2E8F0", padding: "0.75rem", borderRadius: "12px", fontWeight: 700, fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><Star size={15} /> Reviews</button>
              </>
            )}

            {userRole === "admin" && (
              <>
                <button onClick={() => { setActiveTab("admin-dashboard"); setIsMobileMenuOpen(false); }} style={{ background: "#091322", border: "1px solid rgba(255,255,255,0.1)", color: "#FBBF24", padding: "0.75rem", borderRadius: "12px", fontWeight: 700, fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><LayoutDashboard size={15} /> Overview</button>
                <button onClick={() => { setActiveTab("admin-vendors"); setIsMobileMenuOpen(false); }} style={{ background: "#091322", border: "1px solid rgba(255,255,255,0.1)", color: "#E2E8F0", padding: "0.75rem", borderRadius: "12px", fontWeight: 700, fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><Store size={15} /> Vendors</button>
                <button onClick={() => { setActiveTab("admin-orders"); setIsMobileMenuOpen(false); }} style={{ background: "#091322", border: "1px solid rgba(255,255,255,0.1)", color: "#E2E8F0", padding: "0.75rem", borderRadius: "12px", fontWeight: 700, fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><Package size={15} /> Orders</button>
                <button onClick={() => { setActiveTab("admin-reviews"); setIsMobileMenuOpen(false); }} style={{ background: "#091322", border: "1px solid rgba(255,255,255,0.1)", color: "#E2E8F0", padding: "0.75rem", borderRadius: "12px", fontWeight: 700, fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><Star size={15} /> Reviews</button>
                <button onClick={() => { setActiveTab("admin-reports"); setIsMobileMenuOpen(false); }} style={{ background: "#091322", border: "1px solid rgba(255,255,255,0.1)", color: "#E2E8F0", padding: "0.75rem", borderRadius: "12px", fontWeight: 700, fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><BarChart3 size={15} /> Reports</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
