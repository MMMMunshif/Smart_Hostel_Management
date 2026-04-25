const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const preferenceSchema = new mongoose.Schema({
  sleep:        { type: String, enum: ["early", "late", ""], default: "" },
  cleanliness:  { type: Number, min: 1, max: 5, default: 3 },
  study:        { type: String, enum: ["silent", "group", ""], default: "" },
  smoking:      { type: String, enum: ["yes", "no", ""], default: "" },
  noise:        { type: String, enum: ["low", "medium", "high", ""], default: "" },
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role:     { type: String, enum: ["student", "admin"], default: "student" },
    isVerified: {
  type: Boolean,
  default: undefined, // old users remain undefined, only new users will be false until verified
},
otpCode: {
  type: String,
  default: "",
  select: false,
},
otpExpiresAt: {
  type: Date,
  default: null,
  select: false,
},

    // Only used when role === "student"
    preferences: { type: preferenceSchema, default: () => ({}) },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ── Hash password before saving ──────────────────────────────
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ── Instance method: compare password ───────────────────────
userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

// ── Instance method: check email verification status ────────
userSchema.methods.isEmailVerified = function () {
  // Returns true if:
  // 1. User is old (isVerified is undefined) - backward compatibility
  // 2. User is new and has completed verification (isVerified === true)
  return this.isVerified === undefined || this.isVerified === true;
};

// ── Remove password from any JSON response ───────────────────
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};



module.exports = mongoose.model("User", userSchema);