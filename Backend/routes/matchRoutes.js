const express = require("express");
const router = express.Router();
const { getMatches } = require("../controllers/matchController");

// GET matches for a user
router.get("/:id", getMatches);

module.exports = router;