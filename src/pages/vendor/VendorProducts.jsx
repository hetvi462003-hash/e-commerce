import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import { Package, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, X } from "lucide-react";

export default function VendorProducts() {
  const { activeVendor, products, categories, saveProduct, deleteProduct, formatPrice } = useMarketplace();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Quick Stock Toggle
  const handleToggleStock = (prod) => {
    const isOut = prod.stock_count <= 0;
    saveProduct({
      ...prod,
      stock_count: isOut ? 15 : 0,
      status: isOut ? "active" : "out-of-stock"
    });
  };

  // Delete handler
  const handleDelete = (prod) => {
    if (window.confirm(`Are you sure you want to delete "${prod.title}" from your store?`)) {
      deleteProduct(prod.id);
    }
  };

  // Form states
  const [title, setTitle] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [stockCount, setStockCount] = useState(10);
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [variationsJson, setVariationsJson] = useState(`{\n  "size": ["Small", "Medium", "Large"]\n}`);

  if (!activeVendor) return null;

  const vendorProducts = products.filter((p) => p.vendor_id === activeVendor.id);

  const openAddModal = () => {
    setEditingProduct(null);
    setTitle("");
    setSku(`SKU-${Math.floor(100 + Math.random() * 900)}`);
    setPrice("25.00");
    setStockCount(15);
    setCategoryId(categories[0]?.id || "");
    setImageUrl("https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80");
    setDescription("Locally crafted island specialty item.");
    setVariationsJson(`{\n  "size": ["Small", "Medium", "Large"]\n}`);
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setTitle(prod.title);
    setSku(prod.sku);
    setPrice(prod.price.toString());
    setStockCount(prod.stock_count);
    setCategoryId(prod.category_id);
    setImageUrl(prod.images[0] || "");
    setDescription(prod.description);
    setVariationsJson(JSON.stringify(prod.variations || {}, null, 2));
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    let parsedVariations = {};
    try {
      parsedVariations = JSON.parse(variationsJson);
    } catch (err) {
      alert("Invalid JSON format in Variations field. Please enter valid JSON.");
      return;
    }

    const catObj = categories.find((c) => c.id === categoryId);

    saveProduct({
      id: editingProduct?.id,
      vendor_id: activeVendor.id,
      vendor_name: activeVendor.store_name,
      title,
      sku,
      price: parseFloat(price),
      stock_count: parseInt(stockCount),
      category_id: categoryId,
      category_name: catObj?.name || "General",
      images: [imageUrl],
      description,
      variations: parsedVariations,
      status: parseInt(stockCount) > 0 ? "active" : "out-of-stock"
    });

    setIsModalOpen(false);
  };

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem", paddingBottom: "5rem" }}>
      
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#00A896", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>
            <Package size={16} /> Inventory Management
          </div>
          <h1 style={{ fontSize: "2.2rem", color: "#0F172A", marginBottom: "0.2rem" }}>Product Catalog</h1>
          <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
            Manage product titles, SKUs, variation attributes, prices, and stock counts.
          </p>
        </div>

        <button onClick={openAddModal} className="btn-primary">
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Products Table */}
      <div style={{ background: "#FFFFFF", borderRadius: "20px", border: "1.5px solid #E2E8F0", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
              <th style={{ padding: "1rem" }}>Product Info</th>
              <th style={{ padding: "1rem" }}>SKU</th>
              <th style={{ padding: "1rem" }}>Price ($KYD)</th>
              <th style={{ padding: "1rem" }}>Stock</th>
              <th style={{ padding: "1rem" }}>Category</th>
              <th style={{ padding: "1rem" }}>Status</th>
              <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendorProducts.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                <td style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                    <img src={p.images[0]} alt={p.title} style={{ width: "48px", height: "48px", borderRadius: "10px", objectFit: "cover" }} />
                    <div>
                      <div style={{ fontWeight: 700, color: "#0F172A" }}>{p.title}</div>
                      <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
                        {p.variations && Object.keys(p.variations).length > 0 ? `${Object.keys(p.variations).length} variation attributes` : "No variations"}
                      </div>
                    </div>
                  </div>
                </td>

                <td style={{ padding: "1rem", fontFamily: "monospace", color: "#475569" }}>{p.sku}</td>

                <td style={{ padding: "1rem", fontWeight: 800, color: "#0F172A" }}>{formatPrice(p.price)}</td>

                <td style={{ padding: "1rem" }}>
                  <span style={{ fontWeight: 700, color: p.stock_count <= 5 ? "#DC2626" : "#166534" }}>
                    {p.stock_count} units
                  </span>
                </td>

                <td style={{ padding: "1rem", color: "#64748B" }}>{p.category_name}</td>

                <td style={{ padding: "1rem" }}>
                  {p.stock_count <= 0 ? (
                    <span className="badge badge-out-stock">Out of Stock</span>
                  ) : (
                    <span className="badge badge-stock">Active</span>
                  )}
                </td>

                <td style={{ padding: "1rem", textAlign: "right" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                    <button
                      onClick={() => handleToggleStock(p)}
                      style={{
                        background: p.stock_count <= 0 ? "#F0FDF4" : "#FEF2F2",
                        border: `1px solid ${p.stock_count <= 0 ? "#BBF7D0" : "#FCA5A5"}`,
                        color: p.stock_count <= 0 ? "#166534" : "#DC2626",
                        padding: "0.35rem 0.65rem",
                        fontSize: "0.76rem",
                        borderRadius: "8px",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                      title={p.stock_count <= 0 ? "Click to Restock 15 Units" : "Click to Mark Out of Stock"}
                    >
                      {p.stock_count <= 0 ? "+ Restock" : "Mark Out"}
                    </button>

                    <button
                      onClick={() => openEditModal(p)}
                      className="btn-outline"
                      style={{ padding: "0.35rem 0.65rem", fontSize: "0.78rem", borderRadius: "8px" }}
                      title="Edit Product Details"
                    >
                      <Edit2 size={13} /> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p)}
                      style={{
                        background: "#FFF1F2",
                        border: "1px solid #FECDD3",
                        color: "#E11D48",
                        padding: "0.35rem 0.55rem",
                        fontSize: "0.78rem",
                        borderRadius: "8px",
                        cursor: "pointer"
                      }}
                      title="Delete Product"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div className="animate-fade-in" style={{ background: "#FFFFFF", borderRadius: "20px", maxWidth: "560px", width: "100%", padding: "2rem", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
            
            <button onClick={() => setIsModalOpen(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "#F1F5F9", border: "none", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={18} color="#64748B" />
            </button>

            <h3 style={{ fontSize: "1.3rem", color: "#0F172A", marginBottom: "1.2rem" }}>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>

            <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.2rem", display: "block" }}>Product Title *</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.2rem", display: "block" }}>Price ($KYD) *</label>
                  <input type="number" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.2rem", display: "block" }}>Stock Count *</label>
                  <input type="number" required value={stockCount} onChange={(e) => setStockCount(e.target.value)} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.2rem", display: "block" }}>SKU Code *</label>
                  <input type="text" required value={sku} onChange={(e) => setSku(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.2rem", display: "block" }}>Category</label>
                  <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.2rem", display: "block" }}>Image URL</label>
                <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              </div>

              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.2rem", display: "block" }}>Description</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.2rem", display: "block" }}>
                  Product Variations (JSON format)
                </label>
                <textarea rows={4} style={{ fontFamily: "monospace", fontSize: "0.82rem" }} value={variationsJson} onChange={(e) => setVariationsJson(e.target.value)} />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: "0.85rem", fontSize: "0.95rem", marginTop: "0.5rem" }}>
                Save Product
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
