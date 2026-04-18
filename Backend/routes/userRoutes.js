const express        = require("express");
const router         = express.Router();
const User           = require("../models/User");
const generateToken  = require("../utils/generateToken");

const { protect, authorise } = require("../middleware/Authmiddleware");


// POST /api/users/register
router.post("/register", async (req, res) => {
  try {
    console.log("REGISTER HIT:", req.body); // ✅ ADD THIS LINE

    const { name, email, password, role, preferences } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ error: "All fields are required." });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ error: "Email already registered." });

    const user = new User({
      name,
      email,
      password,
      role,
      ...(role === "student" && preferences ? { preferences } : {})
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id, user.role),
      user,
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err); // ✅ also helpful
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/login
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password required." });

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(401).json({ error: "Invalid email or password." });

    if (role && user.role !== role)
      return res.status(403).json({ error: `Account is registered as '${user.role}'.` });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password." });

    res.json({
      message: "Login successful",
      token: generateToken(user._id, user.role),
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", protect, authorise("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET /api/users/me  (protected)
router.get("/me", require("../middleware/Authmiddleware").protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ user });
});

// PUT /api/users/me
router.put("/me", require("../middleware/Authmiddleware").protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const {
      name,
      email,
      password,
      preferences,
    } = req.body;

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