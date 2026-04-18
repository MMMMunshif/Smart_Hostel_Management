const Visitor = require("../models/Visitor");
const Room = require("../models/Room");
const { createNotification } = require("./notificationController");

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

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const visitor = await Visitor.create({
      student: req.user._id,
      room: roomId,
      visitorName,
      visitorNIC,
      visitorPhone,
      relation,
      purpose,
      visitDate,
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