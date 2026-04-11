const express = require("express");
const router = express.Router();

const { protect, authorise } = require("../middleware/Authmiddleware");
const upload = require("../middleware/upload");

const {
  getStudentMessages,
  getAdminConversations,
  getAdminConversationMessages,
  sendMessage,
  sendAttachmentMessage,
  markConversationAsRead,
} = require("../controllers/wardenMessageController");

// student
router.get("/student", protect, authorise("student"), getStudentMessages);

// admin
router.get(
  "/admin/conversations",
  protect,
  authorise("admin"),
  getAdminConversations
);

router.get(
  "/admin/conversations/:conversationId",
  protect,
  authorise("admin"),
  getAdminConversationMessages
);

// both
router.post("/", protect, sendMessage);
router.post("/upload", protect, upload.single("file"), sendAttachmentMessage);
router.put("/read/:conversationId", protect, markConversationAsRead);

module.exports = router;