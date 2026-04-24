const Payment = require("../models/Payment");

exports.getPaymentAnalytics = async (req, res) => {
  try {
    const payments = await Payment.find();

    const total = payments.length;
    const paid = payments.filter(p => p.status === "Paid").length;
    const submitted = payments.filter(p => p.status === "Submitted").length;
    const overdue = payments.filter(p => p.status === "Overdue").length;

    const totalRevenue = payments
      .filter(p => p.status === "Paid")
      .reduce((sum, p) => sum + p.amount, 0);

    // Monthly revenue
    const monthly = {};

    payments.forEach(p => {
      if (!monthly[p.month]) {
        monthly[p.month] = 0;
      }

      if (p.status === "Paid") {
        monthly[p.month] += p.amount;
      }
    });

    // Convert to chart format
    const monthlyData = Object.keys(monthly).map(month => ({
      month,
      amount: monthly[month],
    }));

    res.json({
      total,
      paid,
      submitted,
      overdue,
      totalRevenue,
      monthlyData,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔥 Overdue students list
exports.getOverduePayments = async (req, res) => {
  try {
    const payments = await Payment.find({ status: "Overdue" })
      .populate("student", "name email")
      .populate("room", "roomNumber");

    res.json(payments);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};