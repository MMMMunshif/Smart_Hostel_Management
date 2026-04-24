const express = require("express");
const router = express.Router();

const { protect, authorise } = require("../middleware/Authmiddleware");

const {
  createLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} = require("../controllers/leaveController");

/* ================= STUDENT ROUTES ================= */

// Create leave request
router.post("/", protect, authorise("student"), createLeave);

// Get my leave requests
router.get("/my", protect, authorise("student"), getMyLeaves);

/* ================= ADMIN ROUTES ================= */

// Get all leave requests
router.get("/", protect, authorise("admin"), getAllLeaves);

// Update leave status
router.put("/:id", protect, authorise("admin"), updateLeaveStatus);

module.exports = router;