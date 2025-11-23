import { Router } from "express";
import {
    renderDashboard,
    renderNuevoPaciente,
    renderEditarPaciente,
    getPacientesListado,
    addPaciente,
    updatePaciente,
    deletePaciente
} from "./pacientes.controller.js";
//import { authenticate, requireEmpleado } from "../auth/auth.middleware.js";

const router = Router();

// Todas las rutas de pacientes requieren autenticación y que el usuario sea empleado
//router.use(authenticate, requireEmpleado);

//Vistas
router.get("/", renderDashboard);
router.get("/nuevo-paciente", renderNuevoPaciente)
router.get("/editar/:dni", renderEditarPaciente);

//CRUD
router.get("/listado", getPacientesListado);
router.post("/nuevo-paciente", addPaciente);
router.patch("/editar/:dni", updatePaciente);
router.delete("/:dni", deletePaciente);

export default router;