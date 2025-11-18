import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import nodemailer from "nodemailer";

const JWT_SECRET = "Nicolas1912";

// 🟩 REGISTRAR USUARIO
export const registerUser = async (req, res) => {
  try {
    const {
      Primer_Nombre_U,
      Primer_Apellido_U,
      Correo_Electronico_U,
      Contraseña_U,
    } = req.body;

    if (
      !Primer_Nombre_U ||
      !Primer_Apellido_U ||
      !Correo_Electronico_U ||
      !Contraseña_U
    ) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    // Verificar si el correo ya existe
    const exists = await pool.query(
      'SELECT * FROM "Usuario" WHERE "Correo_Electronico_U" = $1',
      [Correo_Electronico_U]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(Contraseña_U, 10);

    // Insertar nuevo usuario
    const result = await pool.query(
      `INSERT INTO "Usuario" 
        ("Primer_Nombre_U", "Primer_Apellido_U", "Correo_Electronico_U", "Contraseña_U")
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        Primer_Nombre_U,
        Primer_Apellido_U,
        Correo_Electronico_U,
        hashedPassword,
      ]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      {
        id: user.Id_Usuario,
        correo: user.Correo_Electronico_U,
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(201).json({
      message: "✅ Usuario registrado correctamente",
      user,
      token,
    });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// 🟨 LOGIN
export const loginUser = async (req, res) => {
  try {
    const { Correo_Electronico_U, Contraseña_U } = req.body;

    if (!Correo_Electronico_U || !Contraseña_U) {
      return res
        .status(400)
        .json({ error: "Correo y contraseña son obligatorios" });
    }

    const result = await pool.query(
      'SELECT * FROM "Usuario" WHERE "Correo_Electronico_U" = $1',
      [Correo_Electronico_U]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    const valid = await bcrypt.compare(Contraseña_U, user.Contraseña_U);
    if (!valid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.Id_Usuario, correo: user.Correo_Electronico_U },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "✅ Inicio de sesión exitoso",
      user: {
        id: user.Id_Usuario,
        nombre: user.Primer_Nombre_U,
        apellido: user.Primer_Apellido_U,
        correo: user.Correo_Electronico_U,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// 🟧 RECUPERAR CONTRASEÑA
export const recuperarContraseña = async (req, res) => {
  try {
    const { Correo_Electronico_U } = req.body;

    const result = await pool.query(
      'SELECT * FROM "Usuario" WHERE "Correo_Electronico_U" = $1',
      [Correo_Electronico_U]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Correo no encontrado" });
    }

    const user = result.rows[0];

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: Correo_Electronico_U,
      subject: "Recuperación de Contraseña - AgroSense",
      text: `Hola ${user.Primer_Nombre_U}, tu contraseña registrada es: ${user.Contraseña_U}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "📧 Correo enviado correctamente con tu contraseña.",
    });
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
    res.status(500).json({ error: "Error al enviar el correo." });
  }
};

// 🆕 SOLICITAR RESET PASSWORD
export const solicitarResetPassword = async (req, res) => {
  try {
    const { Correo_Electronico_U } = req.body;

    const result = await pool.query(
      'SELECT * FROM "Usuario" WHERE "Correo_Electronico_U" = $1',
      [Correo_Electronico_U]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Correo no encontrado" });
    }

    const user = result.rows[0];

    const resetToken = jwt.sign(
      { id: user.Id_Usuario, correo: user.Correo_Electronico_U },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: Correo_Electronico_U,
      subject: "Restablecer tu contraseña - AgroSense",
      html: `
        <h2>Hola ${user.Primer_Nombre_U},</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para cambiarla:</p>
        <a href="${resetLink}">Restablecer contraseña</a>
        <p>El enlace expirará en 15 minutos.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "📩 Enlace de recuperación enviado a tu correo electrónico.",
    });
  } catch (error) {
    console.error("❌ Error al enviar enlace:", error);
    res
      .status(500)
      .json({ error: "Error al enviar el enlace de recuperación." });
  }
};

// 🆕 RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { nuevaContraseña } = req.body;

    const decoded = jwt.verify(token, JWT_SECRET);
    const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);

    await pool.query(
      'UPDATE "Usuario" SET "Contraseña_U" = $1 WHERE "Id_Usuario" = $2',
      [hashedPassword, decoded.id]
    );

    res
      .status(200)
      .json({ message: "✅ Contraseña actualizada correctamente." });
  } catch (error) {
    console.error("❌ Error al restablecer contraseña:", error);
    res.status(500).json({ error: "Token inválido o expirado." });
  }
};

// 🆕 AGREGAR SENSOR
export const agregarSensor = async (req, res) => {
  try {
    const { id } = req.params;
    const { sensorId } = req.body;

    if (!sensorId) {
      return res
        .status(400)
        .json({ error: "El ID del sensor es obligatorio." });
    }

    const result = await pool.query(
      'SELECT "sensores" FROM "Usuario" WHERE "Id_Usuario" = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const sensores = result.rows[0].sensores || [];

    if (sensores.find((s) => s.id === sensorId)) {
      return res.status(400).json({ error: "Este sensor ya está asociado." });
    }

    const nuevoSensor = { id: sensorId, fecha: new Date().toISOString() };
    const nuevosSensores = [...sensores, nuevoSensor];

    await pool.query(
      'UPDATE "Usuario" SET "sensores" = $1 WHERE "Id_Usuario" = $2',
      [JSON.stringify(nuevosSensores), id]
    );

    res.status(200).json({
      message: "✅ Sensor agregado correctamente.",
      sensores: nuevosSensores,
    });
  } catch (error) {
    console.error("❌ Error al agregar sensor:", error);
    res.status(500).json({ error: "Error al agregar el sensor." });
  }
};

// 🗑️ ELIMINAR SENSOR
export const eliminarSensor = async (req, res) => {
  try {
    const { id, sensorId } = req.params;

    const result = await pool.query(
      'SELECT "sensores" FROM "Usuario" WHERE "Id_Usuario" = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const sensores = result.rows[0].sensores || [];
    const nuevosSensores = sensores.filter((s) => s.id !== sensorId);

    await pool.query(
      'UPDATE "Usuario" SET "sensores" = $1 WHERE "Id_Usuario" = $2',
      [JSON.stringify(nuevosSensores), id]
    );

    res.status(200).json({
      message: "🗑️ Sensor eliminado correctamente.",
      sensores: nuevosSensores,
    });
  } catch (error) {
    console.error("❌ Error al eliminar sensor:", error);
    res.status(500).json({ error: "Error al eliminar el sensor." });
  }
};

// 🟦 OBTENER SENSORES
export const obtenerSensores = async (req, res) => {
  try {
    const { idUsuario } = req.params;

    const result = await pool.query(
      'SELECT * FROM "sensor" WHERE "Id_Usuario" = $1',
      [idUsuario]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener sensores:", error);
    res.status(500).json({ error: "Error al obtener sensores" });
  }
};