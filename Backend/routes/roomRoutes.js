const express = require("express");
const router = express.Router();

const { protect, authorise } = require("../middleware/Authmiddleware");
const upload = require("../middleware/upload");

const {
  createRoom,
  getRooms,
  deleteRoom,
  removeStudentFromRoom,
  getMyRoom,
} = require("../controllers/roomController");

// Admin create room
router.post(
  "/",
  protect,
  authorise("admin"),
  upload.array("images", 5),
  createRoom
);

router.get("/my-room", protect, authorise("student"), getMyRoom);


// Student view rooms
router.get("/",  getRooms);

// Admin delete
router.delete("/:id", protect, authorise("admin"), deleteRoom);

router.put(
  "/remove-student",
  protect,
  authorise("admin"),
  removeStudentFromRoom
);




module.exports = router;

