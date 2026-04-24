const express = require("express");
const router = express.Router();
const { protect, authorise } = require("../middleware/Authmiddleware");
const { getMatches } = require("../controllers/matchController");

// logged-in student gets own matches
router.get("/me", protect, authorise("student"), getMatches);

// optional: admin or direct by id if you still want it
router.get("/:id", protect, getMatches);

module.exports = router;