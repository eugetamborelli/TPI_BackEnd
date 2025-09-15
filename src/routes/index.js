import { Router } from "express";
import healthRoutes from "../modules/health/health.routes.js";
import tareaRoutes from "../modules/tareas/tareas.routes.js"
import empleadosRouter from "../modules/empleados/empleados.routes.js";

const router = Router();

router.use("/health", healthRoutes);
// router.use("/turnos", turnoRoutes);
router.use("/tareas", tareaRoutes);
router.use("/empleados", empleadosRouter);

export default router;
