const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    room:    { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoomRequest", requestSchema);