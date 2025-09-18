const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    // ✅ Create reusable transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    // ✅ Define email options
    const mailOptions = {
      from: `"MyInternshala" <${process.env.EMAIL_USER}>`, // branded sender
      to,
      subject,
      text,
    };

    // ✅ Send mail
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to} | Message ID: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error("❌ Error sending email:", err.message);
    return false;
  }
};

module.exports = { sendEmail };
