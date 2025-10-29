import { Router } from "express";
import healthRoutes from "../modules/health/health.routes.js";
import pacientesRoutes from "../modules/pacientes/pacientes.routes.js";
import tareaRoutes from "../modules/tareas/tareas.routes.js";
import empleadosRouter from "../modules/empleados/empleados.routes.js";
import insumosRouter from "../modules/insumos/insumos.routes.js";

const router = Router();

// Index
router.get("/", (req, res) => {
  res.render("index");
});

router.use("/health", healthRoutes);
router.use("/pacientes", pacientesRoutes);
router.use("/tareas", tareaRoutes);
router.use("/empleados", empleadosRouter);
router.use("/insumos", insumosRouter);

export default router;
