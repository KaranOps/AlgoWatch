const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});




const sendReminderEmail = async (to, name) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Codeforces Inactivity Reminder',
    text: `Hi ${name},\n\nWe noticed you haven’t made any Codeforces submissions in the last 7 days. Get back to problem solving!`,
  });
};

module.exports = sendReminderEmail;