// /backend/routes/notificaciones.js
import express from "express";
import sendMail from "../services/mailer.js";

const router = express.Router();

router.post("/alerta", async (req, res) => {
  try {
    const { email, mensaje } = req.body;

    if (!email || !mensaje) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    await sendMail(
      email,
      "⚠ ALERTA: Límite superado",
      `<p>${mensaje}</p>`
    );

    res.json({ ok: true, msg: "Correo enviado" });
  } catch (error) {
    console.error("❌ Error enviando correo:", error);
    res.status(500).json({ error: "Error enviando correo" });
  }
});

export default router;