const Notice = require("../models/Notice");
const User = require("../models/User");
const { createNotification } = require("./notificationController");

// ADMIN: Create notice
exports.createNotice = async (req, res) => {
  try {
    const { title, message, category, audience } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        message: "Title and message are required",
      });
    }

    const notice = await Notice.create({
      title,
      message,
      category: category || "General",
      audience: audience || "students",
      postedBy: req.user._id,
    });

    // create notifications for students when audience includes them
    if (notice.audience === "students" || notice.audience === "all") {
      const students = await User.find({
        role: "student",
        isActive: true,
      }).select("_id");

      await Promise.all(
        students.map((student) =>
          createNotification({
            user: student._id,
            title: `New Notice: ${notice.title}`,
            message: notice.message,
            type: "notice",
            link: "/notices",
          })
        )
      );
    }

    const populatedNotice = await Notice.findById(notice._id).populate(
      "postedBy",
      "name email role"
    );

    res.status(201).json(populatedNotice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADMIN: Get all notices
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate("postedBy", "name email role")
      .sort({ createdAt: -1 });

    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// STUDENT/ADMIN: Get active notices for current user role
exports.getMyNotices = async (req, res) => {
  try {
    const role = req.user.role;

    const allowedAudiences =
      role === "admin" ? ["all", "admins"] : ["all", "students"];

    const notices = await Notice.find({
      isActive: true,
      audience: { $in: allowedAudiences },
    })
      .populate("postedBy", "name email role")
      .sort({ createdAt: -1 });

    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADMIN: Update notice
exports.updateNotice = async (req, res) => {
  try {
    const { title, message, category, audience, isActive } = req.body;

    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    if (title !== undefined) notice.title = title;
    if (message !== undefined) notice.message = message;
    if (category !== undefined) notice.category = category;
    if (audience !== undefined) notice.audience = audience;
    if (isActive !== undefined) notice.isActive = isActive;

    await notice.save();

    const updatedNotice = await Notice.findById(notice._id).populate(
      "postedBy",
      "name email role"
    );

    res.json(updatedNotice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADMIN: Delete notice
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    await notice.deleteOne();

    res.json({ message: "Notice deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};