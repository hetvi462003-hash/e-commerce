import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    product_id: { type: String, required: true, unique: true },
    vendor_id: { type: String, required: true, ref: "Vendor" },
    vendor_name: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    sku: { type: String, required: true, trim: true },
    stock_count: { type: Number, required: true, min: 0, default: 10 },
    variations: {
      type: Map,
      of: [String],
      default: {}
    },
    images: [{ type: String }],
    category_id: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "hidden", "out-of-stock"],
      default: "active"
    },
    is_featured: { type: Boolean, default: false },
    is_sponsored: { type: Boolean, default: false },
    badge: { type: String, default: "" }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
