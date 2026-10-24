import express from "express";
import Vendor from "../models/Vendor.js";

const router = express.Router();

// GET all vendors (optionally filter by district or status)
router.get("/", async (req, res) => {
  try {
    const { district, status } = req.query;
    const filter = {};
    if (district && district !== "all") filter.district = district;
    if (status) filter.status = status;

    const vendors = await Vendor.find(filter).sort({ rating: -1, createdAt: -1 });
    res.json({ success: true, count: vendors.length, data: vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single vendor by vendor_id or slug
router.get("/:id", async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      $or: [{ vendor_id: req.params.id }, { slug: req.params.id }]
    });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
    res.json({ success: true, data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST register new vendor
router.post("/", async (req, res) => {
  try {
    const vendor_id = req.body.vendor_id || req.body.id || `v-${Date.now()}`;
    const baseSlug = (req.body.store_name || "stall").toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    const existingSlug = await Vendor.findOne({ slug: baseSlug });
    const slug = existingSlug ? `${baseSlug}-${Date.now().toString().slice(-4)}` : baseSlug;

    const newVendor = new Vendor({
      ...req.body,
      vendor_id,
      slug,
      status: req.body.status || "pending_approval"
    });

    const saved = await newVendor.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update vendor profile and settings
router.put("/:id", async (req, res) => {
  try {
    const query = {
      $or: [
        { vendor_id: req.params.id },
        { slug: req.params.id }
      ]
    };
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      query.$or.push({ _id: req.params.id });
    }

    const updated = await Vendor.findOneAndUpdate(
      query,
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "Vendor not found" });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PATCH toggle verification (Admin)
router.patch("/:id/verify", async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ vendor_id: req.params.id });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    vendor.verified = !vendor.verified;
    await vendor.save();
    res.json({ success: true, data: vendor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PATCH toggle status (active, inactive, hidden)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const vendor = await Vendor.findOneAndUpdate(
      { vendor_id: req.params.id },
      { $set: { status } },
      { new: true }
    );
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
    res.json({ success: true, data: vendor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
