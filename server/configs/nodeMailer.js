import nodemailer from 'nodemailer';

// Create transporter with Brevo (formerly Sendinblue) SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || '9c5440001@smtp-brevo.com',
    pass: process.env.SMTP_PASS, // SMTP key from Brevo
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === 'production',
  },
});

export default transporter;
