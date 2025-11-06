import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import nodemailer from "nodemailer"; // 🆕 Para enviar correos

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
      "SELECT * FROM usuario WHERE correo_electronico_u = $1",
      [Correo_Electronico_U]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(Contraseña_U, 10);

    // Insertar nuevo usuario
    const result = await pool.query(
      `INSERT INTO usuario (primer_nombre_u, primer_apellido_u, correo_electronico_u, contraseña_u)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [Primer_Nombre_U, Primer_Apellido_U, Correo_Electronico_U, hashedPassword]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id_usuario, correo: user.correo_electronico_u },
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
      "SELECT * FROM usuario WHERE correo_electronico_u = $1",
      [Correo_Electronico_U]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    const valid = await bcrypt.compare(Contraseña_U, user.contraseña_u);
    if (!valid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id_usuario, correo: user.correo_electronico_u },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "✅ Inicio de sesión exitoso",
      user: {
        id: user.id_usuario,
        nombre: user.primer_nombre_u,
        apellido: user.primer_apellido_u,
        correo: user.correo_electronico_u,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// 🟧 RECUPERAR CONTRASEÑA (versión temporal para sprint)
export const recuperarContraseña = async (req, res) => {
  try {
    const { Correo_Electronico_U } = req.body;

    // Buscar usuario
    const result = await pool.query(
      "SELECT * FROM usuario WHERE correo_electronico_u = $1",
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
      text: `Hola ${user.primer_nombre_u}, tu contraseña registrada es: ${user.contraseña_u}`,
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

// 🆕 SOLICITAR REINICIO DE CONTRASEÑA (envía enlace seguro)
export const solicitarResetPassword = async (req, res) => {
  try {
    const { Correo_Electronico_U } = req.body;

    const result = await pool.query(
      "SELECT * FROM usuario WHERE correo_electronico_u = $1",
      [Correo_Electronico_U]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Correo no encontrado" });
    }

    const user = result.rows[0];

    // Crear token temporal de recuperación
    const resetToken = jwt.sign(
      { id: user.id_usuario, correo: user.correo_electronico_u },
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
        <h2>Hola ${user.primer_nombre_u},</h2>
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
    res.status(500).json({ error: "Error al enviar el enlace de recuperación." });
  }
};

// 🆕 RESETEAR CONTRASEÑA (cambia la contraseña)
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { nuevaContraseña } = req.body;

    const decoded = jwt.verify(token, JWT_SECRET);

    const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);

    await pool.query(
      "UPDATE usuario SET contraseña_u = $1 WHERE id_usuario = $2",
      [hashedPassword, decoded.id]
    );

    res.status(200).json({ message: "✅ Contraseña actualizada correctamente." });
  } catch (error) {
    console.error("❌ Error al restablecer contraseña:", error);
    res.status(500).json({ error: "Token inválido o expirado." });
  }
};

// 🆕 AGREGAR SENSOR A UN USUARIO
export const agregarSensor = async (req, res) => {
  try {
    const { id } = req.params; // ID del usuario
    const { sensorId } = req.body;

    if (!sensorId) {
      return res.status(400).json({ error: "El ID del sensor es obligatorio." });
    }

    // Obtener los sensores actuales del usuario
    const result = await pool.query("SELECT sensores FROM usuario WHERE id_usuario = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const sensores = result.rows[0].sensores || [];

    // Verificar si el sensor ya existe
    if (sensores.find((s) => s.id === sensorId)) {
      return res.status(400).json({ error: "Este sensor ya está asociado." });
    }

    // Agregar el nuevo sensor
    const nuevoSensor = { id: sensorId, fecha: new Date().toISOString() };
    const nuevosSensores = [...sensores, nuevoSensor];

    // Actualizar en BD
    await pool.query("UPDATE usuario SET sensores = $1 WHERE id_usuario = $2", [JSON.stringify(nuevosSensores), id]);

    res.status(200).json({
      message: "✅ Sensor agregado correctamente.",
      sensores: nuevosSensores,
    });
  } catch (error) {
    console.error("❌ Error al agregar sensor:", error);
    res.status(500).json({ error: "Error al agregar el sensor." });
  }
};

// 🗑️ ELIMINAR SENSOR DE UN USUARIO
export const eliminarSensor = async (req, res) => {
  try {
    const { id, sensorId } = req.params;

    const result = await pool.query("SELECT sensores FROM usuario WHERE id_usuario = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const sensores = result.rows[0].sensores || [];

    // Filtrar el sensor a eliminar
    const nuevosSensores = sensores.filter((s) => s.id !== sensorId);

    await pool.query("UPDATE usuario SET sensores = $1 WHERE id_usuario = $2", [JSON.stringify(nuevosSensores), id]);

    res.status(200).json({
      message: "🗑️ Sensor eliminado correctamente.",
      sensores: nuevosSensores,
    });
  } catch (error) {
    console.error("❌ Error al eliminar sensor:", error);
    res.status(500).json({ error: "Error al eliminar el sensor." });
  }
};

// 🟦 OBTENER SENSORES DE UN USUARIO
export const obtenerSensores = async (req, res) => {
  try {
    const { id_usuario } = req.params;

    const result = await pool.query(
      "SELECT * FROM sensor WHERE id_usuario = $1",
      [id_usuario]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener sensores:", error);
    res.status(500).json({ error: "Error al obtener sensores" });
  }
};



