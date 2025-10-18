// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Carga las variables del archivo .env

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ruta base para probar el servidor
app.get("/", (req, res) => {
  res.send("✅ Servidor backend funcionando correctamente!");
});

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
