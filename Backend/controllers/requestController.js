const RoomRequest = require("../models/RoomRequest");
const Room = require("../models/Room");
const { createNotification } = require("./notificationController");

// CREATE REQUEST (STUDENT)
exports.createRequest = async (req, res) => {
  try {
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({ message: "roomId is required" });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const existingPending = await RoomRequest.findOne({
      student: req.user._id,
      room: roomId,
      status: "pending",
    });

    if (existingPending) {
      return res.status(400).json({ message: "You already requested this room" });
    }

    const request = await RoomRequest.create({
      student: req.user._id,
      room: roomId,
    });

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET MY REQUESTS (STUDENT)
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await RoomRequest.find({ student: req.user._id })
      .populate("student", "name email")
      .populate("room")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL REQUESTS (ADMIN)
exports.getRequests = async (req, res) => {
  try {
    const requests = await RoomRequest.find()
      .populate("student", "name email")
      .populate("room")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// APPROVE REQUEST
exports.approveRequest = async (req, res) => {
  try {
    const request = await RoomRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const room = await Room.findById(request.room);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    request.status = "approved";
    await request.save();

    const alreadyInside = room.occupants.some(
      (id) => id.toString() === request.student.toString()
    );

    if (!alreadyInside) {
      room.occupants.push(request.student);
    }

    if (room.occupants.length >= room.capacity) {
      room.status = "Full";
    } else {
      room.status = "Available";
    }

    await room.save();

    await createNotification({
      user: request.student,
      title: "Room Request Approved",
      message: `Your room request for ${room.roomNumber} was approved.`,
      type: "request",
      link: "/requests",
    });

    res.json({ message: "Approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// REJECT REQUEST
exports.rejectRequest = async (req, res) => {
  try {
    const request = await RoomRequest.findById(req.params.id).populate("room");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "rejected";
    await request.save();

    await createNotification({
      user: request.student,
      title: "Room Request Rejected",
      message: `Your room request for ${request.room?.roomNumber || "the selected room"} was rejected.`,
      type: "request",
      link: "/requests",
    });

    res.json({ message: "Rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};