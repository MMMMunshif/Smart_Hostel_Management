const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

// In-memory login attempt tracking (for production, use Redis or database)
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// helpers
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Check if account is locked due to failed attempts
const isAccountLocked = (email) => {
  const attempts = loginAttempts.get(email);
  if (!attempts) return false;
  
  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    const lockedTime = attempts.lastAttempt;
    const now = Date.now();
    
    if (now - lockedTime < LOCKOUT_DURATION) {
      return true;
    } else {
      // Reset after lockout duration
      loginAttempts.delete(email);
      return false;
    }
  }
  return false;
};

// Record failed login attempt
const recordFailedAttempt = (email) => {
  const current = loginAttempts.get(email) || { count: 0, lastAttempt: Date.now() };
  current.count += 1;
  current.lastAttempt = Date.now();
  loginAttempts.set(email, current);
};

// Reset login attempts on successful login
const resetLoginAttempts = (email) => {
  loginAttempts.delete(email);
};

// Password strength validation
const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);

  if (password.length < minLength) {
    return { valid: false, message: "Password must be at least 8 characters long." };
  }
  if (!hasUpperCase) {
    return { valid: false, message: "Password must contain at least one uppercase letter." };
  }
  if (!hasLowerCase) {
    return { valid: false, message: "Password must contain at least one lowercase letter." };
  }
  if (!hasNumbers) {
    return { valid: false, message: "Password must contain at least one number." };
  }
  if (!hasSpecialChar) {
    return { valid: false, message: "Password must contain at least one special character (!@#$%^&*)." };
  }

  return { valid: true, message: "Password is strong." };
};

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

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message,
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

    // Check if account is locked due to too many failed attempts
    if (isAccountLocked(email)) {
      console.warn(`[SECURITY] Login attempt on locked account: ${email}`);
      return res.status(429).json({
        success: false,
        message: "Account temporarily locked due to too many failed login attempts. Try again later.",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      recordFailedAttempt(email);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (role && user.role !== role) {
      recordFailedAttempt(email);
      return res.status(403).json({
        success: false,
        message: `This account is registered as '${user.role}', not '${role}'.`,
      });
    }

    // keep your existing isActive rule if your model has it
    if (typeof user.isActive !== "undefined" && !user.isActive) {
      recordFailedAttempt(email);
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Contact support.",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      recordFailedAttempt(email);
      const attempts = loginAttempts.get(email);
      const remainingAttempts = MAX_LOGIN_ATTEMPTS - attempts.count;
      console.warn(`[SECURITY] Failed login attempt for ${email}. Attempts: ${attempts.count}/${MAX_LOGIN_ATTEMPTS}`);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        attemptWarning: remainingAttempts > 0 ? `${remainingAttempts} attempts remaining` : "Account will be locked",
      });
    }

    // IMPORTANT:
    // only newly registered users with isVerified === false are blocked
    // old users with undefined isVerified can still log in
    if (user.isVerified === false) {
      recordFailedAttempt(email);
      return res.status(403).json({
        success: false,
        message: "Email not verified. Please verify OTP first.",
        needsVerification: true,
        email: user.email,
      });
    }

    // Reset login attempts on successful login
    resetLoginAttempts(email);
    console.log(`[SECURITY] Successful login for user: ${email}`);

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

// ─────────────────────────────────────────────────
// @desc    Refresh authentication token
// @route   POST /api/users/refresh-token
// @access  Private
// ─────────────────────────────────────────────────
const refreshToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated.",
      });
    }

    const newToken = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully.",
      data: {
        token: newToken,
      },
    });
  } catch (err) {
    console.error("refreshToken error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  verifyOtp,
  resendOtp,
  refreshToken,
};