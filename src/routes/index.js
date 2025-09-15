import { Router } from "express";
import healthRoutes from "../modules/health/health.routes.js";

const router = Router();

router.use("/health", healthRoutes);
// router.use("/turnos", turnoRoutes);

export default router;