const express = require("express");
const router = express.Router();

const { protect, authorise } = require("../middleware/Authmiddleware");

const {
  createNotice,
  getAllNotices,
  getMyNotices,
  updateNotice,
  deleteNotice,
} = require("../controllers/noticeController");

// ─────────────────────────────
// ADMIN ROUTES
// ─────────────────────────────

// Create notice
router.post("/", protect, authorise("admin"), createNotice);

// Get all notices (admin view)
router.get("/admin", protect, authorise("admin"), getAllNotices);

// Update notice
router.put("/:id", protect, authorise("admin"), updateNotice);

// Delete notice
router.delete("/:id", protect, authorise("admin"), deleteNotice);

// ─────────────────────────────
// STUDENT + ADMIN
// ─────────────────────────────

// Get notices for logged user
router.get("/", protect, getMyNotices);

module.exports = router;