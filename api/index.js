import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../server/config/db.js";

// Routes
import authRoutes from "../server/routes/authRoutes.js";
import vendorRoutes from "../server/routes/vendorRoutes.js";
import productRoutes from "../server/routes/productRoutes.js";
import orderRoutes from "../server/routes/orderRoutes.js";
import walletRoutes from "../server/routes/walletRoutes.js";
import adsRoutes from "../server/routes/adsRoutes.js";
import disputeRoutes from "../server/routes/disputeRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/disputes", disputeRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    marketplace: "CaymanBazaar Grand Cayman Multi-Vendor API (Serverless Vercel)",
    timestamp: new Date().toISOString()
  });
});

export default app;
