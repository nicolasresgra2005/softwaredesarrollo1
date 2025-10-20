// controllers/userController.js
import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Registro de usuario
export const registerUser = async (req, res) => {
  try {
    const { Primer_Nombre_U, Primer_Apellido_U, Correo_Electronico_U, Contraseña_U } = req.body;

    // Validar campos
    if (!Primer_Nombre_U || !Primer_Apellido_U || !Correo_Electronico_U || !Contraseña_U) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar si el correo ya existe
    const existingUser = await pool.query(
      "SELECT * FROM Usuario WHERE Correo_Electronico_U = $1",
      [Correo_Electronico_U]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(Contraseña_U, 10);

    // Insertar usuario
    await pool.query(
      `INSERT INTO Usuario (Primer_Nombre_U, Primer_Apellido_U, Correo_Electronico_U, Contraseña_U)
       VALUES ($1, $2, $3, $4)`,
      [Primer_Nombre_U, Primer_Apellido_U, Correo_Electronico_U, hashedPassword]
    );

    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// ✅ Login de usuario
export const loginUser = async (req, res) => {
  try {
    const { Correo_Electronico_U, Contraseña_U } = req.body;

    const user = await pool.query(
      "SELECT * FROM Usuario WHERE Correo_Electronico_U = $1",
      [Correo_Electronico_U]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const validPassword = await bcrypt.compare(Contraseña_U, user.rows[0].contraseña_u);
    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Crear token
    const token = jwt.sign(
      { id: user.rows[0].id_usuario, correo: user.rows[0].correo_electronico_u },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login exitoso", token });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
