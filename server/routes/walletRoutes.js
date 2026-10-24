import express from "express";
import WalletLedger from "../models/WalletLedger.js";
import Vendor from "../models/Vendor.js";
import Order from "../models/Order.js";

const router = express.Router();

// GET wallet ledger entries
router.get("/ledger", async (req, res) => {
  try {
    const { vendor_id } = req.query;
    const filter = vendor_id ? { vendor_id } : {};
    const ledger = await WalletLedger.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: ledger.length, data: ledger });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST top-up vendor wallet balance
router.post("/topup", async (req, res) => {
  try {
    const { vendor_id, amount } = req.body;
    const topupVal = Number(amount);

    if (!vendor_id || isNaN(topupVal) || topupVal <= 0) {
      return res.status(400).json({ success: false, message: "Valid vendor_id and positive amount required" });
    }

    const vendor = await Vendor.findOne({ vendor_id });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    const newBalance = Number((vendor.wallet_balance + topupVal).toFixed(2));
    vendor.wallet_balance = newBalance;
    if (vendor.status === "inactive" && newBalance > 0) {
      vendor.status = "active";
    }
    await vendor.save();

    // Create deposit ledger entry
    const ledger_id = `LED-${Math.floor(1000 + Math.random() * 9000)}`;
    const entry = new WalletLedger({
      ledger_id,
      vendor_id,
      type: "DEPOSIT",
      description: `Manual Wallet Deposit via Cayman Bank Transfer / Wire`,
      amount: topupVal
    });
    await entry.save();

    res.json({
      success: true,
      message: `Successfully topped up $${topupVal.toFixed(2)} KYD to ${vendor.store_name}. New Balance: $${newBalance.toFixed(2)} KYD`,
      data: {
        vendor_id,
        wallet_balance: newBalance,
        status: vendor.status,
        ledgerEntry: entry
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET platform financial summary (Admin / Vendor metrics)
router.get("/summary", async (req, res) => {
  try {
    const completedOrders = await Order.find({ status: "Completed" });
    const totalGMV = completedOrders.reduce((acc, o) => acc + o.total_amount, 0);
    const totalCommissions = completedOrders.reduce((acc, o) => acc + (o.commission_amount || 0), 0);

    const vendors = await Vendor.find();
    const totalWalletFloat = vendors.reduce((acc, v) => acc + (v.wallet_balance || 0), 0);

    res.json({
      success: true,
      data: {
        totalGMV: Number(totalGMV.toFixed(2)),
        totalCommissions: Number(totalCommissions.toFixed(2)),
        totalWalletFloat: Number(totalWalletFloat.toFixed(2)),
        completedOrderCount: completedOrders.length,
        activeVendorCount: vendors.filter((v) => v.status === "active").length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
