import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import ProductCard from "../../components/ProductCard";
import { Grid, Search, SlidersHorizontal, Sparkles } from "lucide-react";

export default function CategoriesPage({ setActiveTab, setSelectedVendor, setSelectedProduct }) {
  const { products, categories, vendors } = useMarketplace();
  const [selectedCat, setSelectedCat] = useState("all");
  const [selectedVendorFilter, setSelectedVendorFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCat === "all" || p.category_id === selectedCat;
    const matchesVendor = selectedVendorFilter === "all" || p.vendor_id === selectedVendorFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesVendor && matchesSearch;
  });

  return (
    <div className="container" style={{ padding: "3rem 1.5rem", paddingBottom: "5rem" }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#00897B", fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase" }}>
          <Sparkles size={15} /> Authentic Cayman Marketplace Catalog
        </div>
        <h1 style={{ fontSize: "2.6rem", color: "#0A2540", fontWeight: 900, marginBottom: "0.5rem" }}>
          Island Specialties & Product Catalog
        </h1>
        <p style={{ color: "#64748B", fontSize: "1rem" }}>
          Explore genuine Caymanite gems, Tortuga rum cakes, reef gear, and luxury items from licensed local vendors.
        </p>
      </div>

      {/* Category Pills Scroller */}
      <div style={{ display: "flex", gap: "0.6rem", overflowX: "auto", paddingBottom: "0.75rem", marginBottom: "2rem" }}>
        <button
          onClick={() => setSelectedCat("all")}
          style={{
            background: selectedCat === "all" ? "#0A2540" : "#FFFFFF",
            color: selectedCat === "all" ? "#FFFFFF" : "#334155",
            border: "1.5px solid",
            borderColor: selectedCat === "all" ? "#0A2540" : "#E2E8F0",
            padding: "0.55rem 1.25rem",
            borderRadius: "999px",
            fontSize: "0.85rem",
            fontWeight: 800,
            flexShrink: 0,
            boxShadow: "var(--shadow-xs)"
          }}
        >
          All Items ({products.length})
        </button>

        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCat(c.id)}
            style={{
              background: selectedCat === c.id ? "#00BFA5" : "#FFFFFF",
              color: selectedCat === c.id ? "#07101E" : "#334155",
              border: "1.5px solid",
              borderColor: selectedCat === c.id ? "#00BFA5" : "#E2E8F0",
              padding: "0.55rem 1.25rem",
              borderRadius: "999px",
              fontSize: "0.85rem",
              fontWeight: 800,
              flexShrink: 0,
              boxShadow: "var(--shadow-xs)"
            }}
          >
            {c.name} ({c.count})
          </button>
        ))}
      </div>

      {/* Filter Toolbar */}
      <div
        style={{
          background: "#FFFFFF",
          padding: "1.25rem 1.5rem",
          borderRadius: "20px",
          border: "1px solid #E2E8F0",
          boxShadow: "var(--shadow-sm)",
          marginBottom: "2.5rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        {/* Search */}
        <div style={{ flex: "1 1 300px", position: "relative" }}>
          <input
            type="text"
            placeholder="Search products, descriptions, or SKUs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: "2.6rem", borderRadius: "12px", background: "#F8FAFC" }}
          />
          <Search size={17} color="#00BFA5" style={{ position: "absolute", left: "0.95rem", top: "50%", transform: "translateY(-50%)" }} />
        </div>

        {/* Vendor Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ fontSize: "0.85rem", color: "#64748B", fontWeight: 700 }}>Filter Store:</span>
          <select
            value={selectedVendorFilter}
            onChange={(e) => setSelectedVendorFilter(e.target.value)}
            style={{ width: "auto", borderRadius: "12px", fontWeight: 700, color: "#0A2540" }}
          >
            <option value="all">All Cayman Stores</option>
            {vendors.filter(v => v.status === "active").map((v) => (
              <option key={v.id} value={v.id}>
                {v.district ? `${v.district} • ` : ""}{v.store_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 1rem", background: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
          <Grid size={48} color="#CBD5E1" style={{ marginBottom: "1rem" }} />
          <h3 style={{ color: "#475569" }}>No products found</h3>
          <p style={{ color: "#94A3B8", fontSize: "0.9rem" }}>Try adjusting your search terms or category filter.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.75rem" }}>
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelectProduct={(prod, directReserve = false) => {
                setSelectedProduct(prod);
                if (directReserve) {
                  setActiveTab("checkout");
                } else {
                  setActiveTab("product-detail");
                }
              }}
              onVisitStore={(v) => {
                setSelectedVendor(v);
                setActiveTab("store-detail");
              }}
            />
          ))}
        </div>
      )}

    </div>
  );
}
