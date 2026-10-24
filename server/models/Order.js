import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product_id: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    variations: { type: Object, default: {} },
    image: { type: String, default: "" }
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
    type: { type: String, enum: ["COD", "PICKUP"], required: true },
    items: [orderItemSchema],
    total_amount: { type: Number, required: true },
    commission_amount: { type: Number, required: true },
    currency: { type: String, default: "KYD" },
    status: {
      type: String,
      enum: ["Pending", "Packing", "Ready for Pickup", "Out for Delivery", "Completed", "Cancelled"],
      default: "Pending"
    },
    pin_code: { type: String, default: null },
    qr_code: { type: String, default: null },
    hold_until: { type: Date, default: null },
    delivery_address: { type: String, default: null },
    pickup_location: { type: String, default: null },
    special_notes: { type: String, default: "" },
    send_whatsapp: { type: Boolean, default: true },
    completion_time: { type: Date, default: null }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
