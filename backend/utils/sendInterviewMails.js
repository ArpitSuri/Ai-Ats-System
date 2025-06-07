// utils/sendInterviewMail.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASS,
    },
});

module.exports = function sendMail(name, toEmail) {
    const mailOptions = {
        from: process.env.MAIL_ID,
        to: toEmail,
        subject: "Interview Invitation",
        html: `
      <p>Dear ${name},</p>
      <p>Congratulations! You have been shortlisted for the next round of interviews.</p>
      <p>Please reply to this email to confirm your availability.</p>
      <p>Regards,<br>HR Team</p>
    `,
    };

    return transporter.sendMail(mailOptions);
};
