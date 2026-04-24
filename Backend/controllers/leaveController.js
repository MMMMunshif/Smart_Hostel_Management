const Leave = require("../models/Leave");
const Room = require("../models/Room");
const { createNotification } = require("./notificationController");

// STUDENT: Create leave request
exports.createLeave = async (req, res) => {
  try {
    const { reason, fromDate, toDate, leaveType = "temporary" } = req.body;

    if (!reason) {
      return res.status(400).json({ message: "Reason is required" });
    }

    if (!["temporary", "permanent"].includes(leaveType)) {
      return res.status(400).json({ message: "Invalid leave type" });
    }

    if (leaveType === "temporary") {
      if (!fromDate || !toDate) {
        return res.status(400).json({
          message: "fromDate and toDate are required for temporary leave",
        });
      }

      if (new Date(fromDate) > new Date(toDate)) {
        return res.status(400).json({
          message: "fromDate cannot be later than toDate",
        });
      }
    }

    const assignedRoom = await Room.findOne({
      occupants: req.user._id,
    });

    if (leaveType === "permanent" && !assignedRoom) {
      return res.status(400).json({
        message: "You do not have an assigned room to leave permanently",
      });
    }

    const existingPermanent = await Leave.findOne({
      student: req.user._id,
      leaveType: "permanent",
      status: "Pending",
    });

    if (leaveType === "permanent" && existingPermanent) {
      return res.status(400).json({
        message: "You already have a pending permanent room leave request",
      });
    }

    const leave = await Leave.create({
      student: req.user._id,
      room: assignedRoom ? assignedRoom._id : null,
      leaveType,
      reason,
      fromDate: leaveType === "temporary" ? fromDate : null,
      toDate: leaveType === "temporary" ? toDate : null,
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
    const { status, adminRemark = "" } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Approved or Rejected",
      });
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    if (leave.status !== "Pending") {
      return res.status(400).json({
        message: "This leave request is already processed",
      });
    }

    leave.status = status;
    leave.adminRemark = adminRemark;

    if (status === "Approved" && leave.leaveType === "permanent" && leave.room) {
      await Room.findByIdAndUpdate(leave.room, {
        $pull: { occupants: leave.student },
      });
    }

    await leave.save();

    const notificationMessage =
      leave.leaveType === "permanent"
        ? `Your permanent room leave request was ${status}.`
        : `Your leave request from ${new Date(leave.fromDate).toLocaleDateString()} to ${new Date(
            leave.toDate
          ).toLocaleDateString()} was ${status}.`;

    await createNotification({
      user: leave.student,
      title:
        leave.leaveType === "permanent"
          ? "Permanent Room Leave Updated"
          : "Leave Request Updated",
      message: notificationMessage,
      type: "leave",
      link: "/leaves",
    });

    const updatedLeave = await Leave.findById(leave._id)
      .populate("student", "name email")
      .populate("room", "roomNumber location district");

    res.json(updatedLeave);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};