import { Router } from "express";
import {
    getTareas,
    getTarea,
    addTarea,
    editTarea,
    removeTarea,
    getTareasByEstado,
    getTareasByPrioridad,
    getTareasByEmpleado,
    getTareasByPaciente,
    getTareasByFecha,
} from "./tareas.controller.js";

const router = Router();

router.get("/fecha", getTareasByFecha);
router.get("/estado/:estado", getTareasByEstado);
router.get("/prioridad/:prioridad", getTareasByPrioridad);
router.get("/empleado/:empleadoId", getTareasByEmpleado);
router.get("/paciente/:pacienteId", getTareasByPaciente);

router.get("/", getTareas);
router.get("/:id", getTarea);
router.post("/", addTarea);
router.put("/:id", editTarea);
router.delete("/:id", removeTarea);

export default router;
