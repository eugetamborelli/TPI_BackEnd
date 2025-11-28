import { Router } from "express";
import pacientesController from "./pacientes.controller.js";
//import { authenticate, requireEmpleado } from "../auth/auth.middleware.js";

const router = Router();

// Todas las rutas de pacientes requieren autenticación y que el usuario sea empleado
//router.use(authenticate, requireEmpleado);

//Vistas
router.get("/", pacientesController.renderDashboard);
router.get("/listado", pacientesController.getPacientesListado);
router.get("/nuevo-paciente", pacientesController.renderNuevoPaciente)

//CRUD
router.get("/editar/:id", pacientesController.renderEditarPaciente);
router.post("/nuevo-paciente", pacientesController.addPaciente);
router.patch("/:id", pacientesController.updatePaciente);
router.delete("/:id", pacientesController.deletePaciente);

export default router;