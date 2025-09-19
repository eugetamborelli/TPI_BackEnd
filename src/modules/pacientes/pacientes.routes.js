import { Router } from "express";
import {
    getPacientes,
    getPaciente,
    addPaciente,
    updatePaciente,
    deletePaciente
} from "./pacientes.controller.js";

const router = Router();

router.get("/", getPacientes);
router.get("/:dni", getPaciente);
router.post("/", addPaciente);
router.patch("/:dni", updatePaciente);
router.delete("/:dni", deletePaciente);

export default router;