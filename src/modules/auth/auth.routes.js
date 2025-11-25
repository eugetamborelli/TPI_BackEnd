import { Router } from "express";
import authController from "./auth.controller.js";
import { authenticate } from "./auth.middleware.js";

const router = Router();

//Vista a completar para renderizado
//router.get("/login", authController.renderLogin);

router.post("/login", authController.login);
router.get("/verify", authenticate, authController.verify);

export default router;

