const express = require("express");
const router = express.Router();

const { protect, authorise } = require("../middleware/Authmiddleware");
const {
  createRoomChangeRequest,
  getMyRoomChangeRequests,
  getAllRoomChangeRequests,
  updateRoomChangeRequestStatus,
} = require("../controllers/roomChangeRequestController");

// student
router.post("/", protect, authorise("student"), createRoomChangeRequest);
router.get("/my", protect, authorise("student"), getMyRoomChangeRequests);

// admin
router.get("/", protect, authorise("admin"), getAllRoomChangeRequests);
router.put("/:id", protect, authorise("admin"), updateRoomChangeRequestStatus);

module.exports = router;