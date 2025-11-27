import { Router } from "express";
import EmpleadosController from "./empleados.controller.js";
//import { authenticate, requireEmpleado } from "../auth/auth.middleware.js";

const router = Router();

// Todas las rutas de empleados requieren autenticación y ser empleado
//router.use(authenticate, requireEmpleado);

// Vistas + CRUD
router.get("/", EmpleadosController.renderDashboard);
router.get("/listado", EmpleadosController.getEmpleadosListado);
router.get("/nuevoEmpleado", EmpleadosController.renderNuevoEmpleado);
router.post("/nuevoEmpleado", EmpleadosController.addEmpleado);
router.get("/editar/:id", EmpleadosController.renderEditarEmpleado);
router.patch("/editar/:id", EmpleadosController.updateEmpleado);
router.delete("/:id", EmpleadosController.deleteEmpleado);

export default router;