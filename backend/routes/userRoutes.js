import express from "express";
import { registerUser, loginUser, recuperarContraseña, solicitarResetPassword, resetPassword, agregarSensor, eliminarSensor, obtenerSensores } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/recuperar", recuperarContraseña);
router.post("/solicitar-reset", solicitarResetPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/usuarios/:id/agregar-sensor", agregarSensor);
router.delete("/usuarios/:id/eliminar-sensor/:sensorId", eliminarSensor);
router.get("/sensores/:idUsuario", obtenerSensores);


// ✅ Ruta de prueba
router.get("/test", (req, res) => {
  res.send("✅ Ruta de usuarios funcionando");
});

export default router;


