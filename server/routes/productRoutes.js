import express from "express";
import Product from "../models/Product.js";
import Vendor from "../models/Vendor.js";

const router = express.Router();

// GET all products with filtering
router.get("/", async (req, res) => {
  try {
    const { category, vendor_id, district, search, status } = req.query;
    const filter = {};

    if (category && category !== "all") filter.category_id = category;
    if (vendor_id) filter.vendor_id = vendor_id;
    if (status) filter.status = status;
    else filter.status = { $ne: "hidden" };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // Filter by district if specified
    if (district && district !== "all") {
      const vendorIds = await Vendor.find({ district }).distinct("vendor_id");
      filter.vendor_id = { $in: vendorIds };
    }

    const products = await Product.find(filter).sort({ is_featured: -1, createdAt: -1 });
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ product_id: req.params.id });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create product
router.post("/", async (req, res) => {
  try {
    const count = await Product.countDocuments();
    const product_id = `p-${201 + count}`;

    const vendor = await Vendor.findOne({ vendor_id: req.body.vendor_id });
    const vendor_name = vendor?.store_name || req.body.vendor_name || "Cayman Merchant";

    const newProduct = new Product({
      ...req.body,
      product_id,
      vendor_name
    });

    const saved = await newProduct.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update product & inventory
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { product_id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ product_id: req.params.id });
    if (!deleted) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
