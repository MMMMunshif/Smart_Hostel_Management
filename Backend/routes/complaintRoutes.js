const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const { protect, authorise } = require("../middleware/Authmiddleware");

const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
} = require("../controllers/complaintController");

/* ================= STUDENT ROUTES ================= */

// Create complaint
router.post("/", protect, authorise("student"), upload.single("image"), createComplaint);

// Get my complaints
router.get("/my", protect, authorise("student"), getMyComplaints);

/* ================= ADMIN ROUTES ================= */

// Get all complaints
router.get("/", protect, authorise("admin"), getAllComplaints);

// Update status (Pending → In Progress → Resolved)
router.put("/:id", protect, authorise("admin"), updateComplaintStatus);

module.exports = router;