import BaseController from "../../common/base/base.controller.js";
import ResponseService from "../../common/services/response.service.js";
import TareasModel from "./tareas.model.js";
import EmpleadoModel from "../empleados/empleados.model.js";
import { ESTADOS_VALIDOS, PRIORIDADES_VALIDAS, AREAS_VALIDAS } from "./tareas.utils.js";

const model = new TareasModel();
const empleadoModel = new EmpleadoModel();

class TareasController extends BaseController {
    constructor() {
        super(model);
    }

    // --- Vistas ---

    renderDashboard = (req, res) => {
        res.render("tareas/dashboard", {
            titulo: "Gestión de Tareas",
        });
    };

    renderNuevaTarea = async (req, res) => {
        try {
            
            res.render("tareas/nuevaTarea", {
                titulo: "Alta de Nueva Tarea",
                estados: ESTADOS_VALIDOS,
                prioridades: PRIORIDADES_VALIDAS,
                areas: AREAS_VALIDAS,
                error: null,
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
            const tarea = await model.getById(Number(tareaId));
            
            if (!tarea) {
                return res.status(404).redirect("/tareas/listado?error=Tarea no encontrada.");
            }
            
            res.render("tareas/editarTarea", {
                titulo: `Editar Tarea #${tarea.id}`,
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
            tareas = await model.buscar(busqueda);
            
            res.render("tareas/listarTareas", {
                titulo: "Listado y Búsqueda de Tareas",
                tareas,
                estados: ESTADOS_VALIDOS,
                prioridades: PRIORIDADES_VALIDAS,
                areas: AREAS_VALIDAS,
                error,
                busqueda 
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
            });
        }
    };

    addTarea = async (req, res) => {
        try {
            const nuevaTarea = await model.create(req.body); 
            
            res.redirect(`/tareas/listado?msg=Tarea%20${nuevaTarea.id}%20creada%20con%20éxito.`);
            
        } catch (error) {
            console.error("Error al crear tarea:", error);
            
            res.status(400).render("tareas/nuevaTarea", {
                titulo: "Alta de Nueva Tarea",
                estados: ESTADOS_VALIDOS,
                prioridades: PRIORIDADES_VALIDAS,
                areas: AREAS_VALIDAS,
                areas: AREAS_VALIDAS,
                error: error.message,
                formData: req.body
            });
        }
    };

    editTarea = async (req, res) => {
        const tareaId = req.params.id;
        
        try {
            const tareaActualizada = await model.update(Number(tareaId), req.body);

            res.redirect(`/tareas/listado?msg=Tarea%20${tareaActualizada.id}%20actualizada%20con%20éxito.`);

        } catch (error) {
            console.error("Error al editar tarea:", error);
            
            const tareaOriginal = await model.getById(Number(tareaId));

            res.status(400).render("tareas/editarTarea", {
                titulo: `Editar Tarea #${tareaId}`,
                tarea: tareaOriginal, 
                estados: ESTADOS_VALIDOS,
                prioridades: PRIORIDADES_VALIDAS,
                areas: AREAS_VALIDAS,
                error: error.message,
                formData: req.body 
            });
        }
    };

    removeTarea = this.delete;

    // --- Filtros API ---

    getTareas = this.getAll;
    getTarea = this.getById;
    addTarea = this.create;
    editTarea = this.update;
    removeTarea = this.delete;

    getTareasByEstado = this.createFilterHandler('estado', 'estado');
    getTareasByPrioridad = this.createFilterHandler('prioridad', 'prioridad');
    getTareasByEmpleado = this.createFilterHandler('empleadoId', 'empleadoId');
    getTareasByPaciente = this.createFilterHandler('pacienteId', 'pacienteId');

    getTareasByFecha = (req, res) => {
        try {
            const { inicio, fin, tipo = 'inicio' } = req.query;
            const tareas = model.filtrarPorFecha(inicio, fin, tipo);
            
            if (tareas.length === 0) {
                return ResponseService.success(res, { 
                    message: "No hay tareas en este rango",
                    data: []
                });
            }
            
            ResponseService.success(res, tareas);
        } catch (error) {
            ResponseService.serverError(res, "Error al filtrar por fecha");
        }
    };
}

export default new TareasController();