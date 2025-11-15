// /backend/index.js
import dotenv from "dotenv";
dotenv.config(); // carga las variables primero

import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import pool from "./config/db.js"; // importa el pool (usa DATABASE_URL o variables)

const app = express();
app.use(cors());
app.use(express.json());

// endpoint de prueba rápido
app.get("/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error en /test:", err);
    res.status(500).json({ error: "Error en la BD" });
  }
});

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
