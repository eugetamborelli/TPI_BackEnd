import BaseController from "../../common/base/base.controller.js";
import ResponseService from "../../common/services/response.service.js";
import TareasModel from "./tareas.model.js";

const model = new TareasModel();

class TareasController extends BaseController {
    constructor() {
        super(model);
    }

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

