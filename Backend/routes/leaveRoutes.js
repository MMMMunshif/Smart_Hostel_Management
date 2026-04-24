const express = require("express");
const router = express.Router();

const { protect, authorise } = require("../middleware/Authmiddleware");

const {
  createLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} = require("../controllers/leaveController");

router.post("/", protect, authorise("student"), createLeave);
router.get("/my", protect, authorise("student"), getMyLeaves);

router.get("/", protect, authorise("admin"), getAllLeaves);
router.put("/:id", protect, authorise("admin"), updateLeaveStatus);

module.exports = router;