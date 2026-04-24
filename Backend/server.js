const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin'); // ← KEY FIX
  next();
}, express.static(path.join(__dirname, 'uploads')));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

app.get("/", (req, res) => res.send("API Running 🚀"));

const userRoutes = require("./routes/userRoutes");
const matchRoutes = require("./routes/matchRoutes");
const roomRoutes = require("./routes/roomRoutes");
const requestRoutes = require("./routes/requestRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const roommateRequestRoutes = require("./routes/roommateRequestRoutes");
const roomChangeRequestRoutes = require("./routes/roomChangeRequestRoutes");
const wardenMessageRoutes = require("./routes/wardenMessageRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const paymentAnalyticsRoutes = require("./routes/paymentAnalyticsRoutes");

app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/roommate-requests", roommateRequestRoutes);
app.use("/api/room-change-requests", roomChangeRequestRoutes);
app.use("/api/warden-messages", wardenMessageRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/payment-analytics", paymentAnalyticsRoutes);

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
  });

  socket.on("send_message", (message) => {
    io.to(message.conversationId).emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong",
    error: err.message,
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});