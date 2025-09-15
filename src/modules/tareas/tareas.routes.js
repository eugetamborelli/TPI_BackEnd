import { Router } from "express";
import tareasController from "./tareas.controller.js";
import {
    validarCuerpoNoVacio,
    validarId,
    validarCamposObligatorios,
    validarEstado,
    validarPrioridad
} from "./tareas.middleware.js";

const router = Router();

router.get("/fecha", tareasController.getTareasByFecha);
router.get("/estado/:estado", tareasController.getTareasByEstado);
router.get("/prioridad/:prioridad", tareasController.getTareasByPrioridad);
router.get("/empleado/:empleadoId", tareasController.getTareasByEmpleado);
router.get("/paciente/:pacienteId", tareasController.getTareasByPaciente);

router.get("/", tareasController.getTareas);
router.get("/:id", validarId, tareasController.getTarea);
router.post("/",
    validarCuerpoNoVacio,
    validarCamposObligatorios,
    validarEstado,
    validarPrioridad,
    tareasController.addTarea
);
router.put("/:id",
    validarId,
    validarCuerpoNoVacio,
    validarEstado,
    validarPrioridad,
    tareasController.editTarea
);
router.delete("/:id", validarId, tareasController.removeTarea);

export default router;
