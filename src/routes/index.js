import { Router } from "express";
import healthRoutes from "../modules/health/health.routes.js";
import pacientesRoutes from "../modules/pacientes/pacientes.routes.js";

const router = Router();

router.use("/health", healthRoutes);
// router.use("/turnos", turnoRoutes);
router.use("/pacientes", pacientesRoutes);

export default router;
