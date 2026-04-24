const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
  verifyOtp,
  resendOtp,
} = require("../controllers/Authcontroller");

const { protect, authorise } = require("../middleware/Authmiddleware");
const User = require("../models/User");

// auth
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

// admin list users
router.get("/", protect, authorise("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// current logged-in user
router.get("/me", protect, getMe);

// update current user
router.put("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const { name, email, password, preferences } = req.body;

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;

    if (password) {
      user.password = password;
    }

    if (user.role === "student" && preferences) {
      user.preferences = {
        ...user.preferences?.toObject?.(),
        ...user.preferences,
        ...preferences,
      };
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;