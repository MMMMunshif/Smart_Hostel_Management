const express = require("express");
const router = express.Router();

const { protect, authorise } = require("../middleware/Authmiddleware");

const {
  getPaymentAnalytics,
  getOverduePayments
} = require("../controllers/paymentAnalyticsController");

router.get("/", protect, authorise("admin"), getPaymentAnalytics);
router.get("/overdue", protect, authorise("admin"), getOverduePayments);

module.exports = router;