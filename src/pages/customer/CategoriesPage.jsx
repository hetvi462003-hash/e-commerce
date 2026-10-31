import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import ProductCard from "../../components/ProductCard";
import { Grid, Search, SlidersHorizontal, Sparkles, ArrowUpDown } from "lucide-react";

export default function CategoriesPage({ setActiveTab, setSelectedProduct }) {
  const { products, categories } = useMarketplace();
  const [selectedCat, setSelectedCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [inStockOnly, setInStockOnly] = useState(false);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCat === "all" || p.category_id === selectedCat;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStock = inStockOnly ? p.stock_count > 0 : true;
    return matchesCat && matchesSearch && matchesStock;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "newest") return b.id.localeCompare(a.id);
    // default featured
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  return (
    <div style={{ background: "#FFFFFF", minHeight: "85vh", paddingBottom: "5rem" }}>
      <div className="container" style={{ padding: "2.5rem 1.5rem" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#111827", marginBottom: "0.35rem" }}>
            Grand Cayman Online Catalog
          </h1>
          <p style={{ color: "#64748B", fontSize: "0.95rem", margin: 0 }}>
            Browse authentic local crafts, Tortuga rum treats, dive equipment, and island specialties.
          </p>
        </div>

        {/* Category Pills (EE345 style) */}
        <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.75rem", marginBottom: "1.75rem" }}>
          <button
            onClick={() => setSelectedCat("all")}
            style={{
              background: selectedCat === "all" ? "#0F172A" : "#FFFFFF",
              color: selectedCat === "all" ? "#FFFFFF" : "#334155",
              border: "1px solid",
              borderColor: selectedCat === "all" ? "#0F172A" : "#D1D5DB",
              padding: "0.45rem 1.15rem",
              borderRadius: "999px",
              fontSize: "0.84rem",
              fontWeight: 700,
              cursor: "pointer",
              flexShrink: 0
            }}
          >
            All Items ({products.length})
          </button>

          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              style={{
                background: selectedCat === c.id ? "#0F172A" : "#FFFFFF",
                color: selectedCat === c.id ? "#FFFFFF" : "#334155",
                border: "1px solid",
                borderColor: selectedCat === c.id ? "#0F172A" : "#D1D5DB",
                padding: "0.45rem 1.15rem",
                borderRadius: "999px",
                fontSize: "0.84rem",
                fontWeight: 700,
                cursor: "pointer",
                flexShrink: 0
              }}
            >
              {c.name} ({c.count})
            </button>
          ))}
        </div>

        {/* Filter & Sort Controls Bar */}
        <div
          style={{
            background: "#F8FAFC",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            padding: "0.85rem 1.25rem",
            marginBottom: "2rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          {/* Search Input */}
          <div style={{ flex: "1 1 260px", position: "relative" }}>
            <input
              type="text"
              placeholder="Filter by keyword, title, or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem 0.85rem 0.6rem 2.35rem",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                fontSize: "0.88rem",
                background: "#FFFFFF"
              }}
            />
            <Search size={16} color="#94A3B8" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
          </div>

          {/* Right Controls: In-Stock checkbox & Sort By dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
            
            {/* In-Stock Only */}
            <label style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.84rem", fontWeight: 600, color: "#374151", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              <span>In Stock Only</span>
            </label>

            {/* Sort Dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <span style={{ fontSize: "0.84rem", color: "#6B7280", fontWeight: 600 }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "0.55rem 0.85rem",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#1E293B",
                  background: "#FFFFFF",
                  cursor: "pointer"
                }}
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>

            {/* Total Count */}
            <span style={{ fontSize: "0.82rem", color: "#64748B", fontWeight: 600 }}>
              {sortedProducts.length} {sortedProducts.length === 1 ? "item" : "items"}
            </span>

          </div>
        </div>

        {/* Product Grid (4 Columns matching EE345) */}
        {sortedProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 1rem", background: "#F8FAFC", borderRadius: "16px", border: "1px solid #E5E7EB" }}>
            <Grid size={44} color="#94A3B8" style={{ marginBottom: "0.75rem" }} />
            <h3 style={{ color: "#1E293B", fontSize: "1.2rem", fontWeight: 700 }}>No products found</h3>
            <p style={{ color: "#64748B", fontSize: "0.88rem" }}>Try adjusting your search terms or category filter.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "1.5rem" }}>
            {sortedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelectProduct={(prod) => {
                  setSelectedProduct(prod);
                  setActiveTab("product-detail");
                }}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
