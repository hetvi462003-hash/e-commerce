import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";

import Vendor from "../models/Vendor.js";
import Product from "../models/Product.js";
import AdCampaign from "../models/AdCampaign.js";
import WalletLedger from "../models/WalletLedger.js";
import Dispute from "../models/Dispute.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

import { INITIAL_VENDORS, INITIAL_PRODUCTS, INITIAL_ADS, INITIAL_LEDGER } from "../../src/data/mockData.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("[Seed] Connected to MongoDB. Clearing existing collections...");

    await Vendor.deleteMany();
    await Product.deleteMany();
    await AdCampaign.deleteMany();
    await WalletLedger.deleteMany();
    await Dispute.deleteMany();
    await User.deleteMany();

    console.log("[Seed] Seeding Vendors...");
    const formattedVendors = INITIAL_VENDORS.map((v) => ({
      vendor_id: v.id,
      store_name: v.store_name,
      slug: v.slug || v.store_name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      owner_name: v.owner_name || "Cayman Artisan",
      phone: v.phone || "+1 (345) 949-0000",
      email: v.email || "merchant@caymanbazaar.ky",
      logo: v.logo || "",
      banner: v.banner || "",
      photo: v.photo || v.banner || "",
      district: v.district,
      address: v.address,
      bio: v.bio || "",
      specialty: v.specialty || "",
      rating: v.rating || 5.0,
      review_count: v.reviews_count || 10,
      verified: v.verified !== undefined ? v.verified : true,
      wallet_balance: v.wallet_balance !== undefined ? v.wallet_balance : 100.0,
      commission_rate: v.commission_rate || 0.10,
      status: v.status || "active",
      operating_hours: v.hours || "Mon - Sat: 9:00 AM - 6:00 PM",
      policies: v.policies || {
        return_policy: "7-day return policy for unused items.",
        pickup_policy: "Reserved for 48 hours with 4-digit PIN.",
        shipping_policy: "Island-wide Grand Cayman courier delivery."
      },
      social_connections: v.social_connections || {}
    }));
    await Vendor.insertMany(formattedVendors);
    console.log(`[Seed] Seeded ${formattedVendors.length} vendors.`);

    console.log("[Seed] Seeding Products...");
    const formattedProducts = INITIAL_PRODUCTS.map((p) => ({
      product_id: p.id,
      vendor_id: p.vendor_id,
      vendor_name: p.vendor_name || "Cayman Vendor",
      title: p.title,
      description: p.description || "",
      price: p.price,
      sku: p.sku || `SKU-${p.id}`,
      stock_count: p.stock_count !== undefined ? p.stock_count : 15,
      variations: p.variations || {},
      images: p.images || [],
      category_id: p.category_id,
      status: p.status || "active",
      is_featured: p.is_featured || false,
      is_sponsored: p.is_sponsored || false,
      badge: p.badge || ""
    }));
    await Product.insertMany(formattedProducts);
    console.log(`[Seed] Seeded ${formattedProducts.length} products.`);

    console.log("[Seed] Seeding Ad Campaigns...");
    const formattedAds = INITIAL_ADS.map((a) => ({
      ad_id: a.id,
      vendor_id: a.vendor_id,
      vendor_name: a.vendor_name || "Cayman Vendor",
      type: a.type || "featured_store",
      title: a.title,
      budget_type: a.budget_type || "per_day",
      daily_budget: a.daily_budget || 10.0,
      balance_credit: a.balance_credit || 50.0,
      impressions: a.impressions || 120,
      clicks: a.clicks || 15,
      status: a.status || "active"
    }));
    await AdCampaign.insertMany(formattedAds);
    console.log(`[Seed] Seeded ${formattedAds.length} ad campaigns.`);

    console.log("[Seed] Seeding Wallet Ledger...");
    const formattedLedger = INITIAL_LEDGER.map((l) => ({
      ledger_id: l.id,
      vendor_id: l.vendor_id,
      type: l.type === "commission_deduction" ? "COMMISSION_DEDUCTION" : (l.type === "deposit" ? "DEPOSIT" : "ADJUSTMENT"),
      description: l.description,
      amount: l.amount,
      order_id: l.order_id || null
    }));
    await WalletLedger.insertMany(formattedLedger);
    console.log(`[Seed] Seeded ${formattedLedger.length} ledger entries.`);

    console.log("[Seed] Seeding Disputes...");
    const seedDisputes = [
      {
        dispute_id: "DSP-301",
        order_id: "ORD-9710",
        customer_name: "Sarah Jenkins",
        customer_phone: "+1 (345) 916-2244",
        vendor_id: "v-101",
        vendor_name: "Grand Cayman Artisan Hub",
        type: "COD",
        amount: 45.00,
        reason: "Damaged pendant clasp upon courier delivery",
        status: "Under Review"
      },
      {
        dispute_id: "DSP-302",
        order_id: "ORD-9694",
        customer_name: "Liam O'Connor",
        customer_phone: "+1 (345) 928-8833",
        vendor_id: "v-102",
        vendor_name: "Seven Mile Surf & Watersports",
        type: "PICKUP",
        amount: 58.00,
        reason: "Customer arrived at stall, wrong mask size held",
        status: "Resolved - Refunded"
      }
    ];
    await Dispute.insertMany(seedDisputes);
    console.log(`[Seed] Seeded ${seedDisputes.length} disputes.`);

    console.log("[Seed] Creating Default Users...");
    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash("admin123", salt);
    const vendorPass = await bcrypt.hash("vendor123", salt);
    const customerPass = await bcrypt.hash("customer123", salt);

    await User.create([
      {
        name: "Platform Administrator",
        email: "admin@caymanbazaar.ky",
        password: adminPass,
        role: "admin"
      },
      {
        name: "Sarah Ebanks (Artisan Hub)",
        email: "vendor@caymanbazaar.ky",
        password: vendorPass,
        role: "vendor",
        vendor_id: "v-101"
      },
      {
        name: "David Sterling",
        email: "customer@caymanbazaar.ky",
        password: customerPass,
        role: "customer"
      }
    ]);
    console.log("[Seed] Seeded 3 default users (admin, vendor, customer).");

    console.log("[Seed Complete] 🎉 All CaymanBazaar data successfully populated in MongoDB!");
    process.exit(0);
  } catch (error) {
    console.error("[Seed Error]", error);
    process.exit(1);
  }
};

seedDatabase();
