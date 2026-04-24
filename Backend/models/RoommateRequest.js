const mongoose = require("mongoose");

const roommateRequestSchema = new mongoose.Schema(
  {
    fromStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoommateRequest", roommateRequestSchema);