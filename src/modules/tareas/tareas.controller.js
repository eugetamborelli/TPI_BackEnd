import { 
    getTareaById, 
    createTarea, 
    updateTarea, 
    deleteTarea, 
    buscarTareas, 
} from "./tareas.model.js";
import ResponseService from "../../common/services/response.service.js";
import { ESTADOS_VALIDOS, PRIORIDADES_VALIDAS, AREAS_VALIDAS } from "./tareas.utils.js";

class TareasController {
    // *** Vistas ***

    renderDashboard = (req, res) => {
        res.render("tareas/dashboard", {
            titulo: "Gestión de Tareas",
        });
    };

    renderNuevaTarea = (req, res) => {
        try {
            res.render("tareas/nuevaTarea", {
                titulo: "Alta de Nueva Tarea",
                estados: ESTADOS_VALIDOS,
                prioridades: PRIORIDADES_VALIDAS,
                areas: AREAS_VALIDAS,
                error: req.query.error || null,
                formData: req.query
            });
        } catch (error) {
            console.error("Error al cargar formulario de alta:", error);
            res.status(500).redirect("/tareas?error=Error al cargar el formulario de alta.");
        }
    };

    renderEditarTarea = async (req, res) => {
        const tareaId = req.params.id; 

        try {
            const tarea = await getTareaById(tareaId); 
            
            if (!tarea) {
                return res.status(404).redirect("/tareas/listado?error=Tarea no encontrada.");
            }
            
            res.render("tareas/editarTarea", {
                titulo: `Editar Tarea #${tarea._id}`, 
                tarea,
                estados: ESTADOS_VALIDOS,
                prioridades: PRIORIDADES_VALIDAS,
                areas: AREAS_VALIDAS,
                error: null,
                formData: {}
            });

        } catch (error) {
            console.error("Error al cargar tarea para edición:", error);
            res.status(500).redirect("/tareas/listado?error=Error al cargar la tarea para edición.");
        }
    };

    renderListarTareas = async (req, res) => {
        let tareas = [];
        let error = null;
        let busqueda = req.query || {};

        try {            
            tareas = await buscarTareas(busqueda);
            
            res.render("tareas/listarTareas", {
                titulo: "Listado y Búsqueda de Tareas",
                tareas,
                estados: ESTADOS_VALIDOS,
                prioridades: PRIORIDADES_VALIDAS,
                areas: AREAS_VALIDAS,
                error: req.query.error || null,
                busqueda,
                successMsg: req.query.msg || null
            });

        } catch (e) {
            console.error("Error en renderListarTareas:", e);
            res.status(500).render("tareas/listarTareas", {
                titulo: "Error en el Listado",
                tareas: [],
                error: "Error al cargar las tareas: " + e.message,
                busqueda: {},
                estados: ESTADOS_VALIDOS,
                prioridades: PRIORIDADES_VALIDAS,
                areas: AREAS_VALIDAS,
                successMsg: null
            });
        }
    };

    addTarea = async (req, res) => {
        try {
            const nuevaTarea = await createTarea(req.body); 
            
            res.redirect(`/tareas/listado?msg=Tarea%20${nuevaTarea._id}%20creada%20con%20éxito.`);
            
        } catch (error) {
            console.error("Error al crear tarea:", error);
            
            let errorMessage = error.message;

            if (error.name === 'ValidationError') {
                errorMessage = Object.values(error.errors).map(val => val.message).join(' | ');
            }

            res.status(400).render("tareas/nuevaTarea", {
                titulo: "Alta de Nueva Tarea",
                estados: ESTADOS_VALIDOS,
                prioridades: PRIORIDADES_VALIDAS,
                areas: AREAS_VALIDAS,
                error: errorMessage,
                formData: req.body
            });
        }
    };

    editTarea = async (req, res) => {
        const tareaId = req.params.id;
        try {
            const tareaActualizada = await updateTarea(tareaId, req.body);
            
            if (!tareaActualizada) {
                return res.status(404).redirect(`/tareas/listado?error=Tarea ${tareaId} no encontrada para actualizar.`);
            }

            return res.redirect(`/tareas/listado?msg=Tarea%20${tareaActualizada._id}%20actualizada%20con%20éxito.`);

        } catch (error) {
            console.error("Error al editar tarea:", error);
            
            let errorMessage = error.message;
            if (error.name === 'ValidationError') {
                errorMessage = Object.values(error.errors).map(val => val.message).join(' | ');
            }

            // Intentar obtener la tarea original, pero manejar errores si falla
            let tareaOriginal = null;
            try {
                tareaOriginal = await getTareaById(tareaId);
            } catch (getError) {
                console.error("Error al obtener tarea original para edición:", getError);
                // Si no se puede obtener, usar null y el formData como fallback
            }

            return res.status(400).render("tareas/editarTarea", {
                titulo: `Editar Tarea #${tareaId}`,
                tarea: tareaOriginal || { _id: tareaId, ...req.body }, 
                estados: ESTADOS_VALIDOS,
                prioridades: PRIORIDADES_VALIDAS,
                areas: AREAS_VALIDAS,
                error: errorMessage,
                formData: req.body 
            });
        }
    };

    removeTarea = async (req, res) => {
        const tareaId = req.params.id; 
        try {
            const wasDeleted = await deleteTarea(tareaId);

            if (wasDeleted) {
                return res.redirect(`/tareas/listado?msg=Tarea%20${tareaId}%20eliminada%20con%20éxito.`);
            } else {
                return res.status(404).redirect(`/tareas/listado?error=Tarea ${tareaId} no encontrada para eliminar.`);
            }
        } catch (error) {
            console.error("Error al eliminar tarea:", error);
            return res.status(500).redirect(`/tareas/listado?error=Error al intentar eliminar la tarea: ${error.message}`);
        }
    };

    // *** Filtros API ***

    getTareas = async (req, res) => {
        try {
            const tareas = await buscarTareas(req.query);
            ResponseService.success(res, tareas);
        } catch (error) {
            console.error("Error en getTareas API:", error);
            ResponseService.serverError(res, "Error al obtener las tareas.");
        }
    };
    
    getTarea = async (req, res) => {
        try {
            const tarea = await getTareaById(req.params.id);
            if (!tarea) return ResponseService.notFound(res, "Tarea no encontrada.");
            ResponseService.success(res, tarea);
        } catch (error) {
            console.error("Error en getTarea API:", error);
            ResponseService.serverError(res, "Error al obtener la tarea por ID.");
        }
    };

    create = async (req, res) => {
        try {
            const nuevaTarea = await createTarea(req.body);
            ResponseService.success(res, nuevaTarea, 201);
        } catch (error) {
            let message = error.message;
            if (error.name === 'ValidationError') {
                message = Object.values(error.errors).map(val => val.message).join(' | ');
            }
            ResponseService.badRequest(res, message);
        }
    };

    update = async (req, res) => {
        try {
            const updatedTarea = await updateTarea(req.params.id, req.body);
            if (!updatedTarea) return ResponseService.notFound(res, "Tarea no encontrada para actualizar.");
            ResponseService.success(res, updatedTarea);
        } catch (error) {
            let message = error.message;
            if (error.name === 'ValidationError') {
                message = Object.values(error.errors).map(val => val.message).join(' | ');
            }
            ResponseService.badRequest(res, message);
        }
    };

    delete = async (req, res) => {
        try {
            const wasDeleted = await deleteTarea(req.params.id);
            if (!wasDeleted) return ResponseService.notFound(res, "Tarea no encontrada para eliminar.");
            // 204 No Content no debe tener cuerpo en la respuesta
            return res.status(204).send();
        } catch (error) {
            console.error("Error en delete API:", error);
            ResponseService.serverError(res, `Error al eliminar la tarea: ${error.message}`);
        }
    };
    

    getTareasByFecha = async (req, res) => {
        try {
            const tareas = await buscarTareas(req.query);
            
            if (tareas.length === 0) {
                return ResponseService.success(res, { 
                    message: "No hay tareas en este rango",
                    data: []
                });
            }
            
            ResponseService.success(res, tareas);
        } catch (error) {
            console.error("Error en getTareasByFecha:", error);
            ResponseService.serverError(res, "Error al filtrar por fecha");
        }
    };
}

export default new TareasController();