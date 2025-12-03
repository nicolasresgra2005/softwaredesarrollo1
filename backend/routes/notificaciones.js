// /backend/routes/notificaciones.js
import express from "express";
import sendMail from "../services/mailer.js";

const router = express.Router();

router.post("/alerta", async (req, res) => {
  try {
    console.log("📥 Body recibido:", req.body);

    let { email, mensaje, tipo, valor, limite, sensorId } = req.body;

    // Si no viene "mensaje" lo generamos
    if (!mensaje && tipo && valor !== undefined && limite !== undefined) {
      mensaje = `⚠ ${tipo}<br>Valor actual: ${valor}<br>Límite configurado: ${limite}<br>Sensor: ${sensorId}`;
    }

    // Si no viene email, buscamos el email asociado al sensor
    if (!email) {

      // ⚠ OJO — aquí debes agregar la consulta real a DB
      // por ahora TEMPORAL:
      email = "agrosenseds@gmail.com"; 
      
      console.log("📨 usando email por defecto:", email);
    }

    if (!email || !mensaje) {
      return res.status(400).json({ error: "Faltan datos para enviar correo" });
    }

    console.log("📨 enviando correo a:", email);
    console.log("📝 mensaje:", mensaje);

    await sendMail(
      email,
      `⚠ ALERTA: ${tipo}`,
      `<p>${mensaje}</p>`
    );

    console.log("📧 correo enviado correctamente!");

    res.json({ ok: true, msg: "Correo enviado" });
  } catch (error) {
    console.error("❌ Error enviando correo:", error);
    res.status(500).json({ error: "Error enviando correo" });
  }
});

export default router;