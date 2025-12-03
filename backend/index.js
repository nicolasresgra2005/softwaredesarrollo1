// /backend/index.js
import dotenv from "dotenv";
dotenv.config(); // carga las variables primero

import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import pool from "./config/db.js";

// 🔥 IMPORTANTE: importar el monitor de alertas
import startMonitor from "./jobs/monitor.js";

// 🔥 MOSTRAR ERRORES OCULTOS (NECESARIO)
process.on("uncaughtException", (err) => {
  console.error("❌ ERROR NO CONTROLADO:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ PROMESA RECHAZADA:", reason);
});

const app = express();
app.use(cors());
app.use(express.json());

// 🟩 Middleware para ver TODO lo que llega del frontend
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);

  // solo loguear body si es POST / PUT / PATCH
  if (req.method !== "GET") {
    console.log("📥 Body recibido:", req.body);
  }

  next();
});

// endpoint de prueba
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

// 🔥 INICIAR MONITOR DE ALERTAS PARA LOS SENSORES
if (process.env.NODE_ENV === "development") {
  startMonitor();
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
);