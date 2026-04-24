const Room = require("../models/Room");

// CREATE ROOM (ADMIN)
exports.createRoom = async (req, res) => {
  try {
    const images = req.files.map(file => file.path);

    const room = await Room.create({
      ...req.body,
      images,
    });

    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL ROOMS (STUDENT)
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("occupants", "name");

    // 🔥 VERY IMPORTANT (disable cache)
    res.set("Cache-Control", "no-store");

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE ROOM
exports.deleteRoom = async (req, res) => {
  await Room.findByIdAndDelete(req.params.id);
  res.json({ message: "Room deleted" });
};

exports.removeStudentFromRoom = async (req, res) => {
  try {
    const { studentId, roomId } = req.body;

    if (!studentId || !roomId) {
      return res.status(400).json({ message: "studentId and roomId are required" });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    room.occupants = room.occupants.filter(
      (id) => id.toString() !== studentId.toString()
    );

    if (room.status === "Full" && room.occupants.length < room.capacity) {
      room.status = "Available";
    }

    await room.save();

    res.json({ message: "Student removed from room successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET MY ROOM (STUDENT)
exports.getMyRoom = async (req, res) => {
  try {
    const room = await Room.findOne({
      occupants: req.user._id,
    }).populate("occupants", "name email");

    if (!room) {
      return res.status(404).json({ message: "No room assigned yet" });
    }

    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
