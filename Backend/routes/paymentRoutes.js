const express = require("express");
const router = express.Router();

const { protect, authorise } = require("../middleware/Authmiddleware");
const upload = require("../middleware/upload");
const {
  createMonthlyPayment,
  createMonthlyPaymentsForAll,
  getMyPayments,
  getAllPayments,
  uploadReceipt,
  updatePaymentStatus,
  downloadReceipt,
  sendOverdueReminders,
  sendDueSoonReminders
} = require("../controllers/paymentController");

// admin
router.post("/", protect, authorise("admin"), createMonthlyPayment);
router.post("/generate-all", protect, authorise("admin"), createMonthlyPaymentsForAll);
router.get("/", protect, authorise("admin"), getAllPayments);
router.put("/:id/status", protect, authorise("admin"), updatePaymentStatus);

// student
router.get("/my", protect, authorise("student"), getMyPayments);
router.put("/:id/receipt", protect, authorise("student"), upload.single("file"), uploadReceipt);

// download
router.get("/receipt/:token", downloadReceipt);

// overdue reminders
router.post("/send-overdue-reminders", protect, authorise("admin"), sendOverdueReminders);

// due soon reminders
router.post("/send-due-soon-reminders", protect, authorise("admin"), sendDueSoonReminders);

module.exports = router;