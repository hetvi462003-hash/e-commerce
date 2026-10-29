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
  TrendingUp,
  Tag,
  Truck,
  HeartHandshake
} from "lucide-react";

export default function Home({ setActiveTab, setSelectedVendor, setSelectedProduct }) {
  const { products, categories, formatPrice, addToCart, currency } = useMarketplace();

  // Filter states
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

  // EE345 Structure Sections:
  // 1. Cayman's Choice (Essie's Choice) - Top curated hero products
  const caymansChoice = filteredProducts.filter((p) => p.featured || p.sponsored).slice(0, 4);

  // 2. New Arrivals
  const newArrivals = filteredProducts.slice(0, 8);

  // 3. Special Offers (Items with promotional discounts)
  const specialOffers = filteredProducts.filter((p) => p.price >= 20).slice(0, 4);

  return (
    <div style={{ paddingBottom: "5rem" }}>
      
      {/* 🌴 01. CARIBBEAN LUXURY PROMOTIONAL HERO BANNER */}
      <section
        style={{
          position: "relative",
          minHeight: "530px",
          background: "linear-gradient(135deg, #07192C 0%, #0B2545 40%, #0E355C 70%, #09213D 100%)",
          color: "#FFFFFF",
          overflow: "hidden",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          display: "flex",
          alignItems: "center"
        }}
      >
        {/* Cinematic Caribbean Luxury Hero Background Image */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/cayman_luxury_hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          transform: "scale(1.02)",
          opacity: 0.28
        }} />

        {/* Soft, Luxury Glass Scrim Overlay with Ocean Luster */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 25%, rgba(0, 229, 201, 0.18) 0%, transparent 65%), linear-gradient(180deg, rgba(7, 25, 44, 0.72) 0%, rgba(11, 37, 69, 0.88) 60%, rgba(9, 33, 61, 0.98) 100%)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)"
        }} />

        <div className="container" style={{ position: "relative", zIndex: 10, paddingTop: "5rem", paddingBottom: "5rem", textAlign: "center" }}>
          
          {/* Subtle Island Tag */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(0, 229, 201, 0.12)",
            padding: "0.35rem 1.15rem",
            borderRadius: "999px",
            fontSize: "0.78rem",
            fontWeight: 800,
            color: "#00E5C9",
            letterSpacing: "0.08em",
            marginBottom: "1.5rem",
            border: "1px solid rgba(0, 229, 201, 0.3)"
          }}>
            <span className="pulse-dot"></span>
            <span>GRAND CAYMAN ISLAND • ONLINE SHOPPING STORE</span>
          </div>

          {/* Majestic Headline */}
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "3.5rem",
            color: "#FFFFFF",
            lineHeight: 1.15,
            marginBottom: "1.25rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            maxWidth: "880px",
            marginLeft: "auto",
            marginRight: "auto",
            textShadow: "0 4px 25px rgba(0,0,0,0.6)"
          }}>
            Grand Cayman's Premier <br />
            <span className="gold-foil-text" style={{ fontStyle: "italic", fontWeight: 700 }}>Online Shopping Store</span>
          </h1>

          {/* Clean Subtitle */}
          <p style={{
            fontSize: "1.15rem",
            color: "#CBD5E1",
            lineHeight: 1.6,
            marginBottom: "2.5rem",
            maxWidth: "720px",
            marginLeft: "auto",
            marginRight: "auto",
            textShadow: "0 2px 8px rgba(0,0,0,0.5)"
          }}>
            Discover everyday essentials, handcrafted Caymanite jewelry, Tortuga rum cakes & reef gear.
            Shop online with instant <strong>WhatsApp Checkout</strong>, fast store pickup, or <strong>Island Courier Delivery ($KYD / $USD)</strong> across Grand Cayman.
          </p>

          {/* Spacious Luxury Search Bar */}
          <div style={{
            background: "rgba(255, 255, 255, 0.98)",
            borderRadius: "999px",
            padding: "0.45rem 0.6rem 0.45rem 1.4rem",
            boxShadow: "0 20px 45px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 229, 201, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            maxWidth: "680px",
            marginLeft: "auto",
            marginRight: "auto",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            marginBottom: "2rem"
          }}>
            <Search size={20} color="#00B49F" style={{ flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search products, rum cake, dive gear, sunglasses, jewelry..."
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                color: "#0A1C36",
                fontSize: "0.95rem",
                fontWeight: 600,
                outline: "none",
                boxShadow: "none"
              }}
            />

            <button
              onClick={() => {
                const el = document.getElementById("new-arrivals-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-primary"
              style={{
                padding: "0.75rem 1.6rem",
                borderRadius: "999px",
                fontSize: "0.9rem",
                fontWeight: 800,
                flexShrink: 0
              }}
            >
              Shop Catalog <ArrowRight size={16} />
            </button>
          </div>

          {/* Quick Category Chips */}
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0.5rem", maxWidth: "780px", margin: "0 auto 2.2rem auto" }}>
            {[
              { id: "all", label: "✨ All Products" },
              { id: "cat-1", label: "💎 Artisan Jewelry" },
              { id: "cat-3", label: "🍰 Cayman Gourmet" },
              { id: "cat-2", label: "🤿 Beach & Dive Gear" },
              { id: "cat-4", label: "⌚ Luxury Watches" },
              { id: "cat-5", label: "👕 Island Apparel" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setHeroCategory(cat.id);
                  const el = document.getElementById("categories-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  background: heroCategory === cat.id ? "rgba(0, 229, 201, 0.25)" : "rgba(255, 255, 255, 0.1)",
                  color: heroCategory === cat.id ? "#00E5C9" : "#E2E8F0",
                  border: heroCategory === cat.id ? "1px solid #00E5C9" : "1px solid rgba(255, 255, 255, 0.18)",
                  borderRadius: "999px",
                  padding: "0.4rem 0.95rem",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  backdropFilter: "blur(8px)",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Guarantees with generous spacing */}
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "2.5rem", color: "#E2E8F0", fontSize: "0.88rem", fontWeight: 600 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <Clock size={16} color="#FBBF24" />
              <span>Convenient Store Pickup</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <DollarSign size={16} color="#00E5C9" />
              <span>Cash on Delivery ($KYD / $USD)</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <CheckCircle2 size={16} color="#00E5C9" />
              <span>100% Verified Island Artisans</span>
            </div>
          </div>

        </div>
      </section>

      {/* 🛍️ 02. SHOP BY CATEGORY (Matching EE345) */}
      <section id="categories-section" className="container" style={{ paddingTop: "3.5rem", marginBottom: "4.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "#0A1C36", fontWeight: 900, letterSpacing: "-0.02em" }}>
              Shop by Category
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#64748B", margin: "0.25rem 0 0 0" }}>
              Explore everyday essentials, artisan jewelry, gourmet treats & beach finds
            </p>
          </div>

          <button onClick={() => setActiveTab("categories")} className="btn-outline" style={{ fontSize: "0.85rem", padding: "0.45rem 1rem" }}>
            All products <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1.25rem" }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => {
                setHeroCategory(cat.id);
                setActiveTab("categories");
              }}
              style={{
                background: "#FFFFFF",
                borderRadius: "20px",
                overflow: "hidden",
                border: "1.5px solid #E2E8F0",
                boxShadow: "0 4px 14px rgba(15, 23, 42, 0.04)",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.25s ease"
              }}
            >
              <div style={{ height: "130px", overflow: "hidden", background: "#F1F5F9" }}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                />
              </div>
              <div style={{ padding: "1rem" }}>
                <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0A1C36" }}>{cat.name}</div>
                <div style={{ fontSize: "0.78rem", color: "#00B49F", fontWeight: 700, marginTop: "0.25rem" }}>
                  {cat.count} Products
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ⭐ 03. CAYMAN'S CHOICE / FEATURED PICKS (Matching EE345 "Essie's Choice") */}
      <section className="container" style={{ marginBottom: "4.5rem" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#00B49F", fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <Award size={15} /> Hand-Picked Customer Favorites
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2.2rem", color: "#0A1C36", fontWeight: 900, letterSpacing: "-0.02em" }}>
              Cayman's Choice
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#64748B", margin: "0.25rem 0 0 0" }}>
              Our top recommended local finds with instant WhatsApp ordering & local pickup
            </p>
          </div>

          <button onClick={() => setActiveTab("categories")} className="btn-outline" style={{ fontSize: "0.85rem", padding: "0.45rem 1rem" }}>
            View Catalog <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.75rem" }}>
          {caymansChoice.map((prod, idx) => (
            <div key={prod.id} className={`animate-entrance stagger-${idx + 1}`}>
              <ProductCard
                product={prod}
                onSelectProduct={(p, directReserve = false) => {
                  if (directReserve) {
                    setSelectedProduct(p);
                    setActiveTab("checkout");
                  } else {
                    setQuickViewProduct(p);
                  }
                }}
                onVisitStore={(v) => {
                  setSelectedVendor(v);
                  setActiveTab("store-detail");
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ✨ 04. NEW ARRIVALS (Matching EE345 "New Arrivals") */}
      <section id="new-arrivals-section" className="container" style={{ marginBottom: "4.5rem" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#0284C7", fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <Sparkles size={15} /> Fresh From Island Artisans
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2.2rem", color: "#0A1C36", fontWeight: 900, letterSpacing: "-0.02em" }}>
              New Arrivals
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#64748B", margin: "0.25rem 0 0 0" }}>
              Recently listed treasures, beachwear, gifts and pantry items
            </p>
          </div>

          <button onClick={() => setActiveTab("categories")} className="btn-outline" style={{ fontSize: "0.85rem", padding: "0.45rem 1rem" }}>
            See all ({products.length}) <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.75rem" }}>
          {newArrivals.map((prod, idx) => (
            <div key={prod.id} className={`animate-entrance stagger-${(idx % 4) + 1}`}>
              <ProductCard
                product={prod}
                onSelectProduct={(p, directReserve = false) => {
                  if (directReserve) {
                    setSelectedProduct(p);
                    setActiveTab("checkout");
                  } else {
                    setQuickViewProduct(p);
                  }
                }}
                onVisitStore={(v) => {
                  setSelectedVendor(v);
                  setActiveTab("store-detail");
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 🔥 05. SPECIAL OFFERS / DEALS (Matching EE345 "Special Offers") */}
      <section className="container" style={{ marginBottom: "5rem" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#EF4444", fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <Tag size={15} /> Island Deals & Duty-Free Promotions
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2.2rem", color: "#0A1C36", fontWeight: 900, letterSpacing: "-0.02em" }}>
              Special Offers
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#64748B", margin: "0.25rem 0 0 0" }}>
              Limited-time discounts on premium jewelry, rum gift packs, and snorkeling gear
            </p>
          </div>

          <button onClick={() => setActiveTab("categories")} className="btn-outline" style={{ fontSize: "0.85rem", padding: "0.45rem 1rem" }}>
            See all offers <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.75rem" }}>
          {specialOffers.map((prod, idx) => {
            const originalPrice = (prod.price * 1.25).toFixed(2);
            const savings = (originalPrice - prod.price).toFixed(2);

            return (
              <div key={prod.id} className={`animate-entrance stagger-${idx + 1}`} style={{ position: "relative" }}>
                {/* Sale Pill Top Right */}
                <div style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  zIndex: 10,
                  background: "#EF4444",
                  color: "#FFFFFF",
                  fontWeight: 900,
                  fontSize: "0.74rem",
                  padding: "0.25rem 0.65rem",
                  borderRadius: "999px",
                  boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)",
                  letterSpacing: "0.05em"
                }}>
                  SALE • SAVE CI${savings}
                </div>

                <ProductCard
                  product={prod}
                  onSelectProduct={(p, directReserve = false) => {
                    if (directReserve) {
                      setSelectedProduct(p);
                      setActiveTab("checkout");
                    } else {
                      setQuickViewProduct(p);
                    }
                  }}
                  onVisitStore={(v) => {
                    setSelectedVendor(v);
                    setActiveTab("store-detail");
                  }}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* 🛡️ 06. WHY SHOP WITH US (Matching EE345 "Why Shop With Us") */}
      <section style={{ padding: "4rem 0", background: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0", marginBottom: "5rem" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 3rem auto" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#00B49F", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>
              CaymanBazaar Guarantees
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2.4rem", color: "#0A1C36", fontWeight: 900, margin: 0 }}>
              Why Shop With Us
            </h2>
            <p style={{ color: "#64748B", fontSize: "1rem", marginTop: "0.5rem" }}>
              Proudly serving Grand Cayman residents, condo guests & resort visitors with effortless shopping
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.75rem" }}>
            
            {/* 1. Shop Local */}
            <div style={{ background: "#FFFFFF", padding: "1.85rem", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "0 4px 16px rgba(15,23,42,0.04)" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#E6FBF2", color: "#00A896", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                <Palmtree size={24} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0A1C36", marginBottom: "0.35rem" }}>
                Shop Local
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#64748B", lineHeight: 1.5, margin: 0 }}>
                Proudly supporting Grand Cayman artisans, makers, and local businesses across all three islands.
              </p>
            </div>

            {/* 2. Quality Items */}
            <div style={{ background: "#FFFFFF", padding: "1.85rem", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "0 4px 16px rgba(15,23,42,0.04)" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#FEF3C7", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0A1C36", marginBottom: "0.35rem" }}>
                Quality Items
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#64748B", lineHeight: 1.5, margin: 0 }}>
                Genuine Caymanite stones, authentic aged rum cakes, and products backed by local seller warranties.
              </p>
            </div>

            {/* 3. WhatsApp Direct Support */}
            <div style={{ background: "#FFFFFF", padding: "1.85rem", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "0 4px 16px rgba(15,23,42,0.04)" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#DCFCE7", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                <MessageSquare size={24} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0A1C36", marginBottom: "0.35rem" }}>
                WhatsApp Direct Support
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#64748B", lineHeight: 1.5, margin: 0 }}>
                Talk directly with our local Cayman support team for item sizing, availability, or custom requests.
              </p>
            </div>

            {/* 4. Convenient Ordering */}
            <div style={{ background: "#FFFFFF", padding: "1.85rem", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "0 4px 16px rgba(15,23,42,0.04)" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#E0F2FE", color: "#0284C7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                <ShoppingBag size={24} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0A1C36", marginBottom: "0.35rem" }}>
                Convenient Ordering
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#64748B", lineHeight: 1.5, margin: 0 }}>
                Build your bag in minutes and place itemized order requests with no mandatory online card fees.
              </p>
            </div>

            {/* 5. Pickup & Courier Delivery */}
            <div style={{ background: "#FFFFFF", padding: "1.85rem", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "0 4px 16px rgba(15,23,42,0.04)" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#F3E8FF", color: "#9333EA", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                <Truck size={24} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0A1C36", marginBottom: "0.35rem" }}>
                Pickup & Island Delivery
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#64748B", lineHeight: 1.5, margin: 0 }}>
                Convenient store collection at Georgetown or Seven Mile Beach, or 24h courier delivery to your resort.
              </p>
            </div>

            {/* 6. Pay on Delivery (COD) */}
            <div style={{ background: "#FFFFFF", padding: "1.85rem", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "0 4px 16px rgba(15,23,42,0.04)" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#CCFBF1", color: "#0F766E", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                <DollarSign size={24} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0A1C36", marginBottom: "0.35rem" }}>
                Cash on Delivery ($KYD / $USD)
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#64748B", lineHeight: 1.5, margin: 0 }}>
                Pay cash upon delivery or pickup in either Cayman Dollars or US Dollars with 0% island sales tax.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 💬 07. KEEP UP WITH CAYMANBAZAAR (Matching EE345 WhatsApp Channel Banner) */}
      <section className="container" style={{ marginBottom: "5rem" }}>
        <div style={{
          background: "linear-gradient(135deg, #07192C 0%, #0B2545 100%)",
          borderRadius: "28px",
          padding: "3.5rem 2.5rem",
          color: "#FFFFFF",
          textAlign: "center",
          border: "1px solid rgba(0, 229, 201, 0.3)",
          boxShadow: "0 20px 45px rgba(0, 0, 0, 0.25)",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0, 229, 201, 0.2) 0%, transparent 70%)"
          }} />

          <div style={{ position: "relative", zIndex: 2, maxWidth: "640px", margin: "0 auto" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(37, 211, 102, 0.2)", color: "#25D366", padding: "0.3rem 0.85rem", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 800, marginBottom: "1rem" }}>
              <MessageCircle size={15} /> INSTANT ISLAND UPDATES
            </div>

            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2.4rem", fontWeight: 900, marginBottom: "0.85rem", color: "#FFFFFF" }}>
              Keep Up with CaymanBazaar
            </h2>
            <p style={{ color: "#CBD5E1", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "2rem" }}>
              Get new island finds, artisan arrivals, and exclusive duty-free flash offers directly in your inbox or on WhatsApp.
            </p>

            {newsletterSubscribed ? (
              <div style={{ background: "rgba(37, 211, 102, 0.2)", border: "1px solid #25D366", color: "#25D366", padding: "1rem 1.5rem", borderRadius: "16px", fontWeight: 800 }}>
                🎉 Thank you for subscribing! We'll keep you updated on new Cayman treasures.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newsletterEmail) setNewsletterSubscribed(true);
                }}
                style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "1.75rem" }}
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  style={{
                    flex: "1 1 280px",
                    maxWidth: "380px",
                    padding: "0.85rem 1.25rem",
                    borderRadius: "999px",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    background: "rgba(255, 255, 255, 0.95)",
                    color: "#0A1C36",
                    fontWeight: 600,
                    outline: "none"
                  }}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: "0.85rem 1.75rem", borderRadius: "999px", fontWeight: 800 }}
                >
                  Subscribe
                </button>
              </form>
            )}

            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
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
                  padding: "0.75rem 1.5rem",
                  borderRadius: "999px",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(37, 211, 102, 0.35)"
                }}
              >
                <MessageCircle size={18} /> Follow CaymanBazaar on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 08. IMMERSIVE PRODUCT QUICK-VIEW MODAL */}
      {quickViewProduct && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            background: "rgba(5, 11, 20, 0.8)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem"
          }}
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="modal-animate"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#FFFFFF",
              borderRadius: "28px",
              maxWidth: "680px",
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
              border: "1px solid #E2E8F0",
              position: "relative"
            }}
          >
            <button
              onClick={() => setQuickViewProduct(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "#F1F5F9",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748B",
                zIndex: 10,
                cursor: "pointer"
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
              <div style={{ height: "340px", background: "#050B14", overflow: "hidden" }}>
                <img
                  src={quickViewProduct.images[0]}
                  alt={quickViewProduct.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div style={{ padding: "2rem", display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "0.8rem", color: "#00B49F", fontWeight: 800, textTransform: "uppercase", marginBottom: "0.3rem" }}>
                  {quickViewProduct.category_name || "Grand Cayman Specialty"}
                </div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#0A1C36", marginBottom: "0.75rem" }}>
                  {quickViewProduct.title}
                </h3>
                <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#0A1C36", marginBottom: "0.85rem" }}>
                  {formatPrice(quickViewProduct.price)}
                  {currency === "KYD" && (
                    <span style={{ fontSize: "0.85rem", color: "#64748B", marginLeft: "0.5rem", fontWeight: 600 }}>
                      (~${(quickViewProduct.price * 1.2).toFixed(2)} USD)
                    </span>
                  )}
                </div>
                <p style={{ color: "#64748B", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
                  {quickViewProduct.description}
                </p>

                <div style={{ marginTop: "auto", display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct, {}, 1);
                      setQuickViewProduct(null);
                    }}
                    className="btn-primary"
                    style={{ flex: 1, padding: "0.75rem" }}
                  >
                    <ShoppingBag size={16} /> Add to Bag
                  </button>

                  <a
                    href={`https://wa.me/13459492299?text=${encodeURIComponent(`Hello! I would like to order: "${quickViewProduct.title}" (Price: ${formatPrice(quickViewProduct.price)}) on CaymanBazaar.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp"
                    style={{ flex: 1, padding: "0.75rem", textDecoration: "none" }}
                  >
                    <MessageCircle size={16} /> WhatsApp Order
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
