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

const router = Router();

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