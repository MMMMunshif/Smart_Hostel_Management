const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
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

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    leaveType: {
      type: String,
      enum: ["Temporary", "Permanent"],
      default: "Temporary",
      required: true,
    },

    fromDate: {
      type: Date,
      required: true,
    },

    toDate: {
      type: Date,
      default: null,
      required: function requiredToDate() {
        return this.leaveType === "Temporary";
      },
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

leaveSchema.index({
  student: 1,
  status: 1,
  leaveType: 1,
  fromDate: 1,
  toDate: 1,
});

module.exports = mongoose.model("Leave", leaveSchema);
