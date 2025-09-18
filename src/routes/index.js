import { Router } from "express";
import healthRoutes from "../modules/health/health.routes.js";
import tareaRoutes from "../modules/tareas/tareas.routes.js";
import medicosRoutes from "../modules/medicos/medicos.router.js";


const router = Router();

router.use("/health", healthRoutes);
// router.use("/turnos", turnoRoutes);
router.use("/tareas", tareaRoutes);

router.use("/medicos", medicosRoutes);

export default router;
