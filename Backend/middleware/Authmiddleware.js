const jwt  = require("jsonwebtoken");
const User = require("../models/User");

// ─────────────────────────────────────────────────
// Protect — verify JWT and attach user to request
// ─────────────────────────────────────────────────
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorised. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Not authorised. User no longer exists or is inactive.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("protect middleware error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Not authorised. Invalid or expired token.",
    });
  }
};

// ─────────────────────────────────────────────────
// authorise — restrict to specific roles
// Usage: authorise("admin")  or  authorise("admin","student")
// ─────────────────────────────────────────────────
const authorise = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(" or ")}.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorise };