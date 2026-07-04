const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendPatientNotification(to, message) {
  if (!to) return;
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: "Mise à jour de votre ticket",
      text: message,
    });
  } catch (err) {
    console.error('Erreur envoi email notification patient :', err.message);
  }
}

module.exports = { sendPatientNotification };
