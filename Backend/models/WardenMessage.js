const mongoose = require("mongoose");

const wardenMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverRole: {
      type: String,
      enum: ["student", "admin"],
      required: true,
    },
    text: {
      type: String,
      trim: true,
      default: "",
    },
    conversationId: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "voice"],
      default: "text",
    },
    fileUrl: {
      type: String,
      default: "",
    },
    fileName: {
      type: String,
      default: "",
    },
    voiceUrl: {
      type: String,
      default: "",
    },
    duration: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WardenMessage", wardenMessageSchema);