const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

// helper
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ─────────────────────────────────────────────────
// @desc    Register a new user with OTP verification
// @route   POST /api/users/register
// @access  Public
// ─────────────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, preferences } = req.body;

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

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const otpCode = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const userData = {
      name,
      email,
      password,
      role,
      isVerified: false,
      otpCode,
      otpExpiresAt,
    };

    if (role === "student" && preferences) {
      userData.preferences = {
        sleep: preferences.sleep || "",
        cleanliness: preferences.cleanliness || 3,
        study: preferences.study || "",
        smoking: preferences.smoking || "",
        noise: preferences.noise || "",
      };
    }

    const user = await User.create(userData);

    await sendEmail({
      to: email,
      subject: "Verify your account - OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2>Email Verification</h2>
          <p>Hello ${name},</p>
          <p>Your verification OTP is:</p>
          <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; margin: 16px 0;">
            ${otpCode}
          </div>
          <p>This OTP will expire in 10 minutes.</p>
        </div>
      `,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully. OTP sent to email.",
      data: {
        email: user.email,
      },
    });
  } catch (err) {
    console.error("registerUser error:", err);

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
// @desc    Verify OTP
// @route   POST /api/users/verify-otp
// @access  Public
// ─────────────────────────────────────────────────
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const user = await User.findOne({ email }).select("+otpCode +otpExpiresAt");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.isVerified === true) {
      return res.status(400).json({
        success: false,
        message: "Account already verified.",
      });
    }

    if (!user.otpCode || user.otpCode !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    if (!user.otpExpiresAt || new Date(user.otpExpiresAt) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired.",
      });
    }

    user.isVerified = true;
    user.otpCode = "";
    user.otpExpiresAt = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (err) {
    console.error("verifyOtp error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

// ─────────────────────────────────────────────────
// @desc    Resend OTP
// @route   POST /api/users/resend-otp
// @access  Public
// ─────────────────────────────────────────────────
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ email }).select("+otpCode +otpExpiresAt");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.isVerified === true) {
      return res.status(400).json({
        success: false,
        message: "Account already verified.",
      });
    }

    const otpCode = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.otpCode = otpCode;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    await sendEmail({
      to: email,
      subject: "Resend OTP - Verify your account",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2>Email Verification</h2>
          <p>Hello ${user.name},</p>
          <p>Your new verification OTP is:</p>
          <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; margin: 16px 0;">
            ${otpCode}
          </div>
          <p>This OTP will expire in 10 minutes.</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully.",
    });
  } catch (err) {
    console.error("resendOtp error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

// ─────────────────────────────────────────────────
// @desc    Login user
// @route   POST /api/users/login
// @access  Public
// ─────────────────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `This account is registered as '${user.role}', not '${role}'.`,
      });
    }

    // keep your existing isActive rule if your model has it
    if (typeof user.isActive !== "undefined" && !user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Contact support.",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // IMPORTANT:
    // only newly registered users with isVerified === false are blocked
    // old users with undefined isVerified can still log in
    if (user.isVerified === false) {
      return res.status(403).json({
        success: false,
        message: "Email not verified. Please verify OTP first.",
        needsVerification: true,
        email: user.email,
      });
    }

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
// @route   GET /api/users/me
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

module.exports = {
  registerUser,
  loginUser,
  getMe,
  verifyOtp,
  resendOtp,
};