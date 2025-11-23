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
//import { authenticate, requireEmpleado } from "../auth/auth.middleware.js";

const router = Router();

// Todas las rutas de empleados requieren autenticación y ser empleado
//router.use(authenticate, requireEmpleado);

// Vistas + CRUD
router.get("/", renderDashboard);
router.get("/listado", getEmpleadosListado);
router.get("/nuevo-empleado", renderNuevoEmpleado);
router.post("/nuevo-empleado", addEmpleado);
router.get("/editar/:id", renderEditarEmpleado);
router.patch("/editar/:id", updateEmpleado);
router.delete("/:id", deleteEmpleado);

export default router;
