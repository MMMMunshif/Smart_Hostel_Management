const crypto = require("crypto");
const Payment = require("../models/Payment");
const Room = require("../models/Room");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const buildReceiptUrl = (req, token) =>
  `${req.protocol}://${req.get("host")}/api/payments/receipt/${token}`;

// Helper: auto-generate a human-readable receipt number from payment data
const buildReceiptNumber = (payment) => {
  const year = new Date(payment.createdAt || Date.now()).getFullYear();
  const suffix = String(payment._id).slice(-5).toUpperCase();
  return `REC-${year}-${suffix}`;
};

// ─── ADMIN: create single payment request ─────────────────────────────────────
exports.createMonthlyPayment = async (req, res) => {
  try {
    const { student, month, amount, dueDate, utilityAmount } = req.body;

    if (!student || !month || !amount || !dueDate) {
      return res.status(400).json({ message: "student, month, amount and dueDate are required" });
    }

    const studentDoc = await User.findById(student);
    if (!studentDoc) {
      return res.status(404).json({ message: "Student not found" });
    }

    const room = await Room.findOne({ occupants: studentDoc._id });

    const payment = await Payment.create({
      student,
      room: room?._id || null,
      month,
      amount,
      utilityAmount: utilityAmount || 0,
      dueDate,
      status: "Pending",
      downloadToken: crypto.randomBytes(24).toString("hex"),
    });

    const populated = await Payment.findById(payment._id)
      .populate("student", "name email")
      .populate("room", "roomNumber wing type");

    // Notify student a new payment request has been created
    if (studentDoc.email) {
      await sendEmail({
        to: studentDoc.email,
        subject: `New rent payment request — ${month}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
            <h2 style="color: #111827;">Rent Payment Request</h2>
            <p>Hello ${studentDoc.name},</p>
            <p>A rent payment request has been created for <strong>${month}</strong>.</p>
            <table style="border-collapse: collapse; margin: 12px 0;">
              <tr><td style="padding: 4px 16px 4px 0; color: #6b7280;">Amount</td><td><strong>LKR ${Number(amount).toLocaleString()}</strong></td></tr>
              ${utilityAmount ? `<tr><td style="padding: 4px 16px 4px 0; color: #6b7280;">Utilities</td><td>LKR ${Number(utilityAmount).toLocaleString()}</td></tr>` : ""}
              <tr><td style="padding: 4px 16px 4px 0; color: #6b7280;">Due date</td><td>${new Date(dueDate).toLocaleDateString("en-LK", { day: "numeric", month: "long", year: "numeric" })}</td></tr>
              <tr><td style="padding: 4px 16px 4px 0; color: #6b7280;">Room</td><td>${room?.roomNumber || "N/A"}</td></tr>
            </table>
            <p>Please log in to the hostel portal and upload your bank payment slip before the due date.</p>
          </div>
        `,
      }).catch(() => {}); // don't fail the request if email fails
    }

    res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Payment record already exists for this student and month" });
    }
    res.status(500).json({ error: err.message });
  }
};

// ─── ADMIN: bulk create for all students ──────────────────────────────────────
exports.createMonthlyPaymentsForAll = async (req, res) => {
  try {
    const { month, amount, dueDate, utilityAmount } = req.body;

    if (!month || !amount || !dueDate) {
      return res.status(400).json({ message: "month, amount and dueDate are required" });
    }

    const students = await User.find({ role: "student" });
    const created = [];
    const skipped = [];

    for (const student of students) {
      const existing = await Payment.findOne({ student: student._id, month });
      if (existing) { skipped.push(student._id); continue; }

      const room = await Room.findOne({ occupants: student._id });

      const payment = await Payment.create({
        student: student._id,
        room: room?._id || null,
        month,
        amount,
        utilityAmount: utilityAmount || 0,
        dueDate,
        status: "Pending",
        downloadToken: crypto.randomBytes(24).toString("hex"),
      });

      created.push(payment._id);

      // Email each student (fire-and-forget)
      if (student.email) {
        sendEmail({
          to: student.email,
          subject: `Rent payment request — ${month}`,
          html: `<p>Hello ${student.name}, a rent payment of LKR ${Number(amount).toLocaleString()} for <strong>${month}</strong> is due by ${new Date(dueDate).toLocaleDateString("en-LK", { day: "numeric", month: "long" })}. Please log in and upload your bank slip.</p>`,
        }).catch(() => {});
      }
    }

    res.json({
      message: "Monthly payment generation completed",
      createdCount: created.length,
      skippedCount: skipped.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── STUDENT: get my payments ─────────────────────────────────────────────────
exports.getMyPayments = async (req, res) => {
  try {
    const now = new Date();

    // Auto-mark overdue
    await Payment.updateMany(
      {
        student: req.user._id,
        status: { $in: ["Pending", "Rejected"] },
        dueDate: { $lt: now },
      },
      { $set: { status: "Overdue" } }
    );

    const payments = await Payment.find({ student: req.user._id })
      .populate("room", "roomNumber wing type")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── ADMIN: get all payments ──────────────────────────────────────────────────
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("student", "name email")
      .populate("room", "roomNumber wing type")
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── STUDENT: upload bank slip ────────────────────────────────────────────────
exports.uploadReceipt = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("student", "name email");

    if (!payment) return res.status(404).json({ message: "Payment not found" });
    if (payment.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }
    if (!req.file) return res.status(400).json({ message: "Bank slip file is required" });

    // Allow re-upload only if not already approved
    if (payment.status === "Paid") {
      return res.status(400).json({ message: "Payment is already approved" });
    }

    payment.receipt = `uploads/${req.file.filename}`;
    payment.receiptFileName = req.file.originalname;
    payment.paymentDate = new Date();
    payment.status = "Submitted";
    if (!payment.downloadToken) {
      payment.downloadToken = crypto.randomBytes(24).toString("hex");
    }

    await payment.save();

    const updated = await Payment.findById(payment._id)
      .populate("student", "name email")
      .populate("room", "roomNumber wing type");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── ADMIN: approve or reject payment ────────────────────────────────────────
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status, adminRemark } = req.body;

    if (!["Paid", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be Paid or Rejected" });
    }

    const payment = await Payment.findById(req.params.id)
      .populate("student", "name email")
      .populate("room", "roomNumber wing type");

    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = status;
    payment.adminRemark = adminRemark || "";
    if (status === "Paid") payment.approvedAt = new Date();
    await payment.save();

    // Send approval or rejection email
    if (payment.student?.email) {
      const isApproved = status === "Paid";
      const receiptNo = buildReceiptNumber(payment);

      await sendEmail({
        to: payment.student.email,
        subject: isApproved
          ? `Payment approved — ${payment.month} · ${receiptNo}`
          : `Payment rejected — ${payment.month}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
            <h2 style="color: ${isApproved ? "#166534" : "#991b1b"};">
              Payment ${isApproved ? "Approved ✓" : "Rejected"}
            </h2>
            <p>Hello ${payment.student.name},</p>
            ${isApproved
              ? `<p>Your rent payment for <strong>${payment.month}</strong> has been verified and approved.</p>
                 <table style="border-collapse: collapse; margin: 12px 0;">
                   <tr><td style="padding: 4px 16px 4px 0; color: #6b7280;">Receipt No.</td><td><strong>${receiptNo}</strong></td></tr>
                   <tr><td style="padding: 4px 16px 4px 0; color: #6b7280;">Amount</td><td>LKR ${Number(payment.amount).toLocaleString()}</td></tr>
                   <tr><td style="padding: 4px 16px 4px 0; color: #6b7280;">Room</td><td>${payment.room?.roomNumber || "N/A"}</td></tr>
                   <tr><td style="padding: 4px 16px 4px 0; color: #6b7280;">Approved on</td><td>${new Date().toLocaleDateString("en-LK", { day: "numeric", month: "long", year: "numeric" })}</td></tr>
                 </table>
                 <p>Log in to the hostel portal to download your official receipt.</p>`
              : `<p>Your rent payment submission for <strong>${payment.month}</strong> has been rejected.</p>
                 ${adminRemark ? `<p><strong>Reason:</strong> ${adminRemark}</p>` : ""}
                 <p>Please log in and re-upload a correct bank slip.</p>`
            }
          </div>
        `,
      }).catch(() => {});
    }

    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── PUBLIC: download bank slip by token ─────────────────────────────────────
exports.downloadReceipt = async (req, res) => {
  try {
    const payment = await Payment.findOne({ downloadToken: req.params.token });
    if (!payment || !payment.receipt) {
      return res.status(404).json({ message: "Slip not found" });
    }
    return res.download(payment.receipt, payment.receiptFileName || "bank-slip");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendOverdueReminders = async (req, res) => {
  try {
    const overduePayments = await Payment.find({ status: "Overdue" })
      .populate("student", "name email")
      .populate("room", "roomNumber wing type");

    if (!overduePayments.length) {
      return res.json({
        message: "No overdue payments found",
        sentCount: 0,
      });
    }

    let sentCount = 0;
    const skipped = [];

    const now = new Date();

    for (const payment of overduePayments) {
      if (!payment.student?.email) {
        skipped.push({
          paymentId: payment._id,
          reason: "Student email not found",
        });
        continue;
      }

      const alreadySentToday =
        payment.lastReminderSentAt &&
        new Date(payment.lastReminderSentAt).toDateString() === now.toDateString();

      if (alreadySentToday) {
        skipped.push({
          paymentId: payment._id,
          reason: "Reminder already sent today",
        });
        continue;
      }

      try {
        await sendEmail({
          to: payment.student.email,
          subject: `Overdue Rent Reminder - ${payment.month}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #111827;">
              <h2 style="margin-bottom: 10px;">Overdue Rent Payment Reminder</h2>

              <p>Hello ${payment.student.name || "Student"},</p>

              <p>
                This is a reminder that your hostel rent payment is currently
                <strong>overdue</strong>.
              </p>

              <div style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:12px; padding:16px; margin:16px 0;">
                <p style="margin:0 0 8px;"><strong>Month:</strong> ${payment.month}</p>
                <p style="margin:0 0 8px;"><strong>Amount:</strong> LKR ${Number(payment.amount || 0).toLocaleString()}</p>
                <p style="margin:0 0 8px;"><strong>Due Date:</strong> ${
                  payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : "N/A"
                }</p>
                <p style="margin:0;"><strong>Room:</strong> ${payment.room?.roomNumber || "N/A"}</p>
              </div>

              <p>
                Please complete your payment as soon as possible and upload your receipt through the hostel system.
              </p>

              <p style="margin-top:20px;">
                Thank you,<br />
                Hostel Administration
              </p>
            </div>
          `,
        });

        payment.lastReminderSentAt = now;
        await payment.save();
        sentCount += 1;
      } catch (mailErr) {
        skipped.push({
          paymentId: payment._id,
          reason: `Email failed: ${mailErr.message}`,
        });
      }
    }

    res.json({
      message: "Overdue reminder process completed",
      sentCount,
      skippedCount: skipped.length,
      skipped,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendDueSoonReminders = async (req, res) => {
  try {
    const now = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(now.getDate() + 3);

    const payments = await Payment.find({
      status: { $in: ["Pending", "Rejected"] },
      dueDate: { $gte: now, $lte: threeDaysLater },
    })
      .populate("student", "name email")
      .populate("room", "roomNumber wing type");

    if (!payments.length) {
      return res.json({
        message: "No due-soon payments found",
        sentCount: 0,
      });
    }

    let sentCount = 0;
    const skipped = [];

    for (const payment of payments) {
      if (!payment.student?.email) {
        skipped.push({
          paymentId: payment._id,
          reason: "Student email not found",
        });
        continue;
      }

      const alreadySentToday =
        payment.lastDueSoonReminderSentAt &&
        new Date(payment.lastDueSoonReminderSentAt).toDateString() === now.toDateString();

      if (alreadySentToday) {
        skipped.push({
          paymentId: payment._id,
          reason: "Due soon reminder already sent today",
        });
        continue;
      }

      try {
        await sendEmail({
          to: payment.student.email,
          subject: `Upcoming Rent Due Reminder - ${payment.month}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #111827;">
              <h2 style="margin-bottom: 10px;">Upcoming Rent Due Reminder</h2>

              <p>Hello ${payment.student.name || "Student"},</p>

              <p>
                This is a reminder that your hostel rent payment is due soon.
              </p>

              <div style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:12px; padding:16px; margin:16px 0;">
                <p style="margin:0 0 8px;"><strong>Month:</strong> ${payment.month}</p>
                <p style="margin:0 0 8px;"><strong>Amount:</strong> LKR ${Number(payment.amount || 0).toLocaleString()}</p>
                <p style="margin:0 0 8px;"><strong>Due Date:</strong> ${
                  payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : "N/A"
                }</p>
                <p style="margin:0;"><strong>Room:</strong> ${payment.room?.roomNumber || "N/A"}</p>
              </div>

              <p>
                Please make your payment before the due date and upload your receipt through the hostel system.
              </p>

              <p style="margin-top:20px;">
                Thank you,<br />
                Hostel Administration
              </p>
            </div>
          `,
        });

        payment.lastDueSoonReminderSentAt = now;
        await payment.save();
        sentCount += 1;
      } catch (mailErr) {
        skipped.push({
          paymentId: payment._id,
          reason: `Email failed: ${mailErr.message}`,
        });
      }
    }

    res.json({
      message: "Due soon reminder process completed",
      sentCount,
      skippedCount: skipped.length,
      skipped,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};