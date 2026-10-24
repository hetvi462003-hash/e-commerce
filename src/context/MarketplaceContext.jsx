import React, { createContext, useContext, useState, useEffect } from "react";
import {
  INITIAL_VENDORS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_LEDGER,
  INITIAL_ADS,
  INITIAL_REVIEWS,
  CATEGORIES
} from "../data/mockData";
import api from "../services/api";

const MarketplaceContext = createContext();

export const MarketplaceProvider = ({ children }) => {
  // Roles: 'customer' | 'vendor' | 'admin'
  const [userRole, setUserRole] = useState("customer");
  
  // Selected Vendor when in Vendor Portal mode
  const [activeVendorId, setActiveVendorId] = useState("v-101");
  
  // Currency: 'KYD' ($1.00 KYD) | 'USD' ($1.20 USD)
  const [currency, setCurrency] = useState("KYD");
  const KYD_TO_USD_RATE = 1.20;

  // Data States
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem("cayman_marketplace_orders");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem("cb_marketplace_reviews");
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch (e) {
      return INITIAL_REVIEWS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cb_marketplace_reviews", JSON.stringify(reviews));
    } catch (e) {}
  }, [reviews]);

  const [ledger, setLedger] = useState(INITIAL_LEDGER);
  const [ads, setAds] = useState(INITIAL_ADS);
  const [cart, setCart] = useState([]);

  // Customer Private Session (Phone & Profile for repeat orders)
  const [customerPhoneSession, setCustomerPhoneSessionState] = useState(() => {
    try {
      return localStorage.getItem("cayman_customer_phone") || "";
    } catch (e) {
      return "";
    }
  });

  const [customerProfile, setCustomerProfileState] = useState(() => {
    try {
      const saved = localStorage.getItem("cayman_customer_profile");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const setCustomerPhoneSession = (phone) => {
    setCustomerPhoneSessionState(phone);
    try {
      if (phone) {
        localStorage.setItem("cayman_customer_phone", phone);
      } else {
        localStorage.removeItem("cayman_customer_phone");
      }
    } catch (e) {}
  };

  const updateCustomerProfile = (profileData) => {
    setCustomerProfileState((prev) => {
      const updated = { ...(prev || {}), ...profileData };
      try {
        localStorage.setItem("cayman_customer_profile", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    if (profileData.phone) {
      setCustomerPhoneSession(profileData.phone);
    } else if (profileData.email && !customerPhoneSession) {
      setCustomerPhoneSession(profileData.email);
    }
  };

  const clearCustomerSession = () => {
    setCustomerPhoneSessionState("");
    setCustomerProfileState(null);
    try {
      localStorage.removeItem("cayman_customer_phone");
      localStorage.removeItem("cayman_customer_profile");
    } catch (e) {}
    showToast("Signed out successfully.");
  };

  // Persistent Amazon-style Customer Login Status
  const isCustomerLoggedIn = Boolean(
    customerPhoneSession ||
    customerProfile?.phone ||
    customerProfile?.email ||
    customerProfile?.name
  );

  const customerDisplayName =
    customerProfile?.name ||
    (customerProfile?.email ? customerProfile.email.split("@")[0] : "") ||
    customerPhoneSession ||
    "Shopper";

  // Global Authentication Modal Control
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState("customer");

  const openAuthModal = (role = "customer") => {
    setAuthModalRole(role);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Fetch live collections from MongoDB on mount
  useEffect(() => {
    const fetchMongoData = async () => {
      try {
        const [vRes, pRes, oRes, lRes, aRes] = await Promise.all([
          api.getVendors(),
          api.getProducts(),
          api.getOrders(),
          api.getLedger(),
          api.getAds()
        ]);

        if (vRes?.success && vRes.data?.length) {
          setVendors(vRes.data.map((v) => ({ ...v, id: v.vendor_id || v.id })));
        }
        if (pRes?.success && pRes.data?.length) {
          setProducts(pRes.data.map((p) => ({ ...p, id: p.product_id || p.id })));
        }
        if (oRes?.success && oRes.data?.length) {
          setOrders(oRes.data.map((o) => ({ ...o, id: o.order_id || o.id })));
        }
        if (lRes?.success && lRes.data?.length) {
          setLedger(lRes.data.map((l) => ({ ...l, id: l.ledger_id || l.id })));
        }
        if (aRes?.success && aRes.data?.length) {
          setAds(aRes.data.map((a) => ({ ...a, id: a.ad_id || a.id })));
        }
      } catch (err) {
        console.warn("Backend MongoDB offline or loading, fallback active:", err.message);
      }
    };
    fetchMongoData();
  }, []);

  // Save orders to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("cayman_marketplace_orders", JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);
  
  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (text, type = "success") => {
    setToast({ text, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  // Active vendor object
  const activeVendor = vendors.find((v) => v.id === activeVendorId) || vendors[0];

  // Price Formatter Helper
  const formatPrice = (amountInKYD) => {
    const val = Number(amountInKYD) || 0;
    if (currency === "USD") {
      const usdVal = val * KYD_TO_USD_RATE;
      return `$${usdVal.toFixed(2)} USD`;
    }
    return `$${val.toFixed(2)} KYD`;
  };

  // Cart Functions
  const addToCart = (product, selectedVariations = {}, qty = 1) => {
    // Check stock
    if (product.stock_count <= 0) {
      showToast(`Sorry, ${product.title} is currently out of stock!`, "error");
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && JSON.stringify(item.variations) === JSON.stringify(selectedVariations)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].qty + qty;
        if (newQty > product.stock_count) {
          showToast(`Cannot add more. Only ${product.stock_count} items available in stock.`, "warning");
          return prev;
        }
        updated[existingIndex].qty = newQty;
        showToast(`Updated quantity for ${product.title}`);
        return updated;
      } else {
        showToast(`Added ${product.title} to your bag!`);
        return [...prev, { product, variations: selectedVariations, qty }];
      }
    });
  };

  const updateCartQty = (index, delta) => {
    setCart((prev) => {
      const updated = [...prev];
      const item = updated[index];
      const newQty = item.qty + delta;
      
      if (newQty <= 0) {
        updated.splice(index, 1);
      } else if (newQty > item.product.stock_count) {
        showToast(`Only ${item.product.stock_count} units in stock.`, "warning");
        return prev;
      } else {
        updated[index].qty = newQty;
      }
      return updated;
    });
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    showToast("Item removed from bag.");
  };

  const clearCart = () => setCart([]);

  // Create Order Flow
  const placeOrder = (orderData) => {
    // orderData: { type: 'COD' | 'PICKUP', items: [...], customer_name, customer_phone, customer_email, delivery_address / pickup_location }
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    const qrString = `CAYMAN-PICKUP-${orderId}-${randomPin}`;

    // Group items by vendor to create distinct sub-orders if multiple vendors in cart
    const vendorGrouped = {};
    cart.forEach((cartItem) => {
      const vId = cartItem.product.vendor_id;
      if (!vendorGrouped[vId]) {
        vendorGrouped[vId] = [];
      }
      vendorGrouped[vId].push(cartItem);
    });

    const newOrdersCreated = [];

    Object.keys(vendorGrouped).forEach((vId, idx) => {
      const itemsList = vendorGrouped[vId];
      const vendorObj = vendors.find((v) => v.id === vId);
      const subOrderId = Object.keys(vendorGrouped).length > 1 ? `${orderId}-${idx + 1}` : orderId;

      const subTotal = itemsList.reduce((acc, curr) => acc + curr.product.price * curr.qty, 0);
      const commRate = vendorObj?.commission_rate || 0.10;
      const commissionAmount = Number((subTotal * commRate).toFixed(2));

      const newOrder = {
        id: subOrderId,
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        customer_email: orderData.customer_email,
        type: orderData.type, // 'COD' or 'PICKUP'
        vendor_id: vId,
        vendor_name: vendorObj?.store_name || "Cayman Vendor",
        items: itemsList.map((ci) => ({
          product_id: ci.product.id,
          title: ci.product.title,
          price: ci.product.price,
          qty: ci.qty,
          variations: ci.variations,
          image: ci.product.images[0]
        })),
        total_amount: subTotal,
        commission_amount: commissionAmount,
        currency: "KYD",
        status: "Pending", // Pending -> Packing -> Ready for Pickup / Out for Delivery -> Completed
        pin_code: orderData.type === "PICKUP" ? randomPin : null,
        qr_code: orderData.type === "PICKUP" ? qrString : null,
        hold_until: orderData.type === "PICKUP" ? new Date(Date.now() + 48 * 3600 * 1000).toISOString() : null,
        delivery_address: orderData.type === "COD" ? orderData.delivery_address : null,
        pickup_location: orderData.type === "PICKUP" ? vendorObj?.address : null,
        created_at: new Date().toISOString()
      };

      // Decrement product inventory
      itemsList.forEach((ci) => {
        setProducts((prevProds) =>
          prevProds.map((p) => {
            if (p.id === ci.product.id) {
              const newStock = Math.max(0, p.stock_count - ci.qty);
              return {
                ...p,
                stock_count: newStock,
                status: newStock === 0 ? "out-of-stock" : p.status
              };
            }
            return p;
          })
        );
      });

      newOrdersCreated.push(newOrder);
    });

    setOrders((prev) => [...newOrdersCreated, ...prev]);
    clearCart();
    showToast(`Order placed successfully! Reference: ${orderId}`, "success");

    // Sync to MongoDB backend in background
    try {
      api.placeOrder({
        type: orderData.type,
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        customer_email: orderData.customer_email,
        delivery_address: orderData.delivery_address,
        special_notes: orderData.special_notes,
        send_whatsapp: orderData.send_whatsapp,
        items: cart.map((ci) => ({
          product_id: ci.product.id,
          title: ci.product.title,
          price: ci.product.price,
          qty: ci.qty,
          variations: ci.variations,
          image: ci.product.images[0],
          vendor_id: ci.product.vendor_id
        }))
      });
    } catch (e) {
      console.warn("Backend order sync error:", e);
    }

    if (orderData.customer_phone) {
      setCustomerPhoneSession(orderData.customer_phone);
      updateCustomerProfile({
        name: orderData.customer_name,
        phone: orderData.customer_phone,
        email: orderData.customer_email,
        address: orderData.delivery_address
      });
    }

    return newOrdersCreated;
  };

  // Vendor Status update & Wallet deduction on Completed
  const updateOrderStatus = (orderId, newStatus) => {
    let targetOrder = null;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          targetOrder = { ...o, status: newStatus };
          return targetOrder;
        }
        return o;
      })
    );

    if (newStatus === "Completed" && targetOrder) {
      handleOrderCompletion(targetOrder);
    } else {
      showToast(`Order ${orderId} updated to '${newStatus}'`);
    }

    // Persist status change to MongoDB
    try {
      api.updateOrderStatus(orderId, newStatus);
    } catch (e) {}
  };

  // Handle Order Completion & Deduct Wallet Commission
  const handleOrderCompletion = (orderObj) => {
    const vId = orderObj.vendor_id;
    const commAmt = orderObj.commission_amount || 0;

    // Deduct from vendor wallet
    setVendors((prevVendors) =>
      prevVendors.map((v) => {
        if (v.id === vId) {
          const newBal = Number((v.wallet_balance - commAmt).toFixed(2));
          // If wallet <= 0, hide vendor products rule
          const isSuspended = newBal <= 0;
          if (isSuspended) {
            showToast(`Warning: Vendor ${v.store_name} wallet balance is $${newBal} KYD. Products automatically hidden until top-up!`, "error");
          }
          return {
            ...v,
            wallet_balance: newBal,
            status: isSuspended ? "inactive" : v.status
          };
        }
        return v;
      })
    );

    // Record in Wallet Ledger
    const ledgerEntry = {
      id: `LED-${Math.floor(1000 + Math.random() * 9000)}`,
      vendor_id: vId,
      type: "COMMISSION_DEDUCTION",
      description: `Commission deduction (${(orderObj.commission_amount / orderObj.total_amount * 100).toFixed(0)}%) for Order ${orderObj.id}`,
      amount: -commAmt,
      order_id: orderObj.id,
      created_at: new Date().toISOString()
    };
    setLedger((prev) => [ledgerEntry, ...prev]);

    showToast(`Order ${orderObj.id} Completed! $${commAmt} KYD platform commission deducted from vendor wallet.`);
  };

  // Verify PIN / QR for Pickup
  const verifyAndCompletePickup = (pinInput) => {
    const matchingOrder = orders.find(
      (o) => o.type === "PICKUP" && o.pin_code === pinInput && o.status !== "Completed" && o.status !== "Cancelled"
    );

    if (!matchingOrder) {
      showToast("Invalid PIN or Order has already been completed/cancelled.", "error");
      return false;
    }

    updateOrderStatus(matchingOrder.id, "Completed");
    showToast(`SUCCESS! Pickup PIN Verified for Order ${matchingOrder.id}. Order is now Completed.`, "success");
    return true;
  };

  // Vendor Wallet Top-Up
  const topupVendorWallet = (vendorId, amount) => {
    const topAmt = Number(amount);
    if (!topAmt || topAmt <= 0) return;

    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === vendorId) {
          const newBal = Number((v.wallet_balance + topAmt).toFixed(2));
          return {
            ...v,
            wallet_balance: newBal,
            status: "active" // Re-enable if suspended
          };
        }
        return v;
      })
    );

    const ledgerEntry = {
      id: `LED-${Math.floor(1000 + Math.random() * 9000)}`,
      vendor_id: vendorId,
      type: "DEPOSIT",
      description: `Vendor Credit Top-Up via Card/Bank Transfer`,
      amount: topAmt,
      order_id: null,
      created_at: new Date().toISOString()
    };
    setLedger((prev) => [ledgerEntry, ...prev]);

    showToast(`Successfully added $${topAmt.toFixed(2)} KYD to vendor wallet!`, "success");

    // Persist wallet top-up in MongoDB
    try {
      api.topupWallet(vendorId, topAmt);
    } catch (e) {}
  };

  // Add / Edit Product
  const saveProduct = (productData) => {
    if (productData.id) {
      // Edit
      setProducts((prev) => prev.map((p) => (p.id === productData.id ? { ...p, ...productData } : p)));
      showToast(`Updated product: ${productData.title}`);
    } else {
      // Add
      const newId = `p-${Date.now()}`;
      const newProd = {
        ...productData,
        id: newId,
        price_usd: Number((productData.price * KYD_TO_USD_RATE).toFixed(2)),
        status: productData.stock_count > 0 ? "active" : "out-of-stock"
      };
      setProducts((prev) => [newProd, ...prev]);
      showToast(`Added new product: ${productData.title}`);
    }
  };

  // Delete Product
  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast("Product deleted from stall catalog.", "info");
  };

  // Register a new Vendor Stall (Subject to SuperAdmin Approval)
  const registerVendor = async (newVendorData) => {
    const newId = `v-${Date.now()}`;
    const newVendor = {
      id: newId,
      vendor_id: newId,
      store_name: newVendorData.store_name,
      slug: (newVendorData.store_name || "stall").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      stall_number: newVendorData.stall_number || `STALL #${Math.floor(10 + Math.random() * 89)}`,
      owner_name: newVendorData.owner_name || "Artisan Merchant",
      phone: newVendorData.phone || "+1 (345) 949-0000",
      email: newVendorData.email || `${(newVendorData.store_name || "stall").toLowerCase().replace(/[^a-z0-9]/g, "")}@caymanbazaar.ky`,
      password: newVendorData.password || "merchant123",
      district: newVendorData.district || "Georgetown",
      address: newVendorData.address || `${newVendorData.district || "Georgetown"}, Grand Cayman`,
      rating: 5.0,
      review_count: 0,
      verified: false,
      bio: newVendorData.bio || "Locally crafted Caribbean goods and island souvenirs.",
      specialty: newVendorData.specialty || "Artisanal Island Crafts",
      photo: newVendorData.photo || "/cayman_stall_artisan.jpg",
      logo: newVendorData.logo || "https://images.unsplash.com/photo-1541643600914-78b084683601?w=150&auto=format&fit=crop&q=80",
      wallet_balance: 100.0,
      commission_rate: 0.10,
      status: "pending_approval",
      operating_hours: newVendorData.operating_hours || "Mon - Sat (9:00 AM - 6:00 PM)",
      accepts_pickup: true,
      accepts_cod: true,
      applied_at: new Date().toISOString()
    };

    setVendors((prev) => [newVendor, ...prev]);
    setActiveVendorId(newId);
    showToast(`⏳ Application Submitted! "${newVendor.store_name}" is pending SuperAdmin review.`, "info");

    try {
      const res = await api.registerVendor(newVendor);
      if (res?.success && res.data) {
        const synced = { ...res.data, id: res.data.vendor_id || res.data._id || newId };
        setVendors((prev) => prev.map((v) => (v.id === newId ? synced : v)));
        return synced;
      }
    } catch (e) {
      console.warn("Backend vendor registration fallback:", e);
    }

    return newVendor;
  };

  // Approve Pending Vendor (Admin)
  const approveVendor = async (vendorId) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId || v.vendor_id === vendorId
          ? { ...v, status: "active", verified: true }
          : v
      )
    );
    showToast("🎉 Stall approved! Store is now officially LIVE in the Island Directory.", "success");
    try {
      await api.updateVendor(vendorId, { status: "active", verified: true });
    } catch (e) {
      console.warn("Backend approveVendor fallback:", e);
    }
  };

  // Reject Vendor Application (Admin)
  const rejectVendor = async (vendorId) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId || v.vendor_id === vendorId
          ? { ...v, status: "rejected", verified: false }
          : v
      )
    );
    showToast("Vendor application rejected.", "warning");
    try {
      await api.updateVendor(vendorId, { status: "rejected", verified: false });
    } catch (e) {
      console.warn("Backend rejectVendor fallback:", e);
    }
  };


  // Vendor Profile update
  const updateVendorProfile = (vendorId, updatedFields) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, ...updatedFields } : v))
    );
    showToast("Store Profile updated successfully!");

    // Persist profile updates in MongoDB
    try {
      api.updateVendor(vendorId, updatedFields);
    } catch (e) {}
  };

  // Create Ad Campaign
  const createAdCampaign = (adData) => {
    const newAd = {
      id: `ad-${Date.now()}`,
      vendor_id: activeVendorId,
      vendor_name: activeVendor?.store_name || "Cayman Vendor",
      impressions: 0,
      clicks: 0,
      status: "active",
      ...adData
    };
    setAds((prev) => [newAd, ...prev]);
    showToast("New Sponsored Campaign created successfully!");
  };

  // 48-Hour Hold Expiry Helper
  const getHoldExpiryInfo = (order) => {
    if (!order || order.type !== "PICKUP" || order.status === "Completed" || order.status === "Cancelled") {
      return null;
    }
    const orderCreatedAt = new Date(order.created_at || order.createdAt || Date.now()).getTime();
    const expiryTime = orderCreatedAt + 48 * 60 * 60 * 1000;
    const now = Date.now();
    const diff = expiryTime - now;

    if (diff <= 0) {
      return { isExpired: true, text: "Hold Expired (Ready to Restock)", hoursLeft: 0, minutesLeft: 0 };
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return {
      isExpired: false,
      text: `${hours}h ${minutes}m hold remaining`,
      hoursLeft: hours,
      minutesLeft: minutes,
      isUrgent: hours < 6
    };
  };

  // Auto-Expire or Manual Cancel Expired Hold & Restock Inventory
  const cancelAndRestockHold = (orderId) => {
    const orderToCancel = orders.find((o) => o.id === orderId);
    if (!orderToCancel) return;

    // Restore stock for all items
    setProducts((prev) =>
      prev.map((p) => {
        const matchingItem = orderToCancel.items?.find((it) => (it.product_id || it.id) === p.id);
        if (matchingItem) {
          const restoredStock = (p.stock_count || 0) + matchingItem.qty;
          return {
            ...p,
            stock_count: restoredStock,
            status: restoredStock > 0 ? "active" : p.status
          };
        }
        return p;
      })
    );

    updateOrderStatus(orderId, "Cancelled");
    showToast(`Order #${orderId} cancelled & inventory automatically restocked.`, "info");
  };

  // Submit Verified Buyer Review
  const submitProductReview = (orderId, productId, reviewData) => {
    const { rating, comment, customerName, vendorId } = reviewData;
    const prod = products.find((p) => p.id === productId);
    const ven = vendors.find((v) => v.id === (vendorId || prod?.vendor_id) || v.vendor_id === (vendorId || prod?.vendor_id));

    const newReview = {
      id: `rev-${Date.now()}`,
      order_id: orderId,
      product_id: productId,
      product_title: prod?.title || "Island Artisan Creation",
      vendor_id: vendorId || prod?.vendor_id || "v-101",
      vendor_name: ven?.store_name || prod?.vendor_name || "Cayman Stall",
      stall_number: ven?.stall_number || "Stall",
      author: customerName || "Verified Buyer",
      rating: Number(rating),
      comment: comment.trim(),
      created_at: new Date().toISOString(),
      verified_purchase: true,
      vendor_reply: null,
      is_flagged: false,
      flag_reason: null,
      status: "published"
    };

    // 1. Add to global reviews list
    setReviews((prev) => [newReview, ...prev]);

    // 2. Mark order as reviewed
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, is_reviewed: true, review_rating: rating } : o))
    );

    // 3. Update Product rating and review count
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const currentCount = p.reviews_count || p.review_count || 1;
          const currentRating = p.rating || 5.0;
          const newCount = currentCount + 1;
          const newRating = Number(((currentRating * currentCount + rating) / newCount).toFixed(1));
          return {
            ...p,
            rating: newRating,
            reviews_count: newCount,
            reviews: [
              ...(p.reviews || []),
              newReview
            ]
          };
        }
        return p;
      })
    );

    // 4. Update Vendor review count & rating
    if (vendorId || prod?.vendor_id) {
      const targetVId = vendorId || prod?.vendor_id;
      setVendors((prev) =>
        prev.map((v) => {
          if (v.id === targetVId || v.vendor_id === targetVId) {
            const currentCount = v.reviews_count || v.review_count || 1;
            const currentRating = v.rating || 4.9;
            const newCount = currentCount + 1;
            const newRating = Number(((currentRating * currentCount + rating) / newCount).toFixed(1));
            return {
              ...v,
              rating: newRating,
              reviews_count: newCount,
              review_count: newCount
            };
          }
          return v;
        })
      );
    }

    showToast(`Thank you! Your verified ${rating}-star review has been published.`, "success");
  };

  // Vendor: Reply to a review
  const vendorReplyToReview = (reviewId, replyText) => {
    if (!replyText || !replyText.trim()) {
      showToast("Please enter a reply message.", "warning");
      return;
    }
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          return {
            ...r,
            vendor_reply: {
              text: replyText.trim(),
              replied_at: new Date().toISOString()
            }
          };
        }
        return r;
      })
    );
    showToast("Official stall reply published to storefront.", "success");
  };

  // Vendor: Flag / dispute an unfair or fake review to Admin
  const vendorReportReview = (reviewId, reason) => {
    if (!reason || !reason.trim()) {
      showToast("Please provide a reason for the report.", "warning");
      return;
    }
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          return {
            ...r,
            is_flagged: true,
            flag_reason: reason.trim()
          };
        }
        return r;
      })
    );
    showToast("Review reported to Admin moderation team.", "warning");
  };

  // Admin: Delete review & recalculate ratings
  const adminDeleteReview = (reviewId) => {
    const targetRev = reviews.find((r) => r.id === reviewId);
    if (!targetRev) return;

    const remainingReviews = reviews.filter((r) => r.id !== reviewId);
    setReviews(remainingReviews);

    // Recalculate product rating
    if (targetRev.product_id) {
      const prodRevs = remainingReviews.filter((r) => r.product_id === targetRev.product_id && r.status === "published");
      const pCount = prodRevs.length;
      const pRating = pCount > 0
        ? Number((prodRevs.reduce((acc, r) => acc + r.rating, 0) / pCount).toFixed(1))
        : 5.0;

      setProducts((prev) =>
        prev.map((p) => p.id === targetRev.product_id ? { ...p, rating: pRating, reviews_count: pCount } : p)
      );
    }

    // Recalculate vendor rating
    if (targetRev.vendor_id) {
      const venRevs = remainingReviews.filter((r) => r.vendor_id === targetRev.vendor_id && r.status === "published");
      const vCount = venRevs.length;
      const vRating = vCount > 0
        ? Number((venRevs.reduce((acc, r) => acc + r.rating, 0) / vCount).toFixed(1))
        : 5.0;

      setVendors((prev) =>
        prev.map((v) => (v.id === targetRev.vendor_id || v.vendor_id === targetRev.vendor_id)
          ? { ...v, rating: vRating, reviews_count: vCount, review_count: vCount }
          : v
        )
      );
    }

    showToast("Review removed & platform ratings recalculated.", "info");
  };

  // Admin: Dismiss vendor flag
  const adminDismissFlag = (reviewId) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          return {
            ...r,
            is_flagged: false,
            flag_reason: null
          };
        }
        return r;
      })
    );
    showToast("Dispute resolved: Review kept active.", "success");
  };

  // Toggle Vendor Verified Status (Admin)
  const toggleVendorVerification = async (vId) => {
    let nextVerified = true;
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === vId || v.vendor_id === vId) {
          nextVerified = !v.verified;
          return { ...v, verified: nextVerified };
        }
        return v;
      })
    );
    showToast(`Vendor verification status updated.`);
    try {
      await api.updateVendor(vId, { verified: nextVerified });
    } catch (e) {
      console.warn("Backend toggleVendorVerification fallback:", e);
    }
  };

  return (
    <MarketplaceContext.Provider
      value={{
        userRole,
        setUserRole,
        activeVendorId,
        setActiveVendorId,
        activeVendor,
        currency,
        setCurrency,
        formatPrice,
        vendors,
        products,
        orders,
        ledger,
        ads,
        reviews,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        placeOrder,
        updateOrderStatus,
        verifyAndCompletePickup,
        topupVendorWallet,
        registerVendor,
        approveVendor,
        rejectVendor,
        saveProduct,
        deleteProduct,
        updateVendorProfile,
        createAdCampaign,
        toggleVendorVerification,
        customerPhoneSession,
        setCustomerPhoneSession,
        customerProfile,
        updateCustomerProfile,
        clearCustomerSession,
        isCustomerLoggedIn,
        customerDisplayName,
        getHoldExpiryInfo,
        cancelAndRestockHold,
        submitProductReview,
        vendorReplyToReview,
        vendorReportReview,
        adminDeleteReview,
        adminDismissFlag,
        toast,
        showToast,
        isAuthModalOpen,
        authModalRole,
        openAuthModal,
        closeAuthModal,
        categories: CATEGORIES
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => useContext(MarketplaceContext);
