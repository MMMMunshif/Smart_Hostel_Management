const User        = require("../models/User");
const generateToken = require("../utils/generateToken");

// ─────────────────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, preferences } = req.body;

    // ── Validate required fields ──────────────────
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and role are required.",
      });
    }

    if (!["student", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be either 'student' or 'admin'.",
      });
    }

    // ── Check duplicate email ─────────────────────
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // ── Build user object ─────────────────────────
    const userData = { name, email, password, role };

    if (role === "student" && preferences) {
      userData.preferences = {
        sleep:       preferences.sleep       || "",
        cleanliness: preferences.cleanliness || 3,
        study:       preferences.study       || "",
        smoking:     preferences.smoking     || "",
        noise:       preferences.noise       || "",
      };
    }

    // ── Save user (password hashed via pre-save hook) ──
    const user = await User.create(userData);

    // ── Respond with token ────────────────────────
    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: {
        user,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (err) {
    console.error("registerUser error:", err);

    // Mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

// ─────────────────────────────────────────────────
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // ── Validate required fields ──────────────────
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // ── Find user ─────────────────────────────────
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // ── Check role matches (optional frontend guard) ──
    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `This account is registered as '${user.role}', not '${role}'.`,
      });
    }

    // ── Check if account is active ────────────────
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Contact support.",
      });
    }

    // ── Verify password ───────────────────────────
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // ── Respond with token ────────────────────────
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        user,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (err) {
    console.error("loginUser error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

// ─────────────────────────────────────────────────
// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
// ─────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    return res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    console.error("getMe error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { registerUser, loginUser, getMe };