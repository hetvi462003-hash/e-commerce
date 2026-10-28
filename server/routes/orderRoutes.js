import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Vendor from "../models/Vendor.js";
import WalletLedger from "../models/WalletLedger.js";

const router = express.Router();

// Helper: Handle commission deduction on order completion
// Helper: Record commission for reporting without punitive auto-suspension
export const processOrderCommission = async (order) => {
  try {
    const vendor = await Vendor.findOne({ vendor_id: order.vendor_id });
    if (!vendor) return;

    const commission = order.commission_amount || Number((order.total_amount * (vendor.commission_rate || 0.10)).toFixed(2));
    
    // Create Ledger record for sales tracking
    const ledger_id = `LED-${Math.floor(1000 + Math.random() * 9000)}`;
    const ledgerEntry = new WalletLedger({
      ledger_id,
      vendor_id: vendor.vendor_id,
      type: "COMMISSION_DEDUCTION",
      description: `Platform Fee (${Number((vendor.commission_rate || 0.10) * 100).toFixed(0)}%) for Order #${order.order_id}`,
      amount: -commission,
      order_id: order.order_id
    });
    await ledgerEntry.save();
  } catch (err) {
    console.warn("Commission ledger log skipped:", err.message);
  }
};

// GET all orders
router.get("/", async (req, res) => {
  try {
    const { vendor_id, customer_phone, status, fulfillment_type } = req.query;
    const filter = {};

    if (vendor_id) filter.vendor_id = vendor_id;
    if (customer_phone) filter.customer_phone = customer_phone;
    if (status) filter.status = status;
    if (fulfillment_type) filter.fulfillment_type = fulfillment_type;

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

// POST place order via WhatsApp checkout flow
router.post("/", async (req, res) => {
  try {
    const {
      fulfillment_type, // 'Collection at Stall' | 'Island Courier Delivery'
      type, // legacy fallback
      customer_name,
      customer_phone,
      customer_email,
      delivery_address,
      special_notes,
      items // [{ product_id, title, price, qty, variations, image }]
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart items are required" });
    }

    const effectiveFulfillment = fulfillment_type || (type === "COD" ? "Island Courier Delivery" : "Collection at Stall");

    // Group items by vendor
    const vendorGrouped = {};
    for (const it of items) {
      const prod = await Product.findOne({ product_id: it.product_id });
      const vId = prod?.vendor_id || it.vendor_id || "v-101";
      if (!vendorGrouped[vId]) vendorGrouped[vId] = [];
      vendorGrouped[vId].push({ ...it, product_doc: prod });
    }

    const createdOrders = [];
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const baseOrderId = `CB-${randomSuffix}`;

    const CENTRAL_WHATSAPP = "13459492299";

    let index = 1;
    for (const vId of Object.keys(vendorGrouped)) {
      const vendorItems = vendorGrouped[vId];
      const vendor = await Vendor.findOne({ vendor_id: vId });
      const subOrderId = Object.keys(vendorGrouped).length > 1 ? `${baseOrderId}-${index++}` : baseOrderId;

      const subTotal = vendorItems.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
      const commissionRate = vendor?.commission_rate || 0.10;
      const commissionAmount = Number((subTotal * commissionRate).toFixed(2));

      // Build WhatsApp Pre-filled message
      const itemsListText = vendorItems
        .map((ci) => `• ${ci.qty}x ${ci.title} ($${Number(ci.price).toFixed(2)} KYD)`)
        .join("\n");

      const waText = 
`*New Order Request - Cayman Bazaar*
Order Ref: #${subOrderId}
Store: ${vendor?.store_name || "Cayman Island Stall"}

*Customer Details:*
Name: ${customer_name}
Phone: ${customer_phone}
${customer_email ? `Email: ${customer_email}\n` : ""}Fulfillment: ${effectiveFulfillment}
${effectiveFulfillment === "Island Courier Delivery" ? `Delivery Address: ${delivery_address || "Provided via chat"}\n` : `Pickup Stall: ${vendor?.address || vendor?.store_name}\n`}
*Items Ordered:*
${itemsListText}

*Total Due:* $${subTotal.toFixed(2)} KYD
${special_notes ? `\n*Notes:* ${special_notes}` : ""}

Please confirm receipt and let me know the collection / delivery ETA. Thank you!`;

      const whatsappUrl = `https://wa.me/${CENTRAL_WHATSAPP}?text=${encodeURIComponent(waText)}`;

      const newOrder = new Order({
        order_id: subOrderId,
        vendor_id: vId,
        vendor_name: vendor?.store_name || "Cayman Merchant",
        customer_name,
        customer_phone,
        customer_email,
        fulfillment_type: effectiveFulfillment,
        type: effectiveFulfillment === "Island Courier Delivery" ? "COD" : "PICKUP",
        items: vendorItems.map((ci) => ({
          product_id: ci.product_id,
          title: ci.title,
          price: ci.price,
          qty: ci.qty,
          variations: ci.variations || {},
          image: ci.image || "",
          vendor_id: vId
        })),
        total_amount: subTotal,
        commission_amount: commissionAmount,
        currency: "KYD",
        status: "New", // 9 Client statuses: New, Contacted, Confirmed, Awaiting Payment, Processing, Ready for Collection, Out for Delivery, Completed, Cancelled
        payment_status: "Pending", // Pending, Partially Paid, Paid, Refunded
        payment_method: effectiveFulfillment === "Island Courier Delivery" ? "Cash on Delivery" : "Cash on Collection",
        delivery_address: effectiveFulfillment === "Island Courier Delivery" ? delivery_address : null,
        pickup_location: effectiveFulfillment === "Collection at Stall" ? (vendor?.address || `${vendor?.district}, Grand Cayman`) : null,
        special_notes,
        whatsapp_message: waText,
        whatsapp_url: whatsappUrl,
        send_whatsapp: true
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

// PATCH update order status & payment details
router.patch("/:id/status", async (req, res) => {
  try {
    const { status, payment_status, payment_method } = req.body;
    const order = await Order.findOne({ order_id: req.params.id });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (status) {
      const previousStatus = order.status;
      order.status = status;
      if (status === "Completed" && previousStatus !== "Completed") {
        order.completion_time = new Date();
        await processOrderCommission(order);
      }
    }

    if (payment_status) {
      order.payment_status = payment_status;
    }

    if (payment_method) {
      order.payment_method = payment_method;
    }

    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;

