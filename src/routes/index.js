import { Router } from "express";
import healthRoutes from "../modules/health/health.routes.js";
import tareaRoutes from "../modules/tareas/tareas.routes.js"

const router = Router();

router.use("/health", healthRoutes);
// router.use("/turnos", turnoRoutes);
router.use("/tareas", tareaRoutes);

export default router;
