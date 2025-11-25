import ResponseService from '../services/response.service.js';
import { ValidationError } from '../errors/validation.error.js';

class BaseController {
    constructor(model) {
        if (new.target === BaseController) {
            throw new Error("BaseController es una clase abstracta y no puede ser instanciada directamente");
        }
        this.model = model;
    }

    // **** METODOS API *** 

    getAll = async (req, res) => {
        try {
            const data = await this.model.getAll();
            ResponseService.success(res, data);
        } catch (error) {
            ResponseService.serverError(res, "Error al obtener registros");
        }
    };

    getById = async (req, res) => {
        try {
            const item = await this.model.getById(req.params.id);
            if (!item) {
                return ResponseService.notFound(res, "Registro no encontrado");
            }
            ResponseService.success(res, item);
        } catch (error) {
            ResponseService.serverError(res, "Error al obtener registro");
        }
    };

    create = async (req, res) => {
        try {
            const newItem = await this.model.create(req.body);
            ResponseService.created(res, newItem);
        } catch (error) {
            if (error instanceof ValidationError) {
                ResponseService.badRequest(res, error.message);
            } else {
                ResponseService.serverError(res, "Error al crear registro");
            }
        }
    };

    update = async (req, res) => {
        try {
            const updatedItem = await this.model.update(req.params.id, req.body);
            if (!updatedItem) {
                return ResponseService.notFound(res, "Registro no encontrado");
            }
            ResponseService.success(res, updatedItem);
        } catch (error) {
            if (error instanceof ValidationError) {
                ResponseService.badRequest(res, error.message);
            } else {
                ResponseService.serverError(res, "Error al crear registro");
            }
        }
    };

    delete = async (req, res) => {
        try {
            const deleted = await this.model.delete(req.params.id);
            if (!deleted) {
                return ResponseService.notFound(res, "Registro no encontrado");
            }
            ResponseService.deleted(res, "Registro eliminado correctamente");
        } catch (error) {
            ResponseService.serverError(res, "Error al eliminar registro");
        }
    };

    createFilterHandler = (field, paramName = field) => {
        return async (req, res) => {
            try {
                const value = req.params[paramName];
                const filteredData = await this.model.filterBy(field, value);
                ResponseService.success(res, filteredData);
            } catch (error) {
                ResponseService.serverError(res, `Error al filtrar por ${field}`);
            }
        };
    };

        // **** METODOS PARA RENDERIZAR *** 
        
        renderAll = async (req, res, viewName, extraData = {}) => {
        try {
            const data = await this.model.getAll();
            res.render(viewName, { data, ...extraData });
        } catch (error) {
            res.render(viewName, { error: error.message, ...extraData });
        }
    };

    renderById = async (req, res, viewName, extraData = {}) => {
        try {
            const item = await this.model.getById(req.params.id);
            if (!item) return res.render(viewName, { error: "Registro no encontrado", ...extraData });
            res.render(viewName, { item, ...extraData });
        } catch (error) {
            res.render(viewName, { error: error.message, ...extraData });
        }
    };

    //manejo de errores de validación
    _handleError(error, res, defaultMessage) {
        const validationKeywords = ["obligatorio", "inválido", "debe ser", "deben ser", "existe"];
        if (validationKeywords.some(keyword => error.message.includes(keyword))) {
            return ResponseService.badRequest(res, error.message);
        }
        return ResponseService.serverError(res, defaultMessage);
    }
}

export default BaseController;