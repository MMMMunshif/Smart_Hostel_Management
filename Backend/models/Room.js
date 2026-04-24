const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      trim: true,
    },

    // Sri Lanka-style location info
    location: {
      type: String,
      required: true,
      trim: true,
    },

    district: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["Single", "Double", "Quad"],
      required: true,
    },

    genderCategory: {
      type: String,
      enum: ["Boys", "Girls", "Mixed"],
      required: true,
      default: "Mixed",
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    occupants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Use LKR values in frontend
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    amenities: [
      {
        type: String,
        trim: true,
      },
    ],

    images: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: ["Available", "Full", "Maintenance"],
      default: "Available",
    },

    distanceToCampus: {
      type: String,
      default: "",
      trim: true,
    },

    availableFrom: {
      type: Date,
      default: null,
    },

    mealIncluded: {
      type: Boolean,
      default: false,
    },

    wifiAvailable: {
      type: Boolean,
      default: false,
    },

    parkingAvailable: {
      type: Boolean,
      default: false,
    },

    securityAvailable: {
      type: Boolean,
      default: false,
    },

    bathroomType: {
      type: String,
      enum: ["Attached", "Shared", ""],
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);