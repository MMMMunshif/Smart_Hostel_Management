const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    // Student who requested
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Room reference
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    // Visitor details
    visitorName: {
      type: String,
      required: true,
      trim: true,
    },

    visitorNIC: {
      type: String,
      required: true,
      trim: true,
    },

    visitorPhone: {
      type: String,
      required: true,
    },

    relation: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      required: true,
    },

    // Visit timing
    visitDate: {
      type: Date,
      required: true,
    },

    inTime: {
      type: String,
      required: true,
    },

    outTime: {
      type: String,
      required: true,
    },

    // Status
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", visitorSchema);