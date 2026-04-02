const RoomRequest = require("../models/RoomRequest");
const Room = require("../models/Room");

// CREATE REQUEST (STUDENT)
exports.createRequest = async (req, res) => {
  try {
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({ message: "Room ID is required" });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // prevent requesting maintenance/full room
    if (room.status === "Maintenance") {
      return res.status(400).json({ message: "Room is under maintenance" });
    }

    if (room.occupants.length >= room.capacity || room.status === "Full") {
      return res.status(400).json({ message: "Room is already full" });
    }

    // prevent duplicate pending request for same room
    const existingSameRoomPending = await RoomRequest.findOne({
      student: req.user._id,
      room: roomId,
      status: "pending",
    });

    if (existingSameRoomPending) {
      return res.status(400).json({ message: "You already requested this room" });
    }

    // prevent multiple pending requests
    const existingPending = await RoomRequest.findOne({
      student: req.user._id,
      status: "pending",
    });

    if (existingPending) {
      return res.status(400).json({ message: "You already have a pending request" });
    }

    // prevent requesting if already assigned to a room
    const alreadyAssigned = await Room.findOne({
      occupants: req.user._id,
    });

    if (alreadyAssigned) {
      return res.status(400).json({ message: "You already have an assigned room" });
    }

    const request = await RoomRequest.create({
      student: req.user._id,
      room: roomId,
      status: "pending",
    });

    const populatedRequest = await RoomRequest.findById(request._id)
      .populate("student", "name email")
      .populate("room", "roomNumber wing type");

    res.status(201).json(populatedRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL REQUESTS (ADMIN)
exports.getRequests = async (req, res) => {
  try {
    const requests = await RoomRequest.find()
      .populate("student", "name email")
      .populate("room", "roomNumber wing type capacity status")
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

    if (request.status !== "pending") {
      return res.status(400).json({ message: "This request is already processed" });
    }

    const room = await Room.findById(request.room);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // prevent overfill
    if (room.occupants.length >= room.capacity || room.status === "Full") {
      room.status = "Full";
      await room.save();
      return res.status(400).json({ message: "Room is already full" });
    }

    // prevent duplicate occupant
    const alreadyInside = room.occupants.some(
      (studentId) => studentId.toString() === request.student.toString()
    );

    if (!alreadyInside) {
      room.occupants.push(request.student);
    }

    // update room status
    if (room.occupants.length >= room.capacity) {
      room.status = "Full";
    } else {
      room.status = "Available";
    }

    await room.save();

    // approve selected request
    request.status = "approved";
    await request.save();

    // reject all other pending requests of same student
    await RoomRequest.updateMany(
      {
        student: request.student,
        _id: { $ne: request._id },
        status: "pending",
      },
      { $set: { status: "rejected" } }
    );

    res.json({ message: "Request approved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// REJECT REQUEST
exports.rejectRequest = async (req, res) => {
  try {
    const request = await RoomRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "This request is already processed" });
    }

    request.status = "rejected";
    await request.save();

    res.json({ message: "Request rejected successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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