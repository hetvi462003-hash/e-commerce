import express from "express";
import AdCampaign from "../models/AdCampaign.js";
import Vendor from "../models/Vendor.js";

const router = express.Router();

// GET all ads
router.get("/", async (req, res) => {
  try {
    const { vendor_id, status } = req.query;
    const filter = {};
    if (vendor_id) filter.vendor_id = vendor_id;
    if (status) filter.status = status;

    const ads = await AdCampaign.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: ads.length, data: ads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create ad campaign
router.post("/", async (req, res) => {
  try {
    const count = await AdCampaign.countDocuments();
    const ad_id = `ad-${501 + count}`;

    const vendor = await Vendor.findOne({ vendor_id: req.body.vendor_id });
    const vendor_name = vendor?.store_name || req.body.vendor_name || "Cayman Merchant";

    const newAd = new AdCampaign({
      ...req.body,
      ad_id,
      vendor_name
    });

    const saved = await newAd.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PATCH toggle ad status (active / paused)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const ad = await AdCampaign.findOneAndUpdate(
      { ad_id: req.params.id },
      { $set: { status } },
      { new: true }
    );
    if (!ad) return res.status(404).json({ success: false, message: "Ad campaign not found" });
    res.json({ success: true, data: ad });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// POST record ad click & impression
router.post("/:id/click", async (req, res) => {
  try {
    const ad = await AdCampaign.findOne({ ad_id: req.params.id });
    if (!ad) return res.status(404).json({ success: false, message: "Ad not found" });

    ad.clicks += 1;
    if (ad.budget_type === "per_click" && ad.balance_credit > 0.50) {
      ad.balance_credit = Number((ad.balance_credit - 0.50).toFixed(2));
      if (ad.balance_credit <= 0) ad.status = "paused";
    }
    await ad.save();

    res.json({ success: true, clicks: ad.clicks, balance_credit: ad.balance_credit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
