import { Router } from "express";
import healthRoutes from "../modules/health/health.routes.js";
<<<<<<< HEAD
import tareaRoutes from "../modules/tareas/tareas.routes.js";
import medicosRoutes from "../modules/medicos/medicos.router.js";

=======
import tareaRoutes from "../modules/tareas/tareas.routes.js"
>>>>>>> 8f92813 (add tarea module)

const router = Router();

router.use("/health", healthRoutes);
// router.use("/turnos", turnoRoutes);
router.use("/tareas", tareaRoutes);
<<<<<<< HEAD

router.use("/medicos", medicosRoutes);
=======
>>>>>>> 8f92813 (add tarea module)

export default router;
