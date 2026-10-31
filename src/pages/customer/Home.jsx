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
  ShoppingCart
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.25rem" }}>
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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {specialOffers.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelectProduct={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 🛡️ 06. WHY SHOP WITH US (Matching EE345 exactly) */}
      <section style={{ padding: "2.5rem 0", background: "#F9FAFB", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB", marginBottom: "2.5rem" }}>
        <div className="container">
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.55rem", color: "#111827", fontWeight: 800, margin: 0 }}>
              Why Shop With Us
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
            
            {/* 1. Shop Local */}
            <div style={{ background: "#FFFFFF", padding: "1.5rem", borderRadius: "16px", border: "1px solid #E5E7EB" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", marginBottom: "0.35rem" }}>
                Shop Local
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#4B5563", lineHeight: 1.5, margin: 0 }}>
                Proudly serving the Cayman Islands.
              </p>
            </div>

            {/* 2. Quality Items */}
            <div style={{ background: "#FFFFFF", padding: "1.5rem", borderRadius: "16px", border: "1px solid #E5E7EB" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", marginBottom: "0.35rem" }}>
                Quality Items
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#4B5563", lineHeight: 1.5, margin: 0 }}>
                Products we stand behind.
              </p>
            </div>

            {/* 3. Secure Checkout */}
            <div style={{ background: "#FFFFFF", padding: "1.5rem", borderRadius: "16px", border: "1px solid #E5E7EB" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", marginBottom: "0.35rem" }}>
                Secure Checkout
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#4B5563", lineHeight: 1.5, margin: 0 }}>
                Pay securely online or Cash on Delivery.
              </p>
            </div>

            {/* 4. Convenient Ordering */}
            <div style={{ background: "#FFFFFF", padding: "1.5rem", borderRadius: "16px", border: "1px solid #E5E7EB" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", marginBottom: "0.35rem" }}>
                Convenient Ordering
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#4B5563", lineHeight: 1.5, margin: 0 }}>
                Build your cart in minutes.
              </p>
            </div>

            {/* 5. WhatsApp Support */}
            <div style={{ background: "#FFFFFF", padding: "1.5rem", borderRadius: "16px", border: "1px solid #E5E7EB" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", marginBottom: "0.35rem" }}>
                WhatsApp Support
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#4B5563", lineHeight: 1.5, margin: 0 }}>
                Talk to our local team.
              </p>
            </div>

            {/* 6. Pickup & Delivery */}
            <div style={{ background: "#FFFFFF", padding: "1.5rem", borderRadius: "16px", border: "1px solid #E5E7EB" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", marginBottom: "0.35rem" }}>
                Pickup & Delivery
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#4B5563", lineHeight: 1.5, margin: 0 }}>
                Arranged to suit you.
              </p>
            </div>

          </div>

          {/* EE345 Summary Blurb */}
          <div style={{ maxWidth: "800px", color: "#6B7280", fontSize: "0.92rem", lineHeight: 1.6 }}>
            <p style={{ margin: "0 0 0.5rem 0" }}>
              CaymanBazaar is a locally owned online store in Grand Cayman offering a thoughtfully selected range of everyday essentials, artisan jewelry, Caymanite stones, gourmet rum treats, beach accessories and home finds. Shop securely online with convenient pickup and local delivery.
            </p>
            <p style={{ fontWeight: 700, color: "#111827", margin: 0 }}>
              Shop local. Support Cayman Islands business.
            </p>
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
