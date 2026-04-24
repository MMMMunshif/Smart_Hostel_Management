const Leave = require("../models/Leave");
const Room = require("../models/Room");
const { createNotification } = require("./notificationController");

const VALID_LEAVE_TYPES = ["Temporary", "Permanent"];
const VALID_ADMIN_STATUSES = ["Approved", "Rejected"];
const ACTIVE_STATUSES = ["Pending", "Approved"];

const normalizeDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
};

const formatLeaveWindow = (leave) => {
  const leaveType = leave.leaveType || "Temporary";
  const from = new Date(leave.fromDate).toLocaleDateString();
  if (leaveType === "Permanent") {
    return `starting ${from} (permanent)`;
  }

  const to = leave.toDate ? new Date(leave.toDate).toLocaleDateString() : "N/A";
  return `from ${from} to ${to}`;
};

// STUDENT: Create leave request
exports.createLeave = async (req, res) => {
  try {
    const { reason, fromDate, toDate, leaveType = "Temporary" } = req.body;

    if (!reason || !fromDate) {
      return res.status(400).json({
        message: "Reason and fromDate are required",
      });
    }

    if (!VALID_LEAVE_TYPES.includes(leaveType)) {
      return res.status(400).json({
        message: "Invalid leaveType. Use Temporary or Permanent.",
      });
    }

    const fromDateObj = normalizeDate(fromDate);
    if (!fromDateObj) {
      return res.status(400).json({ message: "Invalid fromDate" });
    }

    let toDateObj = null;
    if (leaveType === "Temporary") {
      if (!toDate) {
        return res.status(400).json({
          message: "toDate is required for temporary leave",
        });
      }

      toDateObj = normalizeDate(toDate);
      if (!toDateObj) {
        return res.status(400).json({ message: "Invalid toDate" });
      }

      if (fromDateObj > toDateObj) {
        return res.status(400).json({
          message: "fromDate cannot be later than toDate",
        });
      }
    }

    const conflictQuery =
      leaveType === "Permanent"
        ? {
            student: req.user._id,
            status: { $in: ACTIVE_STATUSES },
            $or: [
              { leaveType: "Permanent" },
              {
                leaveType: { $ne: "Permanent" },
                toDate: { $gte: fromDateObj },
              },
            ],
          }
        : {
            student: req.user._id,
            status: { $in: ACTIVE_STATUSES },
            $or: [
              {
                leaveType: "Permanent",
                fromDate: { $lte: toDateObj },
              },
              {
                leaveType: { $ne: "Permanent" },
                fromDate: { $lte: toDateObj },
                toDate: { $gte: fromDateObj },
              },
            ],
          };

    const conflictingLeave = await Leave.findOne(conflictQuery);
    if (conflictingLeave) {
      return res.status(409).json({
        message:
          "You already have a pending/approved leave in the same period. Please update or wait for that request.",
      });
    }

    const assignedRoom = await Room.findOne({ occupants: req.user._id });

    const leave = await Leave.create({
      student: req.user._id,
      room: assignedRoom ? assignedRoom._id : null,
      reason: reason.trim(),
      leaveType,
      fromDate: fromDateObj,
      toDate: leaveType === "Temporary" ? toDateObj : null,
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

    if (!VALID_ADMIN_STATUSES.includes(status)) {
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

    leave.status = status;
    await leave.save();

    // Special feature: once permanent leave is approved, free the student's room automatically.
    if (status === "Approved" && leave.leaveType === "Permanent") {
      const room = await Room.findOne({ occupants: leave.student });
      if (room) {
        room.occupants = room.occupants.filter(
          (id) => id.toString() !== leave.student.toString()
        );

        if (room.status === "Full" && room.occupants.length < room.capacity) {
          room.status = "Available";
        }

        await room.save();

        leave.room = null;
        await leave.save();
      }
    }

    const leaveType = leave.leaveType || "Temporary";
    await createNotification({
      user: leave.student,
      title: "Leave Request Updated",
      message: `Your ${leaveType.toLowerCase()} leave request ${formatLeaveWindow(
        leave
      )} was ${status}.`,
      type: "leave",
      link: "/leave",
    });

    const updatedLeave = await Leave.findById(leave._id)
      .populate("student", "name email")
      .populate("room", "roomNumber location district");

    res.json(updatedLeave);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
