import { Router } from "express";
import {
    getMedicos,
    getMedico,
    addMedico,
    editMedico,
    removeMedico
} from "./medicos.controller.js";

const router = Router();

// Endpoints CRUD
router.get("/", getMedicos);           // Obtener todos los médicos
router.get("/:id", getMedico);         // Obtener médico por ID
router.post("/", addMedico);           // Crear nuevo médico
router.put("/:id", editMedico);        // Actualizar médico existente
router.delete("/:id", removeMedico);   // Eliminar médico

export default router;
