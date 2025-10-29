import { Router } from "express";
import {
  renderDashboard,
  renderNuevoEmpleado,
  renderEditarEmpleado,
  getEmpleadosListado,
  addEmpleado,
  updateEmpleado,
  deleteEmpleado
} from "./empleados.controller.js";

const router = Router();

// Vistas + CRUD (orden específico; NADA de "/:id" aquí)
router.get("/", renderDashboard);
router.get("/listado", getEmpleadosListado);
router.get("/nuevo-empleado", renderNuevoEmpleado);
router.post("/nuevo-empleado", addEmpleado);
router.get("/editar/:id", renderEditarEmpleado);
router.patch("/editar/:id", updateEmpleado);
router.delete("/:id", deleteEmpleado);

export default router;
