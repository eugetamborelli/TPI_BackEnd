import BaseController from "../../common/base/base.controller.js";
import ResponseService from "../../common/services/response.service.js";
import DataService from "../../common/services/data.service.js";
import EmpleadosModel from "./empleados.model.js";

const model = new EmpleadosModel();

class EmpleadosController extends BaseController {
  constructor() {
    super(model);
  }

  // Helper privado para manejar errores de validación
  _handleValidationError(error, res, defaultMessage) {
    const validationKeywords = ["obligatorio", "inválido", "debe ser", "DNI", "contraseña"];
    if (validationKeywords.some(keyword => error.message.includes(keyword))) {
      return ResponseService.badRequest(res, error.message);
    }
    return ResponseService.serverError(res, defaultMessage);
  }

  getEmpleados = (req, res) => {
    try {
      const empleados = model.getAll();
      ResponseService.success(res, DataService.removeSensitiveFields(empleados));
    } catch (error) {
      ResponseService.serverError(res, "Error al obtener empleados");
    }
  };

  getEmpleado = (req, res) => {
    try {
      const empleado = model.getById(req.params.id);
      if (!empleado) {
        return ResponseService.notFound(res, "Empleado no encontrado");
      }
      ResponseService.success(res, DataService.removeSensitiveFields(empleado));
    } catch (error) {
      ResponseService.serverError(res, "Error al obtener empleado");
    }
  };

  removeEmpleado = this.delete;

  addEmpleado = async (req, res) => {
    try {
      const newEmpleado = await model.create(req.body);
      ResponseService.created(res, DataService.removeSensitiveFields(newEmpleado));
    } catch (error) {
      this._handleValidationError(error, res, "Error al crear empleado");
    }
  };

  editEmpleado = async (req, res) => {
    try {
      const { id } = req.params;
      const empleado = DataService.findByIdOrField(
        id, 
        (id) => model.getById(id), 
        (dni) => model.getByDni(dni)
      );

      if (!empleado) {
        return ResponseService.notFound(res, "Empleado no encontrado");
      }

      const updatedEmpleado = await model.update(empleado.id, req.body);
      if (!updatedEmpleado) {
        return ResponseService.conflict(res, "DNI en uso");
      }
      
      ResponseService.success(res, DataService.removeSensitiveFields(updatedEmpleado));
    } catch (error) {
      this._handleValidationError(error, res, "Error al actualizar empleado");
    }
  };

  getEmpleadosByRol = (req, res) => {
    try {
      const { rol } = req.params;
      const empleados = model.filterByRol(rol);
      ResponseService.success(res, DataService.removeSensitiveFields(empleados));
    } catch (error) {
      ResponseService.serverError(res, "Error al filtrar empleados por rol");
    }
  };

  getEmpleadosByArea = (req, res) => {
    try {
      const { area } = req.params;
      const empleados = model.filterByArea(area);
      ResponseService.success(res, DataService.removeSensitiveFields(empleados));
    } catch (error) {
      ResponseService.serverError(res, "Error al filtrar empleados por área");
    }
  };

  getEmpleadoByDni = (req, res) => {
    try {
      const { dni } = req.params;
      const empleado = model.getByDni(dni);
      if (!empleado) {
        return ResponseService.notFound(res, "Empleado no encontrado");
      }
      ResponseService.success(res, DataService.removeSensitiveFields(empleado));
    } catch (error) {
      ResponseService.serverError(res, "Error al obtener empleado");
    }
  };
}

export default new EmpleadosController(); 
