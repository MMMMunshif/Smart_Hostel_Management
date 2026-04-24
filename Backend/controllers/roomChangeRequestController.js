const RoomChangeRequest = require("../models/RoomChangeRequest");
const Room = require("../models/Room");
const { createNotification } = require("./notificationController");

// STUDENT: create room change request
exports.createRoomChangeRequest = async (req, res) => {
  try {
    const { requestedRoom, reason } = req.body;

    if (!requestedRoom || !reason?.trim()) {
      return res.status(400).json({
        message: "Requested room and reason are required",
      });
    }

    const currentRoom = await Room.findOne({ occupants: req.user._id });

    if (!currentRoom) {
      return res.status(404).json({
        message: "You do not currently have an assigned room",
      });
    }

    if (currentRoom._id.toString() === requestedRoom) {
      return res.status(400).json({
        message: "Requested room must be different from your current room",
      });
    }

    const requestedRoomDoc = await Room.findById(requestedRoom);
    if (!requestedRoomDoc) {
      return res.status(404).json({ message: "Requested room not found" });
    }

    const existingPending = await RoomChangeRequest.findOne({
      student: req.user._id,
      status: "Pending",
    });

    if (existingPending) {
      return res.status(400).json({
        message: "You already have a pending room change request",
      });
    }

    const request = await RoomChangeRequest.create({
      student: req.user._id,
      currentRoom: currentRoom._id,
      requestedRoom,
      reason: reason.trim(),
    });

    const populated = await RoomChangeRequest.findById(request._id)
      .populate("student", "name email")
      .populate("currentRoom", "roomNumber wing type")
      .populate("requestedRoom", "roomNumber wing type");

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// STUDENT: get my room change requests
exports.getMyRoomChangeRequests = async (req, res) => {
  try {
    const requests = await RoomChangeRequest.find({ student: req.user._id })
      .populate("student", "name email")
      .populate("currentRoom", "roomNumber wing type")
      .populate("requestedRoom", "roomNumber wing type")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADMIN: get all room change requests
exports.getAllRoomChangeRequests = async (req, res) => {
  try {
    const requests = await RoomChangeRequest.find()
      .populate("student", "name email")
      .populate("currentRoom", "roomNumber wing type capacity occupants status")
      .populate("requestedRoom", "roomNumber wing type capacity occupants status")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADMIN: update room change request status
exports.updateRoomChangeRequestStatus = async (req, res) => {
  try {
    const { status, adminRemark } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await RoomChangeRequest.findById(req.params.id)
      .populate("student", "name email")
      .populate("currentRoom")
      .populate("requestedRoom");

    if (!request) {
      return res.status(404).json({ message: "Room change request not found" });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        message: "Only pending requests can be updated",
      });
    }

    request.status = status;
    request.adminRemark = adminRemark || "";

    if (status === "Approved") {
      const currentRoom = await Room.findById(request.currentRoom?._id);
      const requestedRoom = await Room.findById(request.requestedRoom?._id);

      if (!requestedRoom) {
        return res.status(404).json({ message: "Requested room not found" });
      }

      const requestedOccupants = Array.isArray(requestedRoom.occupants)
        ? requestedRoom.occupants.map((id) => id.toString())
        : [];

      const currentOccupants = currentRoom && Array.isArray(currentRoom.occupants)
        ? currentRoom.occupants.map((id) => id.toString())
        : [];

      const requestedCapacity = Number(requestedRoom.capacity || 0);

      if (
        !requestedOccupants.includes(request.student._id.toString()) &&
        requestedOccupants.length >= requestedCapacity
      ) {
        return res.status(400).json({
          message: "Requested room is already full",
        });
      }

      if (currentRoom) {
        currentRoom.occupants = currentRoom.occupants.filter(
          (id) => id.toString() !== request.student._id.toString()
        );

        currentRoom.status =
          currentRoom.occupants.length >= Number(currentRoom.capacity || 0)
            ? "Full"
            : "Available";

        await currentRoom.save();
      }

      if (!requestedOccupants.includes(request.student._id.toString())) {
        requestedRoom.occupants.push(request.student._id);
      }

      requestedRoom.status =
        requestedRoom.occupants.length >= Number(requestedRoom.capacity || 0)
          ? "Full"
          : "Available";

      await requestedRoom.save();

      await createNotification({
        user: request.student._id,
        title: "Room Change Approved",
        message: `Your request to move to room ${requestedRoom.roomNumber} was approved.`,
        type: "request",
        link: "/my-room",
      });
    }

    if (status === "Rejected") {
      await createNotification({
        user: request.student._id,
        title: "Room Change Rejected",
        message:
          adminRemark?.trim()
            ? `Your room change request was rejected. Reason: ${adminRemark}`
            : "Your room change request was rejected.",
        type: "request",
        link: "/room-change-requests",
      });
    }

    await request.save();

    const updated = await RoomChangeRequest.findById(request._id)
      .populate("student", "name email")
      .populate("currentRoom", "roomNumber wing type")
      .populate("requestedRoom", "roomNumber wing type");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};