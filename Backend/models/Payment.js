const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      default: null,
    },
    month: {
      type: String,
      required: true, // e.g. "2026-04"
    },
    amount: {
      type: Number,
      required: true,
    },
    // NEW: optional utilities/water/electricity levy shown on receipt
    utilityAmount: {
      type: Number,
      default: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Submitted", "Paid", "Rejected", "Overdue"],
      default: "Pending",
    },
    // Student's uploaded bank slip
    receipt: {
      type: String,
      default: "",
    },
    receiptFileName: {
      type: String,
      default: "",
    },
    paymentDate: {
      type: Date,
      default: null,
    },
    adminRemark: {
      type: String,
      default: "",
    },
    // Token used to build the bank-slip download URL
    downloadToken: {
      type: String,
      default: "",
    },
    // NEW: set when admin approves — used on the generated PDF receipt
    approvedAt: {
      type: Date,
      default: null,
    },

   lastReminderSentAt: {
      type: Date,
      default: null,
    },
    lastDueSoonReminderSentAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

paymentSchema.index({ student: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Payment", paymentSchema);