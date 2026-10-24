import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import adsRoutes from "./routes/adsRoutes.js";
import disputeRoutes from "./routes/disputeRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    marketplace: "CaymanBazaar Grand Cayman Multi-Vendor API",
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`[CaymanBazaar Server] Running on http://localhost:${PORT}`);
});
