import { Router } from "express";
import historiaClinicaController from "./historiaClinica.controller.js";

const router = Router();

// Vistas
router.get("/", historiaClinicaController.renderDashboard);
router.get("/buscarHistoria", historiaClinicaController.buscarHistoria);
router.get("/nuevaHistoria", historiaClinicaController.renderNuevaHistoria);
router.get("/editar/:id", historiaClinicaController.renderEditarHistoria);

// CRUD
router.post("/", historiaClinicaController.create);
router.post("/:id", historiaClinicaController.update);
router.post("/eliminar/:id", historiaClinicaController.delete);

export default router;