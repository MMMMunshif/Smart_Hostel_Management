const WardenMessage = require("../models/WardenMessage");

// build conversation id
const buildConversationId = (studentId) => `student_${studentId}_admin`;

// STUDENT: get own chat
exports.getStudentMessages = async (req, res) => {
  try {
    const conversationId = buildConversationId(req.user._id);

    const messages = await WardenMessage.find({ conversationId })
      .populate("sender", "name email role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADMIN: get all conversations latest message + unread count
exports.getAdminConversations = async (req, res) => {
  try {
    const messages = await WardenMessage.find()
      .populate("sender", "name email role")
      .sort({ createdAt: -1 });

    const map = new Map();

    for (const msg of messages) {
      if (!map.has(msg.conversationId)) {
        const unreadCount = await WardenMessage.countDocuments({
          conversationId: msg.conversationId,
          receiverRole: "admin",
          isRead: false,
        });

        map.set(msg.conversationId, {
          ...msg.toObject(),
          unreadCount,
        });
      }
    }

    res.json(Array.from(map.values()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADMIN: get one conversation
exports.getAdminConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await WardenMessage.find({ conversationId })
      .populate("sender", "name email role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// send normal text message
exports.sendMessage = async (req, res) => {
  try {
    const { text, conversationId } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    let finalConversationId = conversationId;
    let receiverRole = "admin";

    if (req.user.role === "student") {
      finalConversationId = buildConversationId(req.user._id);
      receiverRole = "admin";
    } else {
      if (!conversationId) {
        return res.status(400).json({ message: "conversationId is required" });
      }
      receiverRole = "student";
    }

    const message = await WardenMessage.create({
      sender: req.user._id,
      receiverRole,
      text: text.trim(),
      conversationId: finalConversationId,
      messageType: "text",
    });

    const populated = await WardenMessage.findById(message._id).populate(
      "sender",
      "name email role"
    );

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// send attachment message
exports.sendAttachmentMessage = async (req, res) => {
  try {
    let { text, conversationId, duration } = req.body;

    if (req.user.role === "student") {
      conversationId = `student_${req.user._id}_admin`;
    }

    if (!req.file && !text?.trim()) {
      return res.status(400).json({ message: "Message content is required" });
    }

    if (req.user.role === "admin" && !conversationId) {
      return res.status(400).json({ message: "conversationId is required" });
    }

    const receiverRole = req.user.role === "student" ? "admin" : "student";

    let messageType = "text";
    let fileUrl = "";
    let fileName = "";
    let voiceUrl = "";

    if (req.file) {
      const mime = req.file.mimetype || "";

      // save clean browser-friendly path
      const cleanPath = `uploads/${req.file.filename}`;

      fileUrl = cleanPath;
      fileName = req.file.originalname;

      if (mime.startsWith("image/")) {
        messageType = "image";
      } else if (mime.startsWith("audio/")) {
        messageType = "voice";
        voiceUrl = cleanPath;
      } else {
        messageType = "file";
      }
    }

    const message = await WardenMessage.create({
      sender: req.user._id,
      receiverRole,
      text: text || "",
      conversationId,
      isRead: false,
      messageType,
      fileUrl,
      fileName,
      voiceUrl,
      duration: Number(duration || 0),
    });

    const populated = await WardenMessage.findById(message._id).populate(
      "sender",
      "name email role"
    );

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// mark conversation as read
exports.markConversationAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;

    await WardenMessage.updateMany(
      {
        conversationId,
        receiverRole: req.user.role,
        isRead: false,
      },
      { isRead: true }
    );

    res.json({ message: "Messages marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};