import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "caymanbazaar_jwt_secret_key_2026_super_secure";

// POST Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, vendor_id } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "An account with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
      vendor_id: vendor_id || null
    });

    const savedUser = await newUser.save();
    const token = jwt.sign(
      { id: savedUser._id, role: savedUser.role, email: savedUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        vendor_id: savedUser.vendor_id
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check pre-configured admin demo login
    if (email === "admin@caymanbazaar.ky" && password === "admin123") {
      const token = jwt.sign(
        { id: "admin-platform", role: "admin", email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      return res.json({
        success: true,
        token,
        user: {
          id: "admin-platform",
          name: "Platform Administrator",
          email,
          role: "admin"
        }
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        vendor_id: user.vendor_id
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
