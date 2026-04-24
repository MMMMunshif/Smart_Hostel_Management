const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["General", "Maintenance", "Fee", "Policy", "Emergency", "Event"],
      default: "General",
    },

    audience: {
      type: String,
      enum: ["all", "students", "admins"],
      default: "students",
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notice", noticeSchema);