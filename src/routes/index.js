import { Router } from "express";
import healthRoutes from "../modules/health/health.routes.js";
<<<<<<< HEAD
<<<<<<< HEAD
import tareaRoutes from "../modules/tareas/tareas.routes.js";
import medicosRoutes from "../modules/medicos/medicos.router.js";

=======
import tareaRoutes from "../modules/tareas/tareas.routes.js"
>>>>>>> 8f92813 (add tarea module)
=======
import tareaRoutes from "../modules/tareas/tareas.routes.js";
import medicosRoutes from "../modules/medicos/medicos.router.js";

>>>>>>> 4fb4bba (integración con rama de cambios index y app)

const router = Router();

router.use("/health", healthRoutes);
// router.use("/turnos", turnoRoutes);
router.use("/tareas", tareaRoutes);
<<<<<<< HEAD

router.use("/medicos", medicosRoutes);
=======
>>>>>>> 8f92813 (add tarea module)

router.use("/medicos", medicosRoutes);

export default router;
