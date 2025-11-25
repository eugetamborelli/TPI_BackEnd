import { Router } from "express";
import tareasController from "./tareas.controller.js";
import {
    validarCuerpoNoVacio,
    validarId
} from "./tareas.middleware.js";

const router = Router();

// *** Vistas ***
router.get("/", tareasController.renderDashboard); 
router.get("/listado", tareasController.renderListarTareas); 
router.get("/nuevaTarea", tareasController.renderNuevaTarea);
router.get("/editar/:id", validarId, tareasController.renderEditarTarea);

// *** CRUD ***
router.post("/",
    validarCuerpoNoVacio,
    tareasController.addTarea
);
router.post("/:id",
    validarId,
    validarCuerpoNoVacio,
    tareasController.editTarea 
);
router.post("/eliminar/:id", validarId, tareasController.removeTarea);

// *** Filtros ***
router.get("/api/tareas", tareasController.getTareas); 
router.get("/api/tareas/:id", validarId, tareasController.getTarea);
router.post("/api/tareas", validarCuerpoNoVacio, tareasController.create);

export default router;