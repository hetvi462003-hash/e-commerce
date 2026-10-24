import express from "express";
import Dispute from "../models/Dispute.js";
import Order from "../models/Order.js";

const router = express.Router();

// GET all disputes
router.get("/", async (req, res) => {
  try {
    const { status, vendor_id } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (vendor_id) filter.vendor_id = vendor_id;

    const disputes = await Dispute.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: disputes.length, data: disputes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST file a dispute
router.post("/", async (req, res) => {
  try {
    const count = await Dispute.countDocuments();
    const dispute_id = `DSP-${301 + count}`;

    const newDispute = new Dispute({
      ...req.body,
      dispute_id
    });

    const saved = await newDispute.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PATCH resolve dispute (Admin)
router.patch("/:id/resolve", async (req, res) => {
  try {
    const { status, resolution_notes } = req.body;
    const dispute = await Dispute.findOneAndUpdate(
      { dispute_id: req.params.id },
      {
        $set: {
          status,
          resolution_notes: resolution_notes || `Marked as ${status} by Platform Admin`
        }
      },
      { new: true }
    );
    if (!dispute) return res.status(404).json({ success: false, message: "Dispute not found" });

    // If refunded, mark order cancelled/refunded
    if (status === "Resolved - Refunded") {
      await Order.findOneAndUpdate({ order_id: dispute.order_id }, { $set: { status: "Cancelled" } });
    }

    res.json({ success: true, data: dispute });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
