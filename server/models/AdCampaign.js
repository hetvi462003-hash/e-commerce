import mongoose from "mongoose";

const adCampaignSchema = new mongoose.Schema(
  {
    ad_id: { type: String, required: true, unique: true },
    vendor_id: { type: String, required: true },
    vendor_name: { type: String, required: true },
    type: {
      type: String,
      enum: ["featured_store", "sponsored_product", "banner_slot"],
      required: true
    },
    title: { type: String, required: true },
    budget_type: { type: String, enum: ["per_day", "per_click"], default: "per_day" },
    daily_budget: { type: Number, default: 10.0 },
    balance_credit: { type: Number, default: 50.0 },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "paused", "completed"], default: "active" }
  },
  { timestamps: true }
);

const AdCampaign = mongoose.model("AdCampaign", adCampaignSchema);
export default AdCampaign;
