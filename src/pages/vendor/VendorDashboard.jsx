import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import {
  LayoutDashboard,
  Package,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Store,
  ShoppingBag,
  Star,
  MessageSquare
} from "lucide-react";

export default function VendorDashboard({ setActiveTab, setSelectedVendor }) {
  const {
    activeVendor,
    orders,
    products,
    reviews = [],
    formatPrice,
    showToast
  } = useMarketplace();

  const [orderFilter, setOrderFilter] = useState("all"); // 'all' | 'pickup' | 'cod'

  if (!activeVendor) return null;

  // Filter vendor specific data
  const vendorOrders = orders.filter((o) => o.vendor_id === activeVendor.id);
  const vendorProducts = products.filter((p) => p.vendor_id === activeVendor.id);

  const pendingPickupOrders = vendorOrders.filter(
    (o) => o.type === "PICKUP" && o.status === "Ready for Pickup"
  );

  const pendingCodOrders = vendorOrders.filter(
    (o) => o.type === "COD" && o.status !== "Completed" && o.status !== "Cancelled"
  );

  const totalSalesKYD = vendorOrders
    .filter((o) => o.status === "Completed")
    .reduce((acc, o) => acc + o.total_amount, 0);

  const vendorReviews = reviews.filter((r) => r.vendor_id === activeVendor.id);

  const filteredOrders = vendorOrders.filter((o) => {
    if (orderFilter === "pickup") return o.type === "PICKUP";
    if (orderFilter === "cod") return o.type === "COD";
    return true;
  });

  return (
    <div style={{ background: "#060F1E", minHeight: "100vh", color: "#F8FAFC", paddingBottom: "5rem" }}>
      
      {/* 1. LUXURY STALL COMMAND HERO */}
      <div
        style={{
          background: "linear-gradient(135deg, #050E1D 0%, #082142 50%, #063148 100%)",
          borderBottom: "1px solid rgba(0, 229, 201, 0.25)",
          padding: "3rem 1.5rem 2.5rem",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Glow ambient effects */}
        <div style={{ position: "absolute", top: "-60px", right: "5%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(0, 229, 201, 0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "10%", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          
          {/* Top Status & Verification Pill */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{
                background: "rgba(0, 229, 201, 0.12)",
                border: "1px solid rgba(0, 229, 201, 0.35)",
                color: "#00E5C9",
                fontSize: "0.78rem",
                fontWeight: 800,
                padding: "0.3rem 0.8rem",
                borderRadius: "999px",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem"
              }}>
                <Store size={14} /> {activeVendor.store_type || "Island Boutique"}
              </span>

              {activeVendor.status === "pending_approval" ? (
                <span style={{
                  background: "rgba(245, 158, 11, 0.15)",
                  border: "1px solid rgba(245, 158, 11, 0.4)",
                  color: "#FBBF24",
                  fontSize: "0.76rem",
                  fontWeight: 800,
                  padding: "0.28rem 0.75rem",
                  borderRadius: "999px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem"
                }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#F59E0B", boxShadow: "0 0 8px #F59E0B" }} />
                  ⏳ Pending SuperAdmin Review
                </span>
              ) : (
                <span style={{
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                  color: "#10B981",
                  fontSize: "0.76rem",
                  fontWeight: 800,
                  padding: "0.28rem 0.75rem",
                  borderRadius: "999px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem"
                }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#10B981", boxShadow: "0 0 8px #10B981" }} />
                  Store Open & Active
                </span>
              )}

              <span style={{ color: "#94A3B8", fontSize: "0.78rem" }}>
                📍 {activeVendor.district}, Grand Cayman
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span style={{ color: "#94A3B8", fontSize: "0.82rem" }}>Platform Commission:</span>
              <strong style={{ color: "#00E5C9", fontSize: "0.86rem" }}>
                {Number((activeVendor?.commission_rate || 0.1) * 100).toFixed(0)}% Flat Take-Rate
              </strong>
            </div>
          </div>

          {/* Main Title & Action Center */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "2.5rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.35rem" }}>
                {activeVendor.store_name}
              </h1>
              <p style={{ color: "#94A3B8", fontSize: "1rem", maxWidth: "620px", lineHeight: 1.5 }}>
                {activeVendor.bio || "Manage your island storefront catalog, process incoming customer WhatsApp orders, and fulfill local deliveries."}
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                onClick={() => setActiveTab("vendor-products")}
                style={{
                  background: "linear-gradient(135deg, #00E5C9 0%, #00A896 100%)",
                  color: "#050B14",
                  fontWeight: 800,
                  padding: "0.65rem 1.25rem",
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  boxShadow: "0 4px 15px rgba(0, 229, 201, 0.35)",
                  fontSize: "0.86rem"
                }}
              >
                <Plus size={16} />
                <span>Add Product SKU</span>
              </button>

              <button
                onClick={() => setActiveTab("vendor-profile")}
                style={{
                  background: "rgba(245, 158, 11, 0.15)",
                  border: "1px solid rgba(245, 158, 11, 0.4)",
                  color: "#FBBF24",
                  fontWeight: 800,
                  padding: "0.65rem 1.25rem",
                  borderRadius: "12px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  fontSize: "0.86rem"
                }}
              >
                <Store size={16} />
                <span>Store Profile & Info</span>
              </button>

              <button
                onClick={() => setActiveTab("vendor-reviews")}
                style={{
                  background: "rgba(0, 229, 201, 0.12)",
                  border: "1px solid rgba(0, 229, 201, 0.35)",
                  color: "#00E5C9",
                  fontWeight: 800,
                  padding: "0.65rem 1.25rem",
                  borderRadius: "12px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  fontSize: "0.86rem"
                }}
              >
                <Star size={16} fill="#00E5C9" />
                <span>Customer Reviews</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      <div className="container" style={{ padding: "2.5rem 1.5rem" }}>
        
        {/* Alerts / Notices */}
        {activeVendor?.status === "pending_approval" && (
          <div style={{ background: "rgba(245, 158, 11, 0.12)", border: "1px solid #F59E0B", color: "#FDE68A", padding: "1.25rem 1.5rem", borderRadius: "16px", marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Clock size={30} style={{ color: "#F59E0B", flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.2rem" }}>
                  Store Awaiting SuperAdmin Approval
                </h4>
                <p style={{ fontSize: "0.84rem", color: "#CBD5E1", lineHeight: 1.4 }}>
                  Your store details are currently under review by the platform administrator. You can add inventory now; your products will become publicly visible once approved.
                </p>
              </div>
            </div>
            <span style={{ background: "#F59E0B", color: "#000", padding: "0.35rem 0.85rem", borderRadius: "999px", fontWeight: 900, fontSize: "0.76rem" }}>
              Pending Review
            </span>
          </div>
        )}

        {/* 2. GLASSMORPHIC STALL METRICS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
          
          {/* Total Sales */}
          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(0, 229, 201, 0.3)", borderRadius: "20px", padding: "1.75rem", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase" }}>
                Completed Gross Sales
              </span>
              <div style={{ background: "rgba(0, 229, 201, 0.15)", color: "#00E5C9", width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrendingUp size={20} />
              </div>
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFFFFF" }}>
              {formatPrice(totalSalesKYD)}
            </div>
            <div style={{ marginTop: "0.6rem", fontSize: "0.78rem", color: "#10B981", display: "flex", alignItems: "center", gap: "0.3rem", fontWeight: 700 }}>
              <CheckCircle2 size={13} /> {vendorOrders.filter(o => o.status === "Completed").length} orders successfully fulfilled
            </div>
          </div>

          {/* Customer Reviews & Rating */}
          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "20px", padding: "1.75rem", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#FBBF24", textTransform: "uppercase" }}>
                Customer Ratings
              </span>
              <div style={{ background: "rgba(245, 158, 11, 0.2)", color: "#FBBF24", width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Star size={20} fill="#FBBF24" />
              </div>
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FBBF24" }}>
              {activeVendor.rating ? Number(activeVendor.rating).toFixed(1) : "5.0"} <span style={{ fontSize: "1rem", color: "#94A3B8" }}>★ / 5.0</span>
            </div>
            <div style={{ marginTop: "0.6rem", fontSize: "0.78rem", color: "#94A3B8" }}>
              {vendorReviews.length} verified customer reviews received
            </div>
          </div>

          {/* Active Orders */}
          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(14, 165, 233, 0.3)", borderRadius: "20px", padding: "1.75rem", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#38BDF8", textTransform: "uppercase" }}>
                Active Orders
              </span>
              <div style={{ background: "rgba(14, 165, 233, 0.15)", color: "#38BDF8", width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Clock size={20} />
              </div>
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFFFFF" }}>
              {vendorOrders.filter(o => o.status !== "Completed" && o.status !== "Cancelled").length} <span style={{ fontSize: "1rem", color: "#64748B" }}>In Progress</span>
            </div>
            <div style={{ marginTop: "0.6rem", fontSize: "0.78rem", color: "#38BDF8", fontWeight: 700 }}>
              WhatsApp orders awaiting fulfillment
            </div>
          </div>

          {/* Active Catalog SKUs */}
          <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(168, 85, 247, 0.3)", borderRadius: "20px", padding: "1.75rem", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#C084FC", textTransform: "uppercase" }}>
                Live Catalog SKUs
              </span>
              <div style={{ background: "rgba(168, 85, 247, 0.15)", color: "#C084FC", width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Package size={20} />
              </div>
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFFFFF" }}>
              {vendorProducts.length} <span style={{ fontSize: "1rem", color: "#64748B" }}>Items</span>
            </div>
            <div style={{ marginTop: "0.6rem", fontSize: "0.78rem", color: "#94A3B8" }}>
              {vendorProducts.filter(p => p.status === "in-stock" || !p.status).length} in stock and shoppable
            </div>
          </div>

        </div>

        {/* 3. WHATSAPP ORDER MANAGEMENT ACTION HERO */}
        <div
          style={{
            background: "linear-gradient(135deg, #091A33 0%, #0D2C4D 50%, #0A1C36 100%)",
            border: "1.5px solid rgba(0, 229, 201, 0.4)",
            borderRadius: "24px",
            padding: "2.25rem",
            boxShadow: "0 15px 40px rgba(0, 229, 201, 0.15)",
            marginBottom: "3rem",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "2rem" }}>
            <div style={{ maxWidth: "580px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", background: "rgba(0, 229, 201, 0.15)", color: "#00E5C9", padding: "0.3rem 0.85rem", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "0.75rem" }}>
                <MessageSquare size={14} /> WhatsApp Direct Fulfillment
              </div>
              <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.5rem" }}>
                Manage WhatsApp Order Requests
              </h3>
              <p style={{ color: "#CBD5E1", fontSize: "0.92rem", lineHeight: 1.55 }}>
                When shoppers submit items from your store, orders are placed in the central system and sent via WhatsApp. 
                Use the dedicated Orders portal to contact customers directly, advance fulfillment status (Processing, Ready for Collection, Out for Delivery), and mark orders Completed.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("vendor-orders")}
              style={{
                background: "linear-gradient(135deg, #00E5C9 0%, #00A896 100%)",
                color: "#050B14",
                fontWeight: 900,
                border: "none",
                padding: "0.9rem 1.6rem",
                borderRadius: "14px",
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(0, 229, 201, 0.4)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <Package size={20} />
              <span>Go to Orders Portal ➔</span>
            </button>
          </div>
        </div>


        {/* 4. RECENT ORDERS QUEUE */}
        <div style={{ background: "rgba(15, 23, 42, 0.7)", borderRadius: "20px", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "1.75rem", boxShadow: "0 15px 35px rgba(0,0,0,0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#FFFFFF" }}>
                Active Store Operations Queue
              </h3>
              <p style={{ fontSize: "0.82rem", color: "#64748B" }}>
                Manage pending counter pickups, packing steps, and courier dispatches
              </p>
            </div>

            {/* Filter buttons */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => setOrderFilter("all")}
                style={{
                  background: orderFilter === "all" ? "rgba(0, 229, 201, 0.15)" : "transparent",
                  color: orderFilter === "all" ? "#00E5C9" : "#94A3B8",
                  border: orderFilter === "all" ? "1px solid rgba(0, 229, 201, 0.4)" : "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "0.35rem 0.85rem",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                All Orders ({vendorOrders.length})
              </button>
              <button
                onClick={() => setOrderFilter("pickup")}
                style={{
                  background: orderFilter === "pickup" ? "rgba(0, 229, 201, 0.15)" : "transparent",
                  color: orderFilter === "pickup" ? "#00E5C9" : "#94A3B8",
                  border: orderFilter === "pickup" ? "1px solid rgba(0, 229, 201, 0.4)" : "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "0.35rem 0.85rem",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Pickup Holds ({pendingPickupOrders.length})
              </button>
              <button
                onClick={() => setOrderFilter("cod")}
                style={{
                  background: orderFilter === "cod" ? "rgba(0, 229, 201, 0.15)" : "transparent",
                  color: orderFilter === "cod" ? "#00E5C9" : "#94A3B8",
                  border: orderFilter === "cod" ? "1px solid rgba(0, 229, 201, 0.4)" : "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "0.35rem 0.85rem",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Courier COD ({pendingCodOrders.length})
              </button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  <th style={{ padding: "0.75rem" }}>Order Reference</th>
                  <th style={{ padding: "0.75rem" }}>Method & Details</th>
                  <th style={{ padding: "0.75rem" }}>Shopper Contact</th>
                  <th style={{ padding: "0.75rem" }}>Items Summary</th>
                  <th style={{ padding: "0.75rem" }}>Amount</th>
                  <th style={{ padding: "0.75rem" }}>Status</th>
                  <th style={{ padding: "0.75rem", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "3rem", color: "#64748B" }}>
                      <ShoppingBag size={36} color="#00E5C9" style={{ margin: "0 auto 0.5rem auto", display: "block" }} />
                      <div style={{ fontWeight: 700, color: "#FFFFFF" }}>No Orders in this View</div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.slice(0, 6).map((o) => (
                    <tr key={o.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                      <td style={{ padding: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>{o.id}</td>
                      <td style={{ padding: "0.85rem" }}>
                        <span style={{
                          background: o.type === "PICKUP" ? "rgba(0, 229, 201, 0.12)" : "rgba(245, 158, 11, 0.12)",
                          color: o.type === "PICKUP" ? "#00E5C9" : "#FBBF24",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          padding: "0.2rem 0.55rem",
                          borderRadius: "6px"
                        }}>
                          {o.type === "PICKUP" ? "Store Pickup" : "Courier COD"}
                        </span>
                      </td>
                      <td style={{ padding: "0.85rem" }}>
                        <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{o.customer_name}</div>
                        <div style={{ fontSize: "0.74rem", color: "#94A3B8" }}>{o.customer_phone}</div>
                      </td>
                      <td style={{ padding: "0.85rem", color: "#CBD5E1", maxWidth: "220px" }}>
                        {o.items?.map(it => `${it.qty}x ${it.title}`).join(", ") || "1x Island Artisan Item"}
                      </td>
                      <td style={{ padding: "0.85rem", fontWeight: 800, color: "#FFFFFF" }}>
                        ${(o.total_amount || 0).toFixed(2)} KYD
                      </td>
                      <td style={{ padding: "0.85rem" }}>
                        <span style={{
                          background: o.status === "Completed" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                          color: o.status === "Completed" ? "#10B981" : "#FBBF24",
                          fontSize: "0.74rem",
                          fontWeight: 800,
                          padding: "0.2rem 0.6rem",
                          borderRadius: "6px"
                        }}>
                          {o.status}
                        </span>
                      </td>
                      <td style={{ padding: "0.85rem", textAlign: "right" }}>
                        <button
                          onClick={() => setActiveTab("vendor-orders")}
                          style={{
                            background: "transparent",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                            color: "#00E5C9",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            padding: "0.25rem 0.6rem",
                            borderRadius: "6px",
                            cursor: "pointer"
                          }}
                        >
                          View Order
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
