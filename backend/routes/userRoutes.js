import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ Ruta de prueba
router.get("/test", (req, res) => {
  res.send("✅ Ruta de usuarios funcionando");
});

export default router;


