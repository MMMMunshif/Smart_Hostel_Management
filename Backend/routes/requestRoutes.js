const express = require("express");
const router = express.Router();

const { protect, authorise } = require("../middleware/Authmiddleware");

const {
  createRequest,
  getRequests,
  getMyRequests,
  approveRequest,
  rejectRequest,
} = require("../controllers/requestController");

// student creates request
router.post("/", protect, authorise("student"), createRequest);

// student gets only own requests
router.get("/my", protect, authorise("student"), getMyRequests);

// admin gets all requests
router.get("/", protect, authorise("admin"), getRequests);

// admin approve
router.put("/:id/approve", protect, authorise("admin"), approveRequest);

// admin reject
router.put("/:id/reject", protect, authorise("admin"), rejectRequest);

module.exports = router;