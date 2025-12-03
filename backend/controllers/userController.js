import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import nodemailer from "nodemailer";

const JWT_SECRET = "Nicolas1912";

// ===============================
// REGISTRAR USUARIO
// ===============================
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

    const exists = await pool.query(
      'SELECT * FROM "Usuario" WHERE "Correo_Electronico_U" = $1',
      [Correo_Electronico_U]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(Contraseña_U, 10);

    const result = await pool.query(
      `INSERT INTO "Usuario" 
        ("Primer_Nombre_U", "Primer_Apellido_U", "Correo_Electronico_U", "Contraseña_U")
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        Primer_Nombre_U,
        Primer_Apellido_U,
        Correo_Electronico_U,
        hashedPassword
      ]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.Id_Usuario, correo: user.Correo_Electronico_U },
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

// ===============================
// LOGIN
// ===============================
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

// ===============================
// RECUPERAR CONTRASEÑA (CORREGIDO)
// ===============================
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

    // 🔥 Usamos la contraseña REAL sin hash y sin espacios
    const contraseñaReal = user.Contrasena_Plana?.trim();

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
      text: `Hola ${user.Primer_Nombre_U}, tu contraseña es: ${contraseñaReal}`,
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

// ===============================
// SOLICITAR RESET PASSWORD
// ===============================
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
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: Correo_Electronico_U,
      subject: "Restablecer tu contraseña - AgroSense",
      html: `
        <h2>Hola ${user.Primer_Nombre_U},</h2>
        <p>Haz clic en el siguiente enlace para cambiar tu contraseña:</p>
        <a href="${resetLink}">Restablecer contraseña</a>
        <p>El enlace expira en 15 minutos.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "📩 Enlace de recuperación enviado a tu correo electrónico.",
    });
  } catch (error) {
    console.error("❌ Error al enviar enlace:", error);
    res.status(500).json({
      error: "Error al enviar el enlace de recuperación.",
    });
  }
};

// ===============================
// RESET PASSWORD
// ===============================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { nuevaContraseña } = req.body;

    const decoded = jwt.verify(token, JWT_SECRET);
    const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);

    await pool.query(
      'UPDATE "Usuario" SET "Contraseña_U" = $1, "Contrasena_Plana" = $2 WHERE "Id_Usuario" = $3',
      [hashedPassword, nuevaContraseña.trim(), decoded.id]
    );

    res.status(200).json({
      message: "✅ Contraseña actualizada correctamente.",
    });
  } catch (error) {
    console.error("❌ Error al restablecer contraseña:", error);
    res.status(500).json({ error: "Token inválido o expirado." });
  }
};

// ===============================
// AGREGAR SENSOR
// ===============================
export const agregarSensor = async (req, res) => {
  try {
    const { Id_Usuario, Ip_Sensor, Nombre_Lote, Tamano_Lote } = req.body;

    if (!Id_Usuario || !Ip_Sensor || !Nombre_Lote || !Tamano_Lote) {
      return res.status(400).json({
        error: "Todos los campos (IP, nombre y tamaño del lote) son obligatorios.",
      });
    }

    const userCheck = await pool.query(
      'SELECT 1 FROM "Usuario" WHERE "Id_Usuario" = $1',
      [Id_Usuario]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const sensorDuplicado = await pool.query(
      'SELECT 1 FROM "Sensor" WHERE "Id_Usuario" = $1 AND "Ip_Sensor" = $2',
      [Id_Usuario, Ip_Sensor]
    );

    if (sensorDuplicado.rows.length > 0) {
      return res.status(400).json({
        error: "⚠️ El usuario ya tiene un sensor con esta IP.",
      });
    }

    const nuevo = await pool.query(
      `INSERT INTO "Sensor" ("Ip_Sensor", "Id_Usuario", "Nombre_Lote", "Tamaño_Lote")
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [Ip_Sensor, Id_Usuario, Nombre_Lote, Tamano_Lote]
    );

    res.status(201).json({
      message: "✅ Sensor agregado correctamente.",
      sensor: nuevo.rows[0],
    });
  } catch (error) {
    console.error("❌ Error al agregar sensor:", error);
    res.status(500).json({ error: "Error al agregar el sensor." });
  }
};

// ===============================
// ELIMINAR – OBTENER – LÍMITES – ALERTAS
// ===============================

export const eliminarSensor = async (req, res) => {
  try {
    const { Ip_Sensor } = req.params;

    if (!Ip_Sensor) {
      return res.status(400).json({ error: "IP no recibida en la URL" });
    }

    const result = await pool.query(
      `DELETE FROM "Sensor"
       WHERE "Ip_Sensor" = $1
       RETURNING *`,
      [Ip_Sensor]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Sensor no encontrado por IP." });
    }

    res.status(200).json({
      message: "🗑️ Sensor eliminado correctamente.",
      sensor: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error al eliminar sensor:", error);
    res.status(500).json({ error: "Error al eliminar el sensor." });
  }
};

export const obtenerSensorPorId = async (req, res) => {
  try {
    const { Id_Sensor } = req.params;

    const result = await pool.query(
      'SELECT * FROM "Sensor" WHERE "Id_Sensor" = $1',
      [Id_Sensor]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Sensor no encontrado" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener sensor por ID:", error);
    res.status(500).json({ error: "Error al obtener el sensor" });
  }
};

export const obtenerSensores = async (req, res) => {
  try {
    const { Id_Usuario } = req.params;

    const result = await pool.query(
      'SELECT * FROM "Sensor" WHERE "Id_Usuario" = $1',
      [Id_Usuario]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error al obtener sensores:", error);
    res.status(500).json({ error: "Error al obtener sensores" });
  }
};

export const obtenerDatosSensor = async (req, res) => {
  try {
    const { Id_Sensor } = req.params;

    const result = await pool.query(
      `SELECT * FROM "Datos_Sensor" 
       WHERE "Id_Sensor" = $1
       ORDER BY "Fecha_Registro" ASC`,
      [Id_Sensor]
    );

    if (result.rows.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error al obtener datos del sensor:", error);
    res.status(500).json({ error: "Error al obtener los datos del sensor." });
  }
};

export const actualizarLimitesSensor = async (req, res) => {
  try {
    const { Id_Sensor } = req.params;
    const {
      tempMin, tempMax, humMin, humMax,
      Temp_Min, Temp_Max, Hum_Min, Hum_Max
    } = req.body;

    const TMin = tempMin ?? Temp_Min ?? null;
    const TMax = tempMax ?? Temp_Max ?? null;
    const HMin = humMin ?? Hum_Min ?? null;
    const HMax = humMax ?? Hum_Max ?? null;

    if (TMin === null || TMax === null || HMin === null || HMax === null) {
      return res.status(400).json({ error: "Faltan valores de límites" });
    }

    await pool.query(
      `INSERT INTO "Limite_Sensor" ("Id_Sensor", "Temp_Min", "Temp_Max", "Hum_Min", "Hum_Max")
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT ("Id_Sensor") DO UPDATE SET
         "Temp_Min" = EXCLUDED."Temp_Min",
         "Temp_Max" = EXCLUDED."Temp_Max",
         "Hum_Min"  = EXCLUDED."Hum_Min",
         "Hum_Max"  = EXCLUDED."Hum_Max"`,
      [Id_Sensor, TMin, TMax, HMin, HMax]
    );

    return res.status(200).json({ mensaje: "Límites guardados correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar límites:", error);
    return res.status(500).json({ error: "Error al guardar límites" });
  }
};

export const obtenerLimitesSensor = async (req, res) => {
  try {
    const { Id_Sensor } = req.params;

    const result = await pool.query(
      `SELECT "Temp_Min", "Temp_Max", "Hum_Min", "Hum_Max"
       FROM "Limite_Sensor"
       WHERE "Id_Sensor" = $1`,
      [Id_Sensor]
    );

    if (!result.rows[0]) return res.status(200).json(null);

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener límites:", error);
    return res.status(500).json({ error: "Error al obtener límites" });
  }
};

// ===============================
// FUNCIÓN PARA ENVIAR ALERTAS
// ===============================
export const enviarAlertaLimite = async (correo, tipo, valor, minimo, maximo) => {
  try {
    const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: correo,
      subject: `⚠️ Alerta de ${tipo} fuera de rango`,
      html: `
        <h2>Alerta de ${tipo}</h2>
        <p>El valor actual es <strong>${valor}</strong></p>
        <p>Rango permitido: <strong>${minimo}</strong> - <strong>${maximo}</strong></p>
        <p>Por favor revisa tu lote.</p>
      `,
    };

    console.log("🚀 ENVIANDO ALERTA A:", correo);
    await transporter.sendMail(mailOptions);
    console.log("📧 Alerta enviada correctamente");
  } catch (error) {
    console.error("❌ Error al enviar alerta:", error);
  }
};