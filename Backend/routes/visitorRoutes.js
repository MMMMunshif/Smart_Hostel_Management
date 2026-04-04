const express = require("express");
const router = express.Router();

const { protect, authorise } = require("../middleware/Authmiddleware");

const {
  createVisitor,
  getMyVisitors,
  getAllVisitors,
  updateVisitorStatus,
} = require("../controllers/visitorController");

/* ================= STUDENT ================= */

// Create visitor request
router.post("/", protect, authorise("student"), createVisitor);

// Get my visitor requests
router.get("/my", protect, authorise("student"), getMyVisitors);

/* ================= ADMIN ================= */

// Get all visitors
router.get("/", protect, authorise("admin"), getAllVisitors);

// Approve / Reject
router.put("/:id", protect, authorise("admin"), updateVisitorStatus);

module.exports = router;