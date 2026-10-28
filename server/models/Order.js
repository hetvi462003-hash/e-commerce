import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product_id: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    variations: { type: Object, default: {} },
    image: { type: String, default: "" },
    vendor_id: { type: String, default: "" }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    order_id: { type: String, required: true, unique: true },
    vendor_id: { type: String, required: true },
    vendor_name: { type: String, required: true },
    customer_name: { type: String, required: true },
    customer_phone: { type: String, required: true },
    customer_email: { type: String, default: "" },
    fulfillment_type: {
      type: String,
      enum: ["Collection at Stall", "Island Courier Delivery"],
      default: "Collection at Stall"
    },
    // Backwards-compatibility with legacy type
    type: { type: String, default: "PICKUP" },
    items: [orderItemSchema],
    total_amount: { type: Number, required: true },
    commission_amount: { type: Number, default: 0 },
    currency: { type: String, default: "KYD" },
    // 9 Client Specified Order Statuses
    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Confirmed",
        "Awaiting Payment",
        "Processing",
        "Ready for Collection",
        "Out for Delivery",
        "Completed",
        "Cancelled"
      ],
      default: "New"
    },
    // Client Specified Payment Statuses
    payment_status: {
      type: String,
      enum: ["Pending", "Partially Paid", "Paid", "Refunded"],
      default: "Pending"
    },
    // Client Specified Payment Methods (Manual Tracking)
    payment_method: {
      type: String,
      enum: ["Cash on Collection", "Cash on Delivery", "Local Bank Transfer", "Other", "Pending"],
      default: "Pending"
    },
    delivery_address: { type: String, default: null },
    pickup_location: { type: String, default: null },
    special_notes: { type: String, default: "" },
    whatsapp_message: { type: String, default: "" },
    whatsapp_url: { type: String, default: "" },
    send_whatsapp: { type: Boolean, default: true },
    completion_time: { type: Date, default: null }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;

