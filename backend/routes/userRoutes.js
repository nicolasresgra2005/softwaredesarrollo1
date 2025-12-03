import express from "express";
import { 
  registerUser, 
  loginUser, 
  recuperarContraseña, 
  solicitarResetPassword, 
  resetPassword, 
  agregarSensor, 
  eliminarSensor, 
  obtenerSensores,
  obtenerSensorPorId,
  obtenerDatosSensor,
  actualizarLimitesSensor,
  obtenerLimitesSensor 
} from "../controllers/userController.js";

const router = express.Router();

// ========================
// 🔐 RUTAS DE AUTENTICACIÓN
// ========================

// Registrar usuario
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Recuperar contraseña (envía email si existe)
router.post("/recuperar", recuperarContraseña);

// Solicitar reset de contraseña
router.post("/solicitar-reset", solicitarResetPassword);

// Resetear contraseña con token
router.post("/reset-password/:token", resetPassword);


// ========================
// 📡 RUTAS DE SENSORES
// ========================

// Agregar sensor
router.post("/sensores/agregar", agregarSensor);

// Eliminar sensor por IP
router.delete("/sensores/eliminar/:Ip_Sensor", eliminarSensor);

// Obtener todos los sensores de un usuario
router.get("/sensores/:Id_Usuario", obtenerSensores);

// Obtener información detallada de un sensor
router.get("/sensores/detalle/:Id_Sensor", obtenerSensorPorId);

// Obtener historial (tabla Datos_Sensor)
router.get("/sensores/datos/:Id_Sensor", obtenerDatosSensor);

// Guardar / actualizar límites del sensor
router.post("/sensores/limites/:Id_Sensor", actualizarLimitesSensor);

// Obtener límites de un sensor
router.get("/sensores/limites/:Id_Sensor", obtenerLimitesSensor);

// ========================
// RUTA DE PRUEBA
// ========================
router.get("/test", (req, res) => {
  res.send("✅ Ruta de usuarios funcionando");
});

export default router;