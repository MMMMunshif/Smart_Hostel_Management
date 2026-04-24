const Complaint = require("../models/Complaint");
const Room = require("../models/Room");
const { createNotification } = require("./notificationController");

// STUDENT: Create complaint
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const assignedRoom = await Room.findOne({
      occupants: req.user._id,
    });

    const complaint = await Complaint.create({
      student: req.user._id,
      room: assignedRoom ? assignedRoom._id : null,
      title,
      description,
      category,
      priority,
      image: req.file ? req.file.path : "",
    });

    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate("student", "name email")
      .populate("room", "roomNumber location district");

    res.status(201).json(populatedComplaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// STUDENT: Get my complaints
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ student: req.user._id })
      .populate("student", "name email")
      .populate("room", "roomNumber location district")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADMIN: Get all complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("student", "name email")
      .populate("room", "roomNumber location district")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADMIN: Update complaint status
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const complaint = await Complaint.findById(req.params.id).populate("room");

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    complaint.status = status;
    await complaint.save();

    await createNotification({
      user: complaint.student,
      title: "Complaint Status Updated",
      message: `Your complaint "${complaint.title}" is now ${status}.`,
      type: "complaint",
      link: "/complaints",
    });

    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate("student", "name email")
      .populate("room", "roomNumber location district");

    res.json(updatedComplaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};