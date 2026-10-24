import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema(
  {
    dispute_id: { type: String, required: true, unique: true },
    order_id: { type: String, required: true },
    customer_name: { type: String, required: true },
    customer_phone: { type: String, required: true },
    vendor_id: { type: String, required: true },
    vendor_name: { type: String, required: true },
    type: { type: String, enum: ["COD", "PICKUP"], required: true },
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["Under Review", "Resolved - Refunded", "Dismissed"],
      default: "Under Review"
    },
    resolution_notes: { type: String, default: "" }
  },
  { timestamps: true }
);

const Dispute = mongoose.model("Dispute", disputeSchema);
export default Dispute;
