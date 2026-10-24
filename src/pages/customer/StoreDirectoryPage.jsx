import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import StoreCard from "../../components/StoreCard";
import { CAYMAN_DISTRICTS } from "../../data/mockData";
import { Store, MapPin, Search, Compass } from "lucide-react";

export default function StoreDirectoryPage({ setActiveTab, setSelectedVendor }) {
  const { vendors } = useMarketplace();
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const activeVendors = vendors.filter((v) => v.status === "active");

  const filteredVendors = activeVendors.filter((v) => {
    const matchesDistrict = selectedDistrict === "all" || v.district === selectedDistrict;
    const matchesSearch =
      v.store_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.specialty && v.specialty.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDistrict && matchesSearch;
  });

  return (
    <div className="container" style={{ padding: "3rem 1.5rem", paddingBottom: "5rem" }}>
      
      {/* Page Header (Shopper View - Pure & Clean) */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#00897B", fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase" }}>
          <Compass size={15} /> Grand Cayman Digital Promenade
        </div>
        <h1 style={{ fontSize: "2.6rem", color: "#0A2540", fontWeight: 900, marginBottom: "0.5rem" }}>
          Island Stalls & Boutique Directory
        </h1>
        <p style={{ color: "#64748B", fontSize: "1rem", maxWidth: "700px" }}>
          Explore authentic artisan booths, watersport shacks, and duty-free merchants across Georgetown, Seven Mile Beach, Rum Point, and Bodden Town.
        </p>
      </div>

      {/* Filter Bar */}
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
            placeholder="Search by stall name, specialty, or island crafts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: "2.6rem", borderRadius: "12px", background: "#F8FAFC" }}
          />
          <Search size={17} color="#00BFA5" style={{ position: "absolute", left: "0.95rem", top: "50%", transform: "translateY(-50%)" }} />
        </div>

        {/* District Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <MapPin size={16} color="#00BFA5" />
          <span style={{ fontSize: "0.85rem", color: "#64748B", fontWeight: 700 }}>Island District:</span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            style={{ width: "auto", borderRadius: "12px", fontWeight: 700, color: "#0A2540" }}
          >
            <option value="all">📍 All Cayman Districts ({activeVendors.length})</option>
            {CAYMAN_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d} ({activeVendors.filter(v => v.district === d).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vendors Grid */}
      {filteredVendors.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", background: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0" }}>
          <Store size={48} color="#CBD5E1" style={{ marginBottom: "1rem" }} />
          <h3 style={{ color: "#475569" }}>No virtual stalls match your search</h3>
          <p style={{ color: "#94A3B8" }}>Try selecting another district or clearing your search filter.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.75rem" }}>
          {filteredVendors.map((vendor) => (
            <StoreCard
              key={vendor.id}
              vendor={vendor}
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
