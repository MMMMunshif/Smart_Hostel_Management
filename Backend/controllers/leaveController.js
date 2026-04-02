const Leave = require("../models/Leave");
const Room = require("../models/Room");

// STUDENT: Create leave request
exports.createLeave = async (req, res) => {
  try {
    const { reason, fromDate, toDate } = req.body;

    if (!reason || !fromDate || !toDate) {
      return res.status(400).json({
        message: "Reason, fromDate, and toDate are required",
      });
    }

    if (new Date(fromDate) > new Date(toDate)) {
      return res.status(400).json({
        message: "fromDate cannot be later than toDate",
      });
    }

    const assignedRoom = await Room.findOne({
      occupants: req.user._id,
    });

    const leave = await Leave.create({
      student: req.user._id,
      room: assignedRoom ? assignedRoom._id : null,
      reason,
      fromDate,
      toDate,
    });

    const populatedLeave = await Leave.findById(leave._id)
      .populate("student", "name email")
      .populate("room", "roomNumber location district");

    res.status(201).json(populatedLeave);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// STUDENT: Get my leave requests
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ student: req.user._id })
      .populate("student", "name email")
      .populate("room", "roomNumber location district")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADMIN: Get all leave requests
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("student", "name email")
      .populate("room", "roomNumber location district")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADMIN: Update leave status
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    leave.status = status;
    await leave.save();

    const updatedLeave = await Leave.findById(leave._id)
      .populate("student", "name email")
      .populate("room", "roomNumber location district");

    res.json(updatedLeave);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};