import { Router } from "express";
import historiaClinicaController from "./historiaClinica.controller.js";
import { authenticate, requireEmpleado } from "../auth/auth.middleware.js";

const router = Router();

// Todas las rutas de historias clínicas requieren autenticación y que el usuario sea empleado
// Los pacientes no deberían poder ver historias clínicas directamente, solo a través de turnos
router.use(authenticate, requireEmpleado);

// Rutas principales
router.get("/", historiaClinicaController.getHistorias);
router.get("/paciente/:pacienteId", historiaClinicaController.getHistoriaByPaciente);
router.get("/paciente/:pacienteId/todas", historiaClinicaController.getHistoriasByPaciente);
router.get("/:id", historiaClinicaController.getHistoria);
router.post("/", historiaClinicaController.addHistoria);
router.patch("/:id", historiaClinicaController.editHistoria);
router.delete("/:id", historiaClinicaController.removeHistoria);

export default router;

