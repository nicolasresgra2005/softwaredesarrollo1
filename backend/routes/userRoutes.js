import express from "express";
import { 
  registerUser, 
  loginUser, 
  recuperarContraseña, 
  solicitarResetPassword, 
  resetPassword, 
  agregarSensor, 
  eliminarSensor, 
  obtenerSensores 
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/recuperar", recuperarContraseña);
router.post("/solicitar-reset", solicitarResetPassword);
router.post("/reset-password/:token", resetPassword);

// 🔥 RUTAS CORRECTAS PARA LOS SENSORES
router.post("/sensores/agregar", agregarSensor);
router.delete("/sensores/eliminar/:Id_Sensor", eliminarSensor);
router.get("/sensores/:Id_Usuario", obtenerSensores);

// Ruta de prueba
router.get("/test", (req, res) => {
  res.send("✅ Ruta de usuarios funcionando");
});

export default router;