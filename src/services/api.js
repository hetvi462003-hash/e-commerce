// CaymanBazaar Backend API Service
const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== "undefined" && window.location.hostname === "localhost" ? "http://localhost:5000/api" : "/api");

const request = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      },
      ...options
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn(`[API Error: ${endpoint}]`, err.message);
    return { success: false, message: err.message };
  }
};

export const api = {
  // Health
  checkHealth: () => request("/health"),

  // Vendors
  getVendors: (params = "") => request(`/vendors${params}`),
  getVendorById: (id) => request(`/vendors/${id}`),
  registerVendor: (vendorData) => request("/vendors", { method: "POST", body: JSON.stringify(vendorData) }),
  updateVendor: (id, fields) => request(`/vendors/${id}`, { method: "PUT", body: JSON.stringify(fields) }),
  toggleVendorVerification: (id) => request(`/vendors/${id}/verify`, { method: "PATCH" }),

  // Products
  getProducts: (params = "") => request(`/products${params}`),
  getProductById: (id) => request(`/products/${id}`),
  createProduct: (productData) => request("/products", { method: "POST", body: JSON.stringify(productData) }),
  updateProduct: (id, fields) => request(`/products/${id}`, { method: "PUT", body: JSON.stringify(fields) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),

  // Orders
  getOrders: (params = "") => request(`/orders${params}`),
  getOrderById: (id) => request(`/orders/${id}`),
  placeOrder: (orderData) => request("/orders", { method: "POST", body: JSON.stringify(orderData) }),
  updateOrderStatus: (id, status) => request(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  verifyPickupPin: (pin_code, vendor_id) => request("/orders/verify-pin", { method: "POST", body: JSON.stringify({ pin_code, vendor_id }) }),

  // Wallet
  getLedger: (vendor_id) => request(`/wallet/ledger${vendor_id ? `?vendor_id=${vendor_id}` : ""}`),
  topupWallet: (vendor_id, amount) => request("/wallet/topup", { method: "POST", body: JSON.stringify({ vendor_id, amount }) }),
  getWalletSummary: () => request("/wallet/summary"),

  // Ads
  getAds: (params = "") => request(`/ads${params}`),
  createAd: (adData) => request("/ads", { method: "POST", body: JSON.stringify(adData) }),
  toggleAdStatus: (id, status) => request(`/ads/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  clickAd: (id) => request(`/ads/${id}/click`, { method: "POST" }),

  // Disputes
  getDisputes: (params = "") => request(`/disputes${params}`),
  createDispute: (disputeData) => request("/disputes", { method: "POST", body: JSON.stringify(disputeData) }),
  resolveDispute: (id, status, resolution_notes) => request(`/disputes/${id}/resolve`, { method: "PATCH", body: JSON.stringify({ status, resolution_notes }) }),

  // Auth
  login: (email, password) => request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (userData) => request("/auth/register", { method: "POST", body: JSON.stringify(userData) })
};

export default api;
