import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import ProductCard from "../../components/ProductCard";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  ShoppingBag,
  Award,
  DollarSign,
  Search,
  CheckCircle2,
  Eye,
  X,
  Palmtree,
  MessageSquare,
  MessageCircle,
  Percent,
  Tag,
  Truck,
  ShoppingCart,
  Store,
  Lock,
  Zap,
  MapPin
} from "lucide-react";

export default function Home({ setActiveTab, setSelectedProduct, setSelectedCategory }) {
  const { products, categories, formatPrice, addToCart, currency } = useMarketplace();

  // Filter & Search states
  const [heroSearch, setHeroSearch] = useState("");
  const [heroCategory, setHeroCategory] = useState("all");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Quick View Product Modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Filtered products for search & category filter
  const filteredProducts = products.filter((p) => {
    const matchesCategory = heroCategory === "all" || p.category_id === heroCategory;
    const matchesSearch = heroSearch === "" ||
      p.title.toLowerCase().includes(heroSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(heroSearch.toLowerCase()) ||
      (p.category_name && p.category_name.toLowerCase().includes(heroSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // 1. Essie's Choice / Cayman's Choice (Top curated hero products)
  const featuredOnly = filteredProducts.filter((p) => p.featured || p.sponsored);
  const caymansChoice = (featuredOnly.length > 0 ? featuredOnly : filteredProducts).slice(0, 4);

  // 2. New Arrivals (Latest additions)
  const newArrivals = filteredProducts.slice(0, 8);

  // 3. Special Offers (Promotional items)
  const specialOffers = filteredProducts.filter((p) => p.price >= 20).slice(0, 4);

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", paddingBottom: "2.5rem" }}>
      
      {/* 🌴 01. EE345-STYLE PROMOTIONAL HERO BANNER (Clean, Light & Vibrant) */}
      <section style={{ paddingTop: "1.25rem", marginBottom: "2rem" }}>
        <div className="container">
          <div
            style={{
              position: "relative",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
              border: "1px solid #F1F5F9",
              background: "#FFF1F2"
            }}
          >
            {/* Promo Banner Image */}
            <img
              src="/cayman_promo_hero_banner.jpg"
              alt="Grand Cayman Online Shopping - Everything Essential"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "460px",
                objectFit: "cover",
                display: "block"
              }}
            />

            {/* Slider Dots (EE345 style) */}
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(255, 255, 255, 0.8)",
                padding: "0.3rem 0.75rem",
                borderRadius: "999px",
                backdropFilter: "blur(4px)"
              }}
            >
              <span style={{ width: "16px", height: "6px", borderRadius: "999px", background: "#0F172A", display: "inline-block" }} />
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#CBD5E1", display: "inline-block" }} />
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#CBD5E1", display: "inline-block" }} />
            </div>
          </div>
        </div>
      </section>

      {/* 🛍️ 02. SHOP BY CATEGORY (Matching EE345 exactly) */}
      <section id="categories-section" className="container" style={{ marginBottom: "2.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "1.55rem", color: "#111827", fontWeight: 800, margin: 0 }}>
            Shop by Category
          </h2>

          <button
            onClick={() => {
              if (setSelectedCategory) setSelectedCategory("all");
              setActiveTab("categories");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#0284C7",
              fontSize: "0.9rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem"
            }}
          >
            All products <ArrowRight size={14} />
          </button>
        </div>

        {/* Categories Grid (EE345 clean card style) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1.25rem" }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                if (setSelectedCategory) setSelectedCategory(cat.id);
                setActiveTab("categories");
              }}
              style={{
                background: "#FFFFFF",
                borderRadius: "16px",
                border: "1px solid #E5E7EB",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
                padding: "1.2rem 1rem",
                textAlign: "center",
                cursor: "pointer",
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 18px rgba(0, 0, 0, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.03)";
              }}
            >
              <div
                style={{
                  height: "120px",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.75rem",
                  overflow: "hidden",
                  borderRadius: "10px"
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block"
                  }}
                />
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>
                {cat.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ⭐ 03. ESSIE'S CHOICE / CAYMAN'S CHOICE (Matching EE345) */}
      <section className="container" style={{ marginBottom: "2.25rem" }}>
        <div style={{ marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "1.55rem", color: "#111827", fontWeight: 800, margin: 0 }}>
            Essie's Choice
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {caymansChoice.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelectProduct={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* ✨ 04. NEW ARRIVALS (Matching EE345) */}
      <section id="new-arrivals-section" className="container" style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "1.55rem", color: "#111827", fontWeight: 800, margin: 0 }}>
            New Arrivals
          </h2>

          <button
            onClick={() => {
              if (setSelectedCategory) setSelectedCategory("all");
              setActiveTab("categories");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#0284C7",
              fontSize: "0.9rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem"
            }}
          >
            See all <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {newArrivals.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelectProduct={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 🔥 05. SPECIAL OFFERS (Matching EE345) */}
      <section id="special-offers-section" className="container" style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "1.55rem", color: "#111827", fontWeight: 800, margin: 0 }}>
            Special Offers
          </h2>

          <button
            onClick={() => {
              if (setSelectedCategory) setSelectedCategory("all");
              setActiveTab("categories");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#0284C7",
              fontSize: "0.9rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem"
            }}
          >
            See all <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {specialOffers.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelectProduct={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 🛡️ 06. WHY SHOP WITH US (High-converting Trust Section) */}
      <section style={{ padding: "3.5rem 0", background: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0", marginBottom: "3rem" }}>
        <div className="container">
          
          {/* Section Header */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "2.25rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", fontWeight: 800, color: "#00A896", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              <span>🌴</span> Why Cayman Shoppers Choose Us
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
              <h2 style={{ fontSize: "1.9rem", color: "#0F172A", fontWeight: 900, margin: 0, letterSpacing: "-0.02em" }}>
                Why Shop With Us
              </h2>
              <span style={{ fontSize: "0.86rem", color: "#64748B", fontWeight: 600 }}>
                Authentic Cayman products • Fast local delivery • WhatsApp verified
              </span>
            </div>
          </div>

          {/* 6 Balanced Feature Cards (3x2 Grid on desktop) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
            
            {/* Card 1: Shop Local */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "18px",
                border: "1.5px solid #E2E8F0",
                padding: "1.6rem 1.4rem",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.25s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                cursor: "default"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 168, 150, 0.1)";
                e.currentTarget.style.borderColor = "#00A896";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)";
                e.currentTarget.style.borderColor = "#E2E8F0";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "#CCFBF1", display: "flex", alignItems: "center", justifyContent: "center", color: "#0D9488" }}>
                  <Store size={22} />
                </div>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, padding: "0.25rem 0.65rem", borderRadius: "999px", background: "#F0FDFA", color: "#0D9488", border: "1px solid #CCFBF1" }}>
                  📍 Grand Cayman
                </span>
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.4rem" }}>
                Shop Local
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#475569", lineHeight: 1.55, margin: 0 }}>
                Proudly connecting Cayman residents and visitors with authentic local boutiques, artisans, distilleries, and retail partners across the islands.
              </p>
            </div>

            {/* Card 2: Quality Items */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "18px",
                border: "1.5px solid #E2E8F0",
                padding: "1.6rem 1.4rem",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.25s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                cursor: "default"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(22, 163, 74, 0.1)";
                e.currentTarget.style.borderColor = "#16A34A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)";
                e.currentTarget.style.borderColor = "#E2E8F0";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", color: "#16A34A" }}>
                  <ShieldCheck size={22} />
                </div>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, padding: "0.25rem 0.65rem", borderRadius: "999px", background: "#F0FDF4", color: "#16A34A", border: "1px solid #DCFCE7" }}>
                  ✓ 100% Verified
                </span>
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.4rem" }}>
                Quality Items
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#475569", lineHeight: 1.55, margin: 0 }}>
                Hand-curated island catalog with genuine Caymanite gemstone jewelry, award-winning rum cakes, premium dive gear, and top-tier electronics.
              </p>
            </div>

            {/* Card 3: Secure Checkout */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "18px",
                border: "1.5px solid #E2E8F0",
                padding: "1.6rem 1.4rem",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.25s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                cursor: "default"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(79, 70, 229, 0.1)";
                e.currentTarget.style.borderColor = "#4F46E5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)";
                e.currentTarget.style.borderColor = "#E2E8F0";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#4F46E5" }}>
                  <Lock size={22} />
                </div>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, padding: "0.25rem 0.65rem", borderRadius: "999px", background: "#F5F3FF", color: "#4F46E5", border: "1px solid #E0E7FF" }}>
                  🔒 No Card Stored
                </span>
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.4rem" }}>
                Secure Checkout
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#475569", lineHeight: 1.55, margin: 0 }}>
                Transparent pricing with 0% hidden fees. Pay upon delivery or in-store collection with Cash (COD), local bank transfer, or card POS terminal.
              </p>
            </div>

            {/* Card 4: Convenient Ordering */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "18px",
                border: "1.5px solid #E2E8F0",
                padding: "1.6rem 1.4rem",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.25s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                cursor: "default"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(217, 119, 6, 0.1)";
                e.currentTarget.style.borderColor = "#D97706";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)";
                e.currentTarget.style.borderColor = "#E2E8F0";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", color: "#D97706" }}>
                  <Zap size={22} />
                </div>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, padding: "0.25rem 0.65rem", borderRadius: "999px", background: "#FFFBEB", color: "#B45309", border: "1px solid #FEF3C7" }}>
                  ⚡ 1-Tap Reserve
                </span>
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.4rem" }}>
                Convenient Ordering
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#475569", lineHeight: 1.55, margin: 0 }}>
                Build your multi-vendor cart across multiple island shops in minutes, review Cayman Dollar totals, and receive pre-formatted WhatsApp order receipts.
              </p>
            </div>

            {/* Card 5: WhatsApp Support */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "18px",
                border: "1.5px solid #E2E8F0",
                padding: "1.6rem 1.4rem",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.25s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                cursor: "default"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(37, 211, 102, 0.15)";
                e.currentTarget.style.borderColor = "#25D366";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)";
                e.currentTarget.style.borderColor = "#E2E8F0";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", color: "#16A34A" }}>
                  <MessageCircle size={22} />
                </div>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, padding: "0.25rem 0.65rem", borderRadius: "999px", background: "#F0FDF4", color: "#15803D", border: "1px solid #DCFCE7" }}>
                  💬 WhatsApp Live
                </span>
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.4rem" }}>
                WhatsApp Support
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#475569", lineHeight: 1.55, margin: 0 }}>
                Direct, friendly customer care located right in Grand Cayman. Message our team anytime for product inquiries, bulk gift orders, or delivery timing.
              </p>
            </div>

            {/* Card 6: Pickup & Delivery */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "18px",
                border: "1.5px solid #E2E8F0",
                padding: "1.6rem 1.4rem",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.25s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                cursor: "default"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(2, 132, 199, 0.1)";
                e.currentTarget.style.borderColor = "#0284C7";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)";
                e.currentTarget.style.borderColor = "#E2E8F0";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "#E0F2FE", display: "flex", alignItems: "center", justifyContent: "center", color: "#0284C7" }}>
                  <Truck size={22} />
                </div>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, padding: "0.25rem 0.65rem", borderRadius: "999px", background: "#F0F9FF", color: "#0369A1", border: "1px solid #BAE6FD" }}>
                  🚚 FREE over CI$50
                </span>
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.4rem" }}>
                Pickup & Island Delivery
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#475569", lineHeight: 1.55, margin: 0 }}>
                Dispatched directly to Seven Mile Beach resorts, George Town condos, and West Bay residences, or ready for swift in-store customer pickup.
              </p>
            </div>

          </div>

          {/* 🌟 Cayman Islands Marketplace Mission Banner */}
          <div
            style={{
              background: "linear-gradient(135deg, #0A1C36 0%, #0F2D54 100%)",
              borderRadius: "20px",
              padding: "2rem 2.25rem",
              color: "#FFFFFF",
              boxShadow: "0 10px 30px rgba(10, 28, 54, 0.12)",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem"
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "rgba(0, 229, 201, 0.15)",
                  color: "#00E5C9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem",
                  flexShrink: 0
                }}
              >
                🌴
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.4rem 0" }}>
                  CaymanBazaar • Grand Cayman's Premier Local Marketplace
                </h4>
                <p style={{ margin: 0, color: "#94A3B8", fontSize: "0.9rem", lineHeight: 1.6 }}>
                  CaymanBazaar is a locally owned online store in Grand Cayman offering a thoughtfully selected range of everyday essentials, artisan jewelry, Caymanite stones, gourmet rum treats, beach accessories, and island home finds. Shop securely online with convenient pickup and island-wide delivery.
                </p>
                <div style={{ marginTop: "0.5rem", fontWeight: 700, color: "#00E5C9", fontSize: "0.92rem" }}>
                  Shop local. Support Cayman Islands business.
                </div>
              </div>
            </div>

            {/* Trust Pills Row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
                paddingTop: "1rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            >
              {[
                "🇰🇾 Locally Owned & Operated",
                "🚚 Island-Wide Courier Delivery",
                "💬 WhatsApp Direct Order Confirmation",
                "💎 0% Island Sales Tax"
              ].map((badge, bIdx) => (
                <span
                  key={bIdx}
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "999px",
                    padding: "0.35rem 0.85rem",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: "#E2E8F0"
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 💬 07. KEEP UP WITH CAYMANBAZAAR (Matching EE345) */}
      <section className="container" style={{ marginBottom: "3rem" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#111827", marginBottom: "0.5rem" }}>
            Keep up with CaymanBazaar
          </h2>
          <p style={{ color: "#6B7280", fontSize: "0.95rem", marginBottom: "1.75rem" }}>
            Get new finds, store news and current offers in your inbox.
          </p>

          {newsletterSubscribed ? (
            <div style={{ background: "#D1FAE5", color: "#065F46", padding: "0.85rem", borderRadius: "8px", fontWeight: 700 }}>
              ✓ Thank you for subscribing to CaymanBazaar updates!
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail) setNewsletterSubscribed(true);
              }}
              style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "1.5rem" }}
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                style={{
                  flex: 1,
                  maxWidth: "360px",
                  padding: "0.65rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "0.9rem",
                  outline: "none"
                }}
              />
              <button
                type="submit"
                style={{
                  background: "#0F172A",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.65rem 1.25rem",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Subscribe
              </button>
            </form>
          )}

          {/* Follow on WhatsApp Channel Button */}
          <div style={{ marginTop: "1rem" }}>
            <a
              href="https://wa.me/13459492299?text=Hello%20CaymanBazaar%2C%20I%20would%20like%20to%20follow%20your%20WhatsApp%20updates!"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#25D366",
                color: "#FFFFFF",
                padding: "0.65rem 1.4rem",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.9rem",
                textDecoration: "none"
              }}
            >
              <MessageCircle size={18} /> Follow CaymanBazaar on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* 🌟 08. PRODUCT QUICK-VIEW MODAL (EE345 style) */}
      {quickViewProduct && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem"
          }}
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              maxWidth: "680px",
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2)",
              border: "1px solid #E5E7EB",
              position: "relative"
            }}
          >
            <button
              onClick={() => setQuickViewProduct(null)}
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                background: "#F3F4F6",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#4B5563",
                cursor: "pointer",
                zIndex: 10
              }}
            >
              <X size={16} />
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
              <div style={{ height: "320px", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                <img
                  src={quickViewProduct.images[0]}
                  alt={quickViewProduct.title}
                  style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                />
              </div>

              <div style={{ padding: "1.75rem", display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "0.78rem", color: "#0284C7", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.3rem" }}>
                  {quickViewProduct.category_name || "Everyday Essential"}
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#111827", marginBottom: "0.6rem" }}>
                  {quickViewProduct.title}
                </h3>
                <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#111827", marginBottom: "0.75rem" }}>
                  {currency === "KYD" ? `CI$${Number(quickViewProduct.price).toFixed(2)}` : formatPrice(quickViewProduct.price)}
                </div>
                <p style={{ color: "#4B5563", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
                  {quickViewProduct.description}
                </p>

                <div style={{ marginTop: "auto" }}>
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct, {}, 1);
                      setQuickViewProduct(null);
                    }}
                    style={{
                      width: "100%",
                      background: "#D1FAE5",
                      color: "#065F46",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.75rem 1rem",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      cursor: "pointer"
                    }}
                  >
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
