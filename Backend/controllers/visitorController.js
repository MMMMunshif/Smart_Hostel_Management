const Visitor = require("../models/Visitor");
const Room = require("../models/Room");
const Leave = require("../models/Leave");
const { createNotification } = require("./notificationController");

const ACTIVE_LEAVE_STATUSES = ["Pending", "Approved"];

const normalizeDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
};

/* CREATE VISITOR REQUEST (STUDENT) */
exports.createVisitor = async (req, res) => {
  try {
    const {
      roomId,
      visitorName,
      visitorNIC,
      visitorPhone,
      relation,
      purpose,
      visitDate,
      inTime,
      outTime,
    } = req.body;

    if (
      !roomId ||
      !visitorName ||
      !visitorNIC ||
      !visitorPhone ||
      !relation ||
      !purpose ||
      !visitDate ||
      !inTime ||
      !outTime
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const visitDateObj = normalizeDate(visitDate);
    if (!visitDateObj) {
      return res.status(400).json({ message: "Invalid visit date" });
    }

    if (inTime >= outTime) {
      return res.status(400).json({
        message: "Check-out time must be after check-in time",
      });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Special feature: block visitor requests that clash with active leave requests.
    const blockingLeave = await Leave.findOne({
      student: req.user._id,
      status: { $in: ACTIVE_LEAVE_STATUSES },
      $or: [
        {
          leaveType: "Permanent",
          fromDate: { $lte: visitDateObj },
        },
        {
          leaveType: { $ne: "Permanent" },
          fromDate: { $lte: visitDateObj },
          toDate: { $gte: visitDateObj },
        },
      ],
    });

    if (blockingLeave) {
      return res.status(409).json({
        message:
          "You already have an active leave during this date, so a visitor request cannot be submitted.",
      });
    }

    const visitor = await Visitor.create({
      student: req.user._id,
      room: roomId,
      visitorName,
      visitorNIC,
      visitorPhone,
      relation,
      purpose,
      visitDate: visitDateObj,
      inTime,
      outTime,
    });

    res.status(201).json(visitor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* GET MY VISITORS (STUDENT) */
exports.getMyVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find({ student: req.user._id })
      .populate("room", "roomNumber wing")
      .sort({ createdAt: -1 });

    res.json(visitors);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* GET ALL VISITORS (ADMIN) */
exports.getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find()
      .populate("student", "name email")
      .populate("room", "roomNumber wing")
      .sort({ createdAt: -1 });

    res.json(visitors);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* UPDATE STATUS (ADMIN) */
exports.updateVisitorStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    visitor.status = status;
    await visitor.save();

    await createNotification({
      user: visitor.student,
      title: "Visitor Request Updated",
      message: `Your visitor request for ${visitor.visitorName} was ${status}.`,
      type: "visitor",
      link: "/visitors",
    });

    res.json({ message: `Visitor ${status}` });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
