import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import StoreCard from "../../components/StoreCard";
import ProductCard from "../../components/ProductCard";
import { CAYMAN_DISTRICTS } from "../../data/mockData";
import {
  Sparkles,
  Store,
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  ShoppingBag,
  Award,
  Compass,
  DollarSign,
  Search,
  CheckCircle2,
  Map,
  ChevronRight,
  Waves,
  Eye,
  X,
  Palmtree,
  Camera,
  MessageSquare,
  MessageCircle
} from "lucide-react";

export default function Home({ setActiveTab, setSelectedVendor, setSelectedProduct }) {
  const { vendors, products, categories, formatPrice, addToCart } = useMarketplace();

  // Filter states
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [heroSearch, setHeroSearch] = useState("");
  const [heroCategory, setHeroCategory] = useState("all");

  // Quick View Product Modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Approved active vendors ONLY on public marketplace
  const liveVendors = vendors.filter((v) => v.status === "active");

  // Filtered vendors based on district selection
  const filteredVendors = liveVendors.filter((v) => {
    const matchesDistrict = selectedDistrict === "all" || v.district === selectedDistrict;
    const matchesSearch = heroSearch === "" ||
      v.store_name.toLowerCase().includes(heroSearch.toLowerCase()) ||
      v.bio.toLowerCase().includes(heroSearch.toLowerCase()) ||
      (v.specialty && v.specialty.toLowerCase().includes(heroSearch.toLowerCase()));
    return matchesDistrict && matchesSearch;
  });

  // Filtered products for trending showcase (from approved active vendors!)
  const filteredProducts = products.filter((p) => {
    const vendorObj = vendors.find(v => v.id === p.vendor_id);
    const isVendorLive = vendorObj ? vendorObj.status === "active" : true;
    const matchesDistrict = selectedDistrict === "all" || vendorObj?.district === selectedDistrict;
    const matchesCategory = heroCategory === "all" || p.category_id === heroCategory;
    const matchesSearch = heroSearch === "" ||
      p.title.toLowerCase().includes(heroSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(heroSearch.toLowerCase());
    return isVendorLive && matchesDistrict && matchesCategory && matchesSearch;
  });

  const featuredStores = filteredVendors.slice(0, 4);
  const trendingItems = filteredProducts.slice(0, 8);

  return (
    <div style={{ paddingBottom: "5rem" }}>
      
      {/* 🌴 ELEGANT & SPACIOUS CARIBBEAN HERO SECTION */}
      <section
        style={{
          position: "relative",
          minHeight: "560px",
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
          backgroundImage: "url('/cayman_market_promenade.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 45%",
          transform: "scale(1.02)",
          opacity: 0.28
        }} />

        {/* Soft, Luxury Glass Scrim Overlay with Vibrant Ocean Luster */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 25%, rgba(0, 229, 201, 0.18) 0%, transparent 65%), linear-gradient(180deg, rgba(7, 25, 44, 0.7) 0%, rgba(11, 37, 69, 0.88) 60%, rgba(9, 33, 61, 0.98) 100%)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)"
        }} />

        <div className="container" style={{ position: "relative", zIndex: 10, paddingTop: "5.5rem", paddingBottom: "5.5rem", textAlign: "center" }}>
          
          {/* Subtle Island Tag */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(0, 229, 201, 0.12)",
            padding: "0.35rem 1.1rem",
            borderRadius: "999px",
            fontSize: "0.78rem",
            fontWeight: 800,
            color: "#00E5C9",
            letterSpacing: "0.08em",
            marginBottom: "1.5rem",
            border: "1px solid rgba(0, 229, 201, 0.3)"
          }}>
            <span className="pulse-dot"></span>
            <span>GRAND CAYMAN ISLAND • LOCAL ONLINE MARKETPLACE</span>
          </div>

          {/* Majestic Headline with breathing room */}
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "3.6rem",
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
            <span className="gold-foil-text" style={{ fontStyle: "italic", fontWeight: 700 }}>Local Online Marketplace</span>
          </h1>

          {/* Clean, Refined Subtitle */}
          <p style={{
            fontSize: "1.15rem",
            color: "#CBD5E1",
            lineHeight: 1.6,
            marginBottom: "2.5rem",
            maxWidth: "700px",
            marginLeft: "auto",
            marginRight: "auto",
            textShadow: "0 2px 8px rgba(0,0,0,0.5)"
          }}>
            Discover artisanal Caymanite gems, Tortuga rum treats, beachwear & everyday essentials.
            Order online with fast <strong>WhatsApp Checkout</strong> for convenient store pickup or request <strong>Island Courier Delivery ($KYD / $USD)</strong> to your residence or resort.
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
              placeholder="Search Caymanite, rum cakes, dive gear, stores..."
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
                const el = document.getElementById("stores-section");
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
              Explore Stores <ArrowRight size={16} />
            </button>
          </div>

          {/* Quick Category Chips for Fast Discovery */}
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0.5rem", maxWidth: "780px", margin: "0 auto 2.2rem auto" }}>
            {[
              { id: "all", label: "✨ All Categories" },
              { id: "cat-1", label: "💎 Artisan Jewelry" },
              { id: "cat-2", label: "🍰 Cayman Gourmet" },
              { id: "cat-3", label: "🤿 Beach & Dive Gear" },
              { id: "cat-4", label: "⌚ Luxury Watches" },
              { id: "cat-5", label: "🎨 Island Crafts" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setHeroCategory(cat.id);
                  const el = document.getElementById("stores-section");
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

          {/* Clean 3 Guarantees with generous spacing */}
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "2.5rem", color: "#E2E8F0", fontSize: "0.88rem", fontWeight: 600 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <Clock size={16} color="#FBBF24" />
              <span>Convenient Store Pickup</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <DollarSign size={16} color="#00E5C9" />
              <span>Pay Cash on Delivery ($KYD / $USD)</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <CheckCircle2 size={16} color="#00E5C9" />
              <span>Licensed Cayman Merchants</span>
            </div>
          </div>

        </div>
      </section>

      {/* 🏝️ CLEAN & SPACIOUS DISTRICT FILTER PROMENADE */}
      <section style={{ padding: "3rem 0 1.5rem 0", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#00B49F", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Filter by Island Location
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                Explore Island Districts
              </h3>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                onClick={() => setSelectedDistrict("all")}
                style={{
                  background: selectedDistrict === "all" ? "#0F172A" : "#FFFFFF",
                  color: selectedDistrict === "all" ? "#FFFFFF" : "#475569",
                  padding: "0.5rem 1.1rem",
                  borderRadius: "999px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  border: selectedDistrict === "all" ? "1px solid #0F172A" : "1.5px solid #CBD5E1",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                All Cayman ({liveVendors.length} Stores)
              </button>

              {CAYMAN_DISTRICTS.map((dist) => {
                const count = liveVendors.filter(v => v.district === dist).length;
                if (count === 0) return null;
                return (
                  <button
                    key={dist}
                    onClick={() => setSelectedDistrict(dist)}
                    style={{
                      background: selectedDistrict === dist ? "#00A896" : "#FFFFFF",
                      color: selectedDistrict === dist ? "#FFFFFF" : "#475569",
                      padding: "0.5rem 1.1rem",
                      borderRadius: "999px",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      border: selectedDistrict === dist ? "1px solid #00A896" : "1.5px solid #CBD5E1",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    📍 {dist} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 🎪 VIRTUAL BOUTIQUE STORES SECTION */}
      <section id="stores-section" className="container" style={{ marginBottom: "5rem" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.25rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#00B49F", fontSize: "0.84rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <Store size={16} /> Grand Cayman Promenade of Boutiques
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.6rem", color: "#0A1C36", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Featured Island Stores & Boutiques
            </h2>
            <p style={{ fontSize: "1rem", color: "#64748B" }}>
              Discover authentic local boutiques across Georgetown, Seven Mile Beach, Rum Point & Bodden Town
            </p>
          </div>

          <button onClick={() => setActiveTab("stores")} className="btn-outline">
            Browse All Stores ({liveVendors.length}) <ArrowRight size={15} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: "1.85rem" }}>
          {featuredStores.map((vendor, idx) => (
            <div key={vendor.id} className={`animate-entrance stagger-${idx + 1}`}>
              <StoreCard
                vendor={vendor}
                onVisitStore={(v) => {
                  setSelectedVendor(v);
                  setActiveTab("store-detail");
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 💎 3 PILLAR EXPERIENCES: WHATSAPP DIRECT, COURIER COD, INDEPENDENT STORES */}
      <section className="container" style={{ marginBottom: "5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.75rem" }}>
          
          {/* Card 1: PIN Reserve */}
          <div className="animate-entrance stagger-1" style={{ height: "100%" }}>
            <div
              className="pillar-card pillar-card-gold"
              style={{
                background: "linear-gradient(145deg, #FFFFFF 0%, #FFFDF9 100%)",
                padding: "2.25rem",
                borderRadius: "26px",
                border: "1.5px solid rgba(245, 158, 11, 0.25)",
                boxShadow: "0 12px 32px rgba(245, 158, 11, 0.08)",
                height: "100%",
                boxSizing: "border-box"
              }}
            >
              <div style={{ display: "inline-block", background: "#E6FBF2", color: "#00A896", padding: "0.22rem 0.65rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "1rem" }}>
                PILLAR 01 • DIRECT WHATSAPP COMMERCE
              </div>
              <div
                className="pillar-icon-box"
                style={{
                  background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                  color: "#FFFFFF",
                  width: "60px",
                  height: "60px",
                  borderRadius: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                  boxShadow: "0 8px 18px rgba(37, 211, 102, 0.3)"
                }}
              >
                <MessageSquare size={30} />
              </div>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.45rem", marginBottom: "0.6rem", color: "#0A1C36", fontWeight: 800 }}>
                WhatsApp Direct Checkout
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#4A5B73", lineHeight: 1.6 }}>
                Order with confidence! Submit itemized order requests via <strong>WhatsApp</strong> with automatic reference numbers (#CB-XXXX). Coordinate collection or delivery directly with Cayman shops with no card processing fees.
              </p>
            </div>
          </div>

          {/* Card 2: COD */}
          <div className="animate-entrance stagger-2" style={{ height: "100%" }}>
            <div
              className="pillar-card pillar-card-teal"
              style={{
                background: "linear-gradient(145deg, #FFFFFF 0%, #F8FCFD 100%)",
                padding: "2.25rem",
                borderRadius: "26px",
                border: "1.5px solid rgba(0, 229, 201, 0.25)",
                boxShadow: "0 12px 32px rgba(0, 229, 201, 0.08)",
                height: "100%",
                boxSizing: "border-box"
              }}
            >
              <div style={{ display: "inline-block", background: "#E0F2FE", color: "#0284C7", padding: "0.22rem 0.65rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "1rem" }}>
                PILLAR 02 • WHITE-GLOVE COURIER
              </div>
              <div
                className="pillar-icon-box"
                style={{
                  background: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)",
                  color: "#0284C7",
                  width: "60px",
                  height: "60px",
                  borderRadius: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                  boxShadow: "0 8px 18px rgba(2, 132, 199, 0.25)"
                }}
              >
                <DollarSign size={30} />
              </div>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.45rem", marginBottom: "0.6rem", color: "#0A1C36", fontWeight: 800 }}>
                Cash on Delivery (COD)
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#4A5B73", lineHeight: 1.6 }}>
                Relax at your Seven Mile Beach resort room or residence. Local island couriers deliver your package within 24 hours. 
                Pay cash in <strong>Cayman Dollars ($KYD)</strong> or <strong>US Dollars ($USD)</strong> directly upon arrival.
              </p>
            </div>
          </div>

          {/* Card 3: Independent Merchant Stores */}
          <div className="animate-entrance stagger-3" style={{ height: "100%" }}>
            <div
              className="pillar-card pillar-card-green"
              style={{
                background: "linear-gradient(145deg, #FFFFFF 0%, #F9FCF9 100%)",
                padding: "2.25rem",
                borderRadius: "26px",
                border: "1.5px solid rgba(16, 185, 129, 0.25)",
                boxShadow: "0 12px 32px rgba(16, 185, 129, 0.08)",
                height: "100%",
                boxSizing: "border-box"
              }}
            >
              <div style={{ display: "inline-block", background: "#DCFCE7", color: "#15803D", padding: "0.22rem 0.65rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "1rem" }}>
                PILLAR 03 • INDEPENDENT MERCHANTS
              </div>
              <div
                className="pillar-icon-box"
                style={{
                  background: "linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)",
                  color: "#15803D",
                  width: "60px",
                  height: "60px",
                  borderRadius: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                  boxShadow: "0 8px 18px rgba(22, 163, 74, 0.25)"
                }}
              >
                <ShieldCheck size={30} />
              </div>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.45rem", marginBottom: "0.6rem", color: "#0A1C36", fontWeight: 800 }}>
                Self-Managed Vendor Stores
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#4A5B73", lineHeight: 1.6 }}>
                Local businesses manage their own digital storefront on CaymanBazaar. They showcase catalog items, receive direct WhatsApp checkout orders, and coordinate local island fulfillment.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 🛍️ CURATED ISLAND SPECIALTIES */}
      <section className="container" style={{ marginBottom: "5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
          <div>
            <h2 style={{ fontSize: "2.4rem", color: "#0A1C36", fontWeight: 900 }}>Island Specialties</h2>
            <p style={{ fontSize: "0.95rem", color: "#64748B" }}>Handcrafted Caymanite, Tortuga rum cakes, luxury Larimar, and reef gear</p>
          </div>

          <button onClick={() => setActiveTab("categories")} className="btn-outline">
            View All Categories <ArrowRight size={15} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "1.35rem" }}>
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
                borderRadius: "22px",
                overflow: "hidden",
                border: "1px solid #E2E8F0",
                boxShadow: "var(--shadow-subtle)",
                cursor: "pointer",
                textAlign: "center"
              }}
            >
              <div style={{ height: "125px", overflow: "hidden" }}>
                <img src={cat.image} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }} />
              </div>
              <div style={{ padding: "1.1rem" }}>
                <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0A1C36" }}>{cat.name}</div>
                <div style={{ fontSize: "0.78rem", color: "#00B49F", fontWeight: 700, marginTop: "0.25rem" }}>{cat.count} Items Available</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🔥 TRENDING PRODUCTS */}
      <section className="container" style={{ marginBottom: "4rem" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#F59E0B", fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <Sparkles size={15} /> Island Customer Favorites
            </div>
            <h2 style={{ fontSize: "2.4rem", color: "#0A1C36", fontWeight: 900 }}>Trending Products from Island Stores</h2>
            <p style={{ fontSize: "0.95rem", color: "#64748B" }}>
              Order via WhatsApp for fast store pickup or request Cash on Delivery
            </p>
          </div>

          <button onClick={() => setActiveTab("categories")} className="btn-outline">
            Explore All Products <ArrowRight size={15} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "1.75rem" }}>
          {trendingItems.map((prod, idx) => (
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

      {/* 🌟 IMMERSIVE PRODUCT QUICK-VIEW MODAL */}
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
                zIndex: 10
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
              <div style={{ height: "320px", background: "#050B14", overflow: "hidden" }}>
                <img
                  src={quickViewProduct.images[0]}
                  alt={quickViewProduct.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div style={{ padding: "2rem", display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "0.8rem", color: "#00B49F", fontWeight: 800, marginBottom: "0.3rem" }}>
                  {quickViewProduct.vendor_name}
                </div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#0A1C36", marginBottom: "0.75rem" }}>
                  {quickViewProduct.title}
                </h3>
                <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#0A1C36", marginBottom: "0.85rem" }}>
                  {formatPrice(quickViewProduct.price)}
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
                    href={`https://wa.me/13459492299?text=${encodeURIComponent(`Hello! I would like to order: ${quickViewProduct.title} (Price: $${quickViewProduct.price.toFixed(2)} KYD) on CaymanBazaar.`)}`}
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
