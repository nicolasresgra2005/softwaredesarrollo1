import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const JWT_SECRET = "Nicolas1912";

// 🟩 REGISTRAR USUARIO
export const registerUser = async (req, res) => {
  try {
    const { Primer_Nombre_U, Primer_Apellido_U, Correo_Electronico_U, Contraseña_U } = req.body;

    if (!Primer_Nombre_U || !Primer_Apellido_U || !Correo_Electronico_U || !Contraseña_U) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
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
      return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
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
