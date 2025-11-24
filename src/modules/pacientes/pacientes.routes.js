import { Router } from "express";
import pacientesController from "./pacientes.controller.js";
//import { authenticate, requireEmpleado } from "../auth/auth.middleware.js";

const router = Router();

// Todas las rutas de pacientes requieren autenticación y que el usuario sea empleado
//router.use(authenticate, requireEmpleado);

//Vistas
router.get("/", pacientesController.renderDashboard);
router.get("/nuevo-paciente", pacientesController.renderNuevoPaciente)
router.get("/editar/:dni", pacientesController.renderEditarPaciente);

//CRUD
router.get("/listado", pacientesController.getPacientesListado);
router.post("/nuevo-paciente", pacientesController.addPaciente);
router.patch("/editar/:dni", pacientesController.updatePaciente);
router.delete("/:dni", pacientesController.deletePaciente);

export default router;