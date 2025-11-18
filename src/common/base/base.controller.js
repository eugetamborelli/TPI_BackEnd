import ResponseService from '../services/response.service.js';

class BaseController {
    constructor(model) {
        if (new.target === BaseController) {
            throw new Error("BaseController es una clase abstracta y no puede ser instanciada directamente");
        }
        this.model = model;
    }

    getAll = (req, res) => {
        try {
            const data = this.model.getAll();
            ResponseService.success(res, data);
        } catch (error) {
            ResponseService.serverError(res, "Error al obtener registros");
        }
    };

    getById = (req, res) => {
        try {
            const item = this.model.getById(req.params.id);
            if (!item) {
                return ResponseService.notFound(res, "Registro no encontrado");
            }
            ResponseService.success(res, item);
        } catch (error) {
            ResponseService.serverError(res, "Error al obtener registro");
        }
    };

    create = (req, res) => {
        try {
            const newItem = this.model.create(req.body);
            ResponseService.created(res, newItem);
        } catch (error) {
            if (error.message.includes("obligatorio") || 
                error.message.includes("inválido") ||
                error.message.includes("debe ser")) {
                ResponseService.badRequest(res, error.message);
            } else {
                ResponseService.serverError(res, "Error al crear registro");
            }
        }
    };

    update = (req, res) => {
        try {
            const updatedItem = this.model.update(req.params.id, req.body);
            if (!updatedItem) {
                return ResponseService.notFound(res, "Registro no encontrado");
            }
            ResponseService.success(res, updatedItem);
        } catch (error) {
            if (error.message.includes("obligatorio") || 
                error.message.includes("inválido") ||
                error.message.includes("debe ser")) {
                ResponseService.badRequest(res, error.message);
            } else {
                ResponseService.serverError(res, "Error al actualizar registro");
            }
        }
    };

    delete = (req, res) => {
        try {
            const deleted = this.model.delete(req.params.id);
            if (!deleted) {
                return ResponseService.notFound(res, "Registro no encontrado");
            }
            ResponseService.deleted(res, "Registro eliminado correctamente");
        } catch (error) {
            ResponseService.serverError(res, "Error al eliminar registro");
        }
    };

    createFilterHandler = (field, paramName = field) => {
        return (req, res) => {
            try {
                const value = req.params[paramName];
                const filteredData = this.model.filterBy(field, value);
                ResponseService.success(res, filteredData);
            } catch (error) {
                ResponseService.serverError(res, `Error al filtrar por ${field}`);
            }
        };
    };
}

export default BaseController;