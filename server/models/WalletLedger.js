import mongoose from "mongoose";

const walletLedgerSchema = new mongoose.Schema(
  {
    ledger_id: { type: String, required: true, unique: true },
    vendor_id: { type: String, required: true },
    type: {
      type: String,
      enum: ["DEPOSIT", "COMMISSION_DEDUCTION", "REFUND", "ADJUSTMENT"],
      required: true
    },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    order_id: { type: String, default: null }
  },
  { timestamps: true }
);

const WalletLedger = mongoose.model("WalletLedger", walletLedgerSchema);
export default WalletLedger;
