// backend/services/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configuración del transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Función para enviar correo
const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Soporte" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Email enviado:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
    return false;
  }
};

// ⛔ ESTA ES LA ÚNICA LÍNEA NUEVA
export default sendEmail;