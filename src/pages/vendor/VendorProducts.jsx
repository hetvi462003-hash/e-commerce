import React, { useState } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  Download,
  FileText,
  Check,
  AlertTriangle
} from "lucide-react";

export default function VendorProducts() {
  const {
    activeVendor,
    products,
    categories,
    saveProduct,
    saveBulkProducts,
    deleteProduct,
    formatPrice,
    showToast
  } = useMarketplace();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Bulk Upload states
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkCsvText, setBulkCsvText] = useState("");
  const [parsedBulkProducts, setParsedBulkProducts] = useState([]);
  const [bulkFileName, setBulkFileName] = useState("");

  if (!activeVendor) return null;

  const vendorProducts = products.filter((p) => p.vendor_id === activeVendor.id);
  const productLimit = activeVendor.product_limit || 25;
  const currentCount = vendorProducts.length;
  const remainingQuota = Math.max(0, productLimit - currentCount);
  const isLimitReached = currentCount >= productLimit;

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
  const [customCategoryName, setCustomCategoryName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [variationsJson, setVariationsJson] = useState(`{\n  "size": ["Small", "Medium", "Large"]\n}`);

  const openAddModal = () => {
    if (isLimitReached) {
      if (showToast) {
        showToast(`Product upload limit of ${productLimit} items reached. Contact Admin to increase your limit.`, "warning");
      }
      return;
    }
    setEditingProduct(null);
    setTitle("");
    setSku(`SKU-${Math.floor(100 + Math.random() * 900)}`);
    setPrice("25.00");
    setStockCount(15);
    setCategoryId(categories[0]?.id || "");
    setCustomCategoryName("");
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
    const existingCat = categories.find((c) => c.id === prod.category_id);
    if (existingCat) {
      setCategoryId(prod.category_id);
      setCustomCategoryName("");
    } else {
      setCategoryId("custom");
      setCustomCategoryName(prod.category_name || "");
    }
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

    let finalCatId = categoryId;
    let finalCatName = "";
    if (categoryId === "custom") {
      finalCatName = customCategoryName.trim() || "General";
      finalCatId = "cat-" + finalCatName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    } else {
      const catObj = categories.find((c) => c.id === categoryId);
      finalCatId = categoryId;
      finalCatName = catObj?.name || "General";
    }

    saveProduct({
      id: editingProduct?.id,
      vendor_id: activeVendor.id,
      vendor_name: activeVendor.store_name,
      title,
      sku,
      price: parseFloat(price),
      stock_count: parseInt(stockCount),
      category_id: finalCatId,
      category_name: finalCatName,
      images: [imageUrl],
      description,
      variations: parsedVariations,
      status: parseInt(stockCount) > 0 ? "active" : "out-of-stock"
    });

    setIsModalOpen(false);
  };

  // Helper: Download Sample CSV Template
  const handleDownloadTemplate = () => {
    const csvContent =
      "title,sku,price,stock_count,category,description,image_url\n" +
      "Grand Cayman Rum Cake 500g,SKU-RUM-01,18.50,20,Island Gourmet,Authentic Caribbean rum cake infused with premium Tortuga rum,https://images.unsplash.com/photo-1578985545062-69928b1d9587\n" +
      "Handmade Caymanite Pendant,SKU-PEND-02,65.00,8,Artisan Crafts,Polished local Caymanite gemstone hand-wrapped in sterling silver wire,https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f\n" +
      "Caribbean Breeze Organic Soap,SKU-SOAP-03,8.00,30,Beauty & Wellness,Natural coconut oil cold-process artisan bar,https://images.unsplash.com/photo-1607006311604-80252280786f\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "cayman_bazaar_bulk_products_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper: Parse CSV text into items
  const parseCSV = (csvText) => {
    const lines = csvText.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return [];

    const splitCSVLine = (line) => {
      const result = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' || char === "'") {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          result.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const headers = splitCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9_]/g, ""));
    const items = [];

    for (let i = 1; i < lines.length; i++) {
      const values = splitCSVLine(lines[i]);
      if (values.length < 3) continue;

      const rowObj = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] || "";
      });

      const prodTitle = rowObj.title || rowObj.productname || rowObj.name;
      if (!prodTitle) continue;

      const prodPrice = parseFloat(rowObj.price || rowObj.pricekyd || "20.00") || 20.0;
      const prodStock = parseInt(rowObj.stock_count || rowObj.stock || rowObj.quantity || "10") || 10;
      const prodSku = rowObj.sku || `SKU-B-${Math.floor(1000 + Math.random() * 9000)}`;
      const prodCat = rowObj.category || rowObj.categoryname || "Artisan Boutique";
      const prodDesc = rowObj.description || rowObj.desc || "Locally crafted island specialty creation.";
      const prodImg = rowObj.image_url || rowObj.image || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80";

      items.push({
        title: prodTitle,
        sku: prodSku,
        price: prodPrice,
        stock_count: prodStock,
        category_id: "cat-" + prodCat.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        category_name: prodCat,
        description: prodDesc,
        images: [prodImg],
        variations: {},
        status: prodStock > 0 ? "active" : "out-of-stock"
      });
    }

    return items;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBulkFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      setBulkCsvText(text);
      const items = parseCSV(text);
      setParsedBulkProducts(items);
    };
    reader.readAsText(file);
  };

  const handleCsvTextChange = (text) => {
    setBulkCsvText(text);
    const items = parseCSV(text);
    setParsedBulkProducts(items);
  };

  const handleExecuteBulkUpload = () => {
    if (parsedBulkProducts.length === 0) return;

    // Check remaining quota
    const allowedItems = parsedBulkProducts.slice(0, remainingQuota);
    if (allowedItems.length === 0) {
      if (showToast) {
        showToast("Cannot import products: your upload limit quota is full. Contact Admin.", "error");
      }
      return;
    }

    const prepared = allowedItems.map((item, idx) => ({
      ...item,
      id: `p-${Date.now()}-${idx}`,
      vendor_id: activeVendor.id,
      vendor_name: activeVendor.store_name,
      price_usd: Number((item.price * 1.2).toFixed(2))
    }));

    if (saveBulkProducts) {
      saveBulkProducts(prepared);
    }

    setIsBulkModalOpen(false);
    setBulkCsvText("");
    setParsedBulkProducts([]);
    setBulkFileName("");
    if (showToast) {
      showToast(`🎉 Bulk Upload Complete! Added ${prepared.length} products to your store catalog.`, "success");
    }
  };

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem", paddingBottom: "5rem" }}>
      
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#00A896", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>
            <Package size={16} /> Inventory Management
          </div>
          <h1 style={{ fontSize: "2.2rem", color: "#0F172A", marginBottom: "0.2rem" }}>Product Catalog</h1>
          <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
            Manage product titles, SKUs, variation attributes, prices, and stock counts.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          {/* Upload Limit Quota Pill */}
          <div
            style={{
              background: isLimitReached ? "#FEF2F2" : "#F0FDFA",
              border: `1.5px solid ${isLimitReached ? "#FCA5A5" : "#00A896"}`,
              padding: "0.55rem 1rem",
              borderRadius: "12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              color: isLimitReached ? "#DC2626" : "#0D9488",
              fontWeight: 800,
              fontSize: "0.86rem"
            }}
          >
            <Package size={16} />
            <span>Quota: {currentCount} / {productLimit} Products</span>
          </div>

          {/* Bulk Upload Button */}
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="btn-outline"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              fontWeight: 700
            }}
            title="Import products from a CSV spreadsheet"
          >
            <Upload size={16} /> Bulk Upload (CSV)
          </button>

          {/* Add Product Button */}
          <button
            onClick={openAddModal}
            className="btn-primary"
            style={{
              opacity: isLimitReached ? 0.6 : 1,
              cursor: isLimitReached ? "not-allowed" : "pointer"
            }}
            title={isLimitReached ? "Product upload limit reached" : "Add new item"}
          >
            <Plus size={18} /> Add New Product
          </button>
        </div>
      </div>

      {/* Warning banner if quota reached */}
      {isLimitReached && (
        <div
          style={{
            background: "#FFFBEB",
            border: "1.5px solid #F59E0B",
            borderRadius: "14px",
            padding: "1rem 1.25rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            color: "#92400E"
          }}
        >
          <AlertTriangle size={20} color="#D97706" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: "0.88rem", lineHeight: 1.45 }}>
            <strong>Store Product Upload Limit Reached ({currentCount}/{productLimit} items):</strong> You have utilized all available listing slots allocated to your vendor store. To list additional products, please contact the marketplace administration to upgrade your vendor tier.
          </div>
        </div>
      )}

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
                    <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: "#F8FAFC", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0, padding: "2px" }}>
                      <img src={p.images[0]} alt={p.title} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                    </div>
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

      {/* Bulk Upload Modal */}
      {isBulkModalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(15,23,42,0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div className="animate-fade-in" style={{ background: "#FFFFFF", borderRadius: "24px", maxWidth: "680px", width: "100%", padding: "2rem", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
            
            <button onClick={() => setIsBulkModalOpen(false)} style={{ position: "absolute", top: "18px", right: "18px", background: "#F1F5F9", border: "none", borderRadius: "50%", width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <X size={18} color="#64748B" />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
              <div style={{ background: "#F0FDFA", color: "#00A896", width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Upload size={18} />
              </div>
              <h3 style={{ fontSize: "1.4rem", color: "#0F172A", margin: 0, fontWeight: 800 }}>
                Bulk Product Upload (CSV)
              </h3>
            </div>
            <p style={{ fontSize: "0.88rem", color: "#64748B", marginBottom: "1.25rem" }}>
              Upload your inventory in bulk using a standard comma-separated CSV spreadsheet.
            </p>

            {/* Quota Strip */}
            <div style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: "14px", padding: "0.85rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <div>
                <span style={{ fontSize: "0.78rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Store Upload Quota:</span>
                <span style={{ marginLeft: "0.5rem", fontWeight: 800, color: "#0F172A" }}>{currentCount} used / {productLimit} max</span>
              </div>
              <div style={{ fontSize: "0.84rem", fontWeight: 800, color: remainingQuota > 0 ? "#00A896" : "#DC2626" }}>
                {remainingQuota} slot{remainingQuota === 1 ? "" : "s"} available
              </div>
            </div>

            {/* Template Download Button */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F0FDFA", border: "1px dashed #00A896", padding: "0.9rem 1.25rem", borderRadius: "14px", marginBottom: "1.25rem" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "#0F766E" }}>Need the CSV Template?</div>
                <div style={{ fontSize: "0.78rem", color: "#115E59" }}>Download a ready-to-fill spreadsheet with proper Cayman product headers.</div>
              </div>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                style={{
                  background: "#00A896",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "0.45rem 0.9rem",
                  borderRadius: "10px",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  cursor: "pointer"
                }}
              >
                <Download size={14} /> Download Sample CSV
              </button>
            </div>

            {/* File Input */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem", display: "block" }}>
                Select CSV Spreadsheet File
              </label>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                style={{
                  width: "100%",
                  padding: "0.6rem 0.8rem",
                  borderRadius: "10px",
                  border: "1.5px solid #CBD5E1",
                  fontSize: "0.85rem",
                  background: "#F8FAFC"
                }}
              />
              {bulkFileName && (
                <div style={{ fontSize: "0.78rem", color: "#00A896", fontWeight: 700, marginTop: "0.3rem" }}>
                  Selected: {bulkFileName}
                </div>
              )}
            </div>

            {/* Or Paste CSV text */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem", display: "block" }}>
                Or Paste CSV Content Directly
              </label>
              <textarea
                rows={4}
                value={bulkCsvText}
                onChange={(e) => handleCsvTextChange(e.target.value)}
                placeholder="title,sku,price,stock_count,category,description,image_url&#10;Handmade Conch Lamp,SKU-101,45.00,10,Artisan Crafts,Authentic Caribbean shell lamp,https://..."
                style={{
                  width: "100%",
                  fontFamily: "monospace",
                  fontSize: "0.8rem",
                  padding: "0.75rem",
                  borderRadius: "10px",
                  border: "1.5px solid #CBD5E1",
                  background: "#F8FAFC",
                  lineHeight: 1.4
                }}
              />
            </div>

            {/* Live Preview Strip */}
            {parsedBulkProducts.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0F172A" }}>
                    Detected Products ({parsedBulkProducts.length} items parsed)
                  </span>
                  {parsedBulkProducts.length > remainingQuota && (
                    <span style={{ fontSize: "0.78rem", color: "#DC2626", fontWeight: 700 }}>
                      ⚠️ Only first {remainingQuota} will be imported (quota limit)
                    </span>
                  )}
                </div>

                <div style={{ maxHeight: "160px", overflowY: "auto", border: "1px solid #E2E8F0", borderRadius: "10px", background: "#F8FAFC" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem", textAlign: "left" }}>
                    <thead>
                      <tr style={{ background: "#F1F5F9", color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>
                        <th style={{ padding: "0.5rem 0.75rem" }}>#</th>
                        <th style={{ padding: "0.5rem 0.75rem" }}>Title</th>
                        <th style={{ padding: "0.5rem 0.75rem" }}>SKU</th>
                        <th style={{ padding: "0.5rem 0.75rem" }}>Price</th>
                        <th style={{ padding: "0.5rem 0.75rem" }}>Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedBulkProducts.map((it, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #E2E8F0", opacity: idx >= remainingQuota ? 0.4 : 1 }}>
                          <td style={{ padding: "0.45rem 0.75rem", color: "#64748B" }}>{idx + 1}</td>
                          <td style={{ padding: "0.45rem 0.75rem", fontWeight: 700, color: "#0F172A" }}>{it.title}</td>
                          <td style={{ padding: "0.45rem 0.75rem", fontFamily: "monospace" }}>{it.sku}</td>
                          <td style={{ padding: "0.45rem 0.75rem", fontWeight: 700 }}>${it.price.toFixed(2)}</td>
                          <td style={{ padding: "0.45rem 0.75rem" }}>{it.stock_count} units</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "0.8rem", marginTop: "1rem" }}>
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="btn-outline"
                style={{ flex: 1, padding: "0.75rem" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteBulkUpload}
                disabled={parsedBulkProducts.length === 0 || remainingQuota <= 0}
                className="btn-primary"
                style={{
                  flex: 2,
                  padding: "0.75rem",
                  fontSize: "0.92rem",
                  fontWeight: 800,
                  opacity: parsedBulkProducts.length === 0 || remainingQuota <= 0 ? 0.5 : 1,
                  cursor: parsedBulkProducts.length === 0 || remainingQuota <= 0 ? "not-allowed" : "pointer"
                }}
              >
                <Check size={16} /> Import {Math.min(parsedBulkProducts.length, remainingQuota)} Product{Math.min(parsedBulkProducts.length, remainingQuota) === 1 ? "" : "s"} to Store
              </button>
            </div>

          </div>
        </div>
      )}

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
                    <option value="custom">+ Other / Add Custom Category...</option>
                  </select>
                  {categoryId === "custom" && (
                    <input
                      type="text"
                      required
                      placeholder="Enter custom category name (e.g. Pet Supplies)..."
                      value={customCategoryName}
                      onChange={(e) => setCustomCategoryName(e.target.value)}
                      style={{ marginTop: "0.5rem" }}
                    />
                  )}
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
