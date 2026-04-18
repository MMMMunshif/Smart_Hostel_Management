const Notification = require("../models/Notification");

// GET my notifications
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET unread count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// MARK one as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// MARK all as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// helper function for backend use
exports.createNotification = async ({
  user,
  title,
  message,
  type = "general",
  link = "",
}) => {
  try {
    await Notification.create({
      user,
      title,
      message,
      type,
      link,
    });
  } catch (err) {
    console.error("Notification create error:", err.message);
  }
};