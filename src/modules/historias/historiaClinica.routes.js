import { Router } from "express";
import historiaClinicaController from "./historiaClinica.controller.js";
//import { authenticate, requireEmpleado } from "../auth/auth.middleware.js";

const router = Router();

// Todas las rutas de historias clínicas requieren autenticación y que el usuario sea empleado
//router.use(authenticate, requireEmpleado);

// Vistas
router.get("/", historiaClinicaController.renderDashboard);
router.get("/buscarHistoria", historiaClinicaController.buscarHistoria);
router.get("/nuevaHistoria", historiaClinicaController.renderNuevaHistoria);
router.get("/editarHistoria", historiaClinicaController.renderEditarHistoria);
// CRUD
router.post("/guardar", historiaClinicaController.guardarHistoria);

export default router;