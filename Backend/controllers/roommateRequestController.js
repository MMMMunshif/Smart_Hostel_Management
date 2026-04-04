const RoommateRequest = require("../models/RoommateRequest");
const { createNotification } = require("./notificationController");

// STUDENT: send roommate request
exports.createRoommateRequest = async (req, res) => {
  try {
    const { toStudent, message } = req.body;

    if (!toStudent) {
      return res.status(400).json({ message: "toStudent is required" });
    }

    if (req.user._id.toString() === toStudent) {
      return res.status(400).json({ message: "You cannot send request to yourself" });
    }

    const existing = await RoommateRequest.findOne({
      fromStudent: req.user._id,
      toStudent,
      status: "Pending",
    });

    if (existing) {
      return res.status(400).json({ message: "Roommate request already sent" });
    }

    const reversePending = await RoommateRequest.findOne({
      fromStudent: toStudent,
      toStudent: req.user._id,
      status: "Pending",
    });

    if (reversePending) {
      return res.status(400).json({
        message: "This student has already sent you a request. Check incoming requests.",
      });
    }

    const request = await RoommateRequest.create({
      fromStudent: req.user._id,
      toStudent,
      message: message || "",
    });

    await createNotification({
      user: toStudent,
      title: "New Roommate Request",
      message: "You received a new roommate request.",
      type: "request",
      link: "/roommate-requests",
    });

    const populated = await RoommateRequest.findById(request._id)
      .populate("fromStudent", "name email")
      .populate("toStudent", "name email");

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// STUDENT: get my roommate requests
exports.getMyRoommateRequests = async (req, res) => {
  try {
    const incoming = await RoommateRequest.find({ toStudent: req.user._id })
      .populate("fromStudent", "name email")
      .populate("toStudent", "name email")
      .sort({ createdAt: -1 });

    const outgoing = await RoommateRequest.find({ fromStudent: req.user._id })
      .populate("fromStudent", "name email")
      .populate("toStudent", "name email")
      .sort({ createdAt: -1 });

    res.json({ incoming, outgoing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// STUDENT: update request status
exports.updateRoommateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await RoommateRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Roommate request not found" });
    }

    if (request.toStudent.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    request.status = status;
    await request.save();

    await createNotification({
      user: request.fromStudent,
      title: `Roommate Request ${status}`,
      message: `Your roommate request was ${status.toLowerCase()}.`,
      type: "request",
      link: "/roommate-requests",
    });

    const populated = await RoommateRequest.findById(request._id)
      .populate("fromStudent", "name email")
      .populate("toStudent", "name email");

    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

