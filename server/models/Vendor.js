import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    vendor_id: { type: String, required: true, unique: true },
    store_name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    owner_name: { type: String, default: "Cayman Artisan" },
    phone: { type: String, default: "+1 (345) 949-0000" },
    email: { type: String, default: "merchant@caymanbazaar.ky" },
    logo: { type: String, default: "" },
    banner: { type: String, default: "" },
    photo: { type: String, default: "" },
    district: { type: String, required: true, default: "Georgetown" },
    address: { type: String, default: "Grand Cayman, Cayman Islands" },
    geo_location: {
      lat: { type: Number, default: 19.2869 },
      lng: { type: Number, default: -81.3674 }
    },
    bio: { type: String, default: "" },
    specialty: { type: String, default: "" },
    rating: { type: Number, default: 5.0 },
    review_count: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    wallet_balance: { type: Number, default: 100.0 },
    commission_rate: { type: Number, default: 0.10 },
    status: { 
      type: String, 
      enum: ["active", "inactive", "hidden", "pending_approval", "rejected"], 
      default: "pending_approval" 
    },
    stall_number: { type: String, default: "" },
    applied_at: { type: Date, default: Date.now },
    operating_hours: { type: String, default: "Mon - Sat (9:00 AM - 6:00 PM)" },
    hours: { type: String, default: "Mon - Sat: 9:00 AM - 6:00 PM" },
    reviews_count: { type: Number, default: 12 },
    accepts_pickup: { type: Boolean, default: true },
    accepts_cod: { type: Boolean, default: true },
    policies: {
      return_policy: { type: String, default: "7-day return policy for unused items in original packaging." },
      pickup_policy: { type: String, default: "Held for 48 hours with customer 4-digit PIN." },
      shipping_policy: { type: String, default: "Island-wide Grand Cayman courier delivery." }
    },
    payout_instructions: {
      type: String,
      default: "Cayman National Bank / Butterfield Bank - Island Merchant Branch"
    },
    social_connections: {
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      tiktok: { type: String, default: "" },
      pinterest: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

const Vendor = mongoose.model("Vendor", vendorSchema);
export default Vendor;
