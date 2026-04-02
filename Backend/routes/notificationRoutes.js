const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/Authmiddleware");
const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

// Get latest notifications
router.get("/", protect, getMyNotifications);

// Get unread count
router.get("/unread-count", protect, getUnreadCount);

// Mark one as read
router.put("/:id/read", protect, markAsRead);

// Mark all as read
router.put("/read-all", protect, markAllAsRead);

module.exports = router;