import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Vendor from "../models/Vendor.js";
import WalletLedger from "../models/WalletLedger.js";

const router = express.Router();

// Helper: Handle commission deduction on order completion
export const processOrderCommission = async (order) => {
  const vendor = await Vendor.findOne({ vendor_id: order.vendor_id });
  if (!vendor) return;

  const commission = order.commission_amount || Number((order.total_amount * (vendor.commission_rate || 0.10)).toFixed(2));
  const newBalance = Number((vendor.wallet_balance - commission).toFixed(2));
  const isSuspended = newBalance <= 0;

  vendor.wallet_balance = newBalance;
  if (isSuspended) {
    vendor.status = "inactive";
  }
  await vendor.save();

  // Create Ledger record
  const ledger_id = `LED-${Math.floor(1000 + Math.random() * 9000)}`;
  const ledgerEntry = new WalletLedger({
    ledger_id,
    vendor_id: vendor.vendor_id,
    type: "COMMISSION_DEDUCTION",
    description: `Platform Commission (10%) for Order #${order.order_id}`,
    amount: -commission,
    order_id: order.order_id
  });
  await ledgerEntry.save();
};

// GET all orders
router.get("/", async (req, res) => {
  try {
    const { vendor_id, customer_phone, status, type } = req.query;
    const filter = {};

    if (vendor_id) filter.vendor_id = vendor_id;
    if (customer_phone) filter.customer_phone = customer_phone;
    if (status) filter.status = status;
    if (type) filter.type = type;

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single order
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findOne({ order_id: req.params.id });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST place order (Flow A: COD & Flow B: Reserve for Store Pickup with 4-Digit PIN)
router.post("/", async (req, res) => {
  try {
    const {
      type, // 'COD' | 'PICKUP'
      customer_name,
      customer_phone,
      customer_email,
      delivery_address,
      special_notes,
      send_whatsapp,
      items // [{ product_id, title, price, qty, variations, image }]
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart items are required" });
    }

    // Group items by vendor
    const vendorGrouped = {};
    for (const it of items) {
      const prod = await Product.findOne({ product_id: it.product_id });
      const vId = prod?.vendor_id || it.vendor_id || "v-101";
      if (!vendorGrouped[vId]) vendorGrouped[vId] = [];
      vendorGrouped[vId].push({ ...it, product_doc: prod });
    }

    const createdOrders = [];
    const baseOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    let index = 1;
    for (const vId of Object.keys(vendorGrouped)) {
      const vendorItems = vendorGrouped[vId];
      const vendor = await Vendor.findOne({ vendor_id: vId });
      const subOrderId = Object.keys(vendorGrouped).length > 1 ? `${baseOrderId}-${index++}` : baseOrderId;

      const subTotal = vendorItems.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
      const commissionRate = vendor?.commission_rate || 0.10;
      const commissionAmount = Number((subTotal * commissionRate).toFixed(2));

      // Pickup PIN generation
      const pin_code = type === "PICKUP" ? Math.floor(1000 + Math.random() * 9000).toString() : null;
      const qr_code = type === "PICKUP" ? `CAYMAN-PICKUP-${subOrderId}-${pin_code}` : null;
      const hold_until = type === "PICKUP" ? new Date(Date.now() + 48 * 3600 * 1000) : null;

      const newOrder = new Order({
        order_id: subOrderId,
        vendor_id: vId,
        vendor_name: vendor?.store_name || "Cayman Merchant",
        customer_name,
        customer_phone,
        customer_email,
        type,
        items: vendorItems.map((ci) => ({
          product_id: ci.product_id,
          title: ci.title,
          price: ci.price,
          qty: ci.qty,
          variations: ci.variations || {},
          image: ci.image || ""
        })),
        total_amount: subTotal,
        commission_amount: commissionAmount,
        currency: "KYD",
        status: "Pending",
        pin_code,
        qr_code,
        hold_until,
        delivery_address: type === "COD" ? delivery_address : null,
        pickup_location: type === "PICKUP" ? (vendor?.address || `${vendor?.district}, Grand Cayman`) : null,
        special_notes,
        send_whatsapp: send_whatsapp !== undefined ? send_whatsapp : true
      });

      const savedOrder = await newOrder.save();

      // Decrement product stock count
      for (const ci of vendorItems) {
        if (ci.product_doc) {
          const newStock = Math.max(0, ci.product_doc.stock_count - ci.qty);
          ci.product_doc.stock_count = newStock;
          if (newStock === 0) ci.product_doc.status = "out-of-stock";
          await ci.product_doc.save();
        }
      }

      createdOrders.push(savedOrder);
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: createdOrders.length === 1 ? createdOrders[0] : createdOrders
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PATCH update order status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOne({ order_id: req.params.id });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const previousStatus = order.status;
    order.status = status;

    if (status === "Completed" && previousStatus !== "Completed") {
      order.completion_time = new Date();
      await processOrderCommission(order);
    }

    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// POST store clerk physical pickup verification via 4-digit PIN terminal
router.post("/verify-pin", async (req, res) => {
  try {
    const { pin_code, vendor_id } = req.body;

    if (!pin_code || pin_code.trim().length !== 4) {
      return res.status(400).json({ success: false, message: "Valid 4-digit PIN is required" });
    }

    const filter = {
      type: "PICKUP",
      pin_code: pin_code.trim(),
      status: { $ne: "Completed" }
    };
    if (vendor_id) filter.vendor_id = vendor_id;

    const order = await Order.findOne(filter);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No active pickup reservation found for this 4-Digit PIN. Please re-check code."
      });
    }

    // Complete order & deduct platform commission
    order.status = "Completed";
    order.completion_time = new Date();
    await order.save();

    await processOrderCommission(order);

    res.json({
      success: true,
      message: `4-Digit PIN verified! Order #${order.order_id} completed successfully. 10% platform commission deducted from vendor wallet.`,
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
