const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      throw new Error("MAIL_USER or MAIL_PASS missing in .env");
    }

    const transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE || "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"Smart Hostel" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ OTP email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    throw error;
  }
};

module.exports = sendEmail;