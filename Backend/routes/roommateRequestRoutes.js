const express = require("express");
const router = express.Router();

const { protect, authorise } = require("../middleware/Authmiddleware");
const {
  createRoommateRequest,
  getMyRoommateRequests,
  updateRoommateRequestStatus,
  getAllRoommateRequests,
} = require("../controllers/roommateRequestController");

// student
router.post("/", protect, authorise("student"), createRoommateRequest);
router.get("/my", protect, authorise("student"), getMyRoommateRequests);
router.put("/:id", protect, authorise("student"), updateRoommateRequestStatus);

// admin
router.get("/", protect, authorise("admin"), getAllRoommateRequests);

module.exports = router;