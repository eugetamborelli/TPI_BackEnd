import BaseController from "../../common/base/base.controller.js";
import ResponseService from "../../common/services/response.service.js";
import EmpleadosModel from "./empleados.model.js";

const model = new EmpleadosModel();

class EmpleadosController extends BaseController {
  constructor() {
    super(model);
  }

  getEmpleados = this.getAll;
  getEmpleado = this.getById;
  addEmpleado = this.create;
  removeEmpleado = this.delete;

  editEmpleado = (req, res) => {
    try {
      const { id } = req.params;
      let empleado;

      if (!isNaN(id)) {
        empleado = model.getById(Number(id));
        if (!empleado) {
          empleado = model.getByDni(id);
        }
      } else {
        empleado = model.getByDni(id);
      }

      if (!empleado) {
        return ResponseService.notFound(res, "Empleado no encontrado");
      }

      const updatedEmpleado = model.update(empleado.id, req.body);
      if (!updatedEmpleado) {
        return ResponseService.conflict(res, "DNI en uso");
      }
      
      ResponseService.success(res, updatedEmpleado);
    } catch (err) {
      if (err.message.includes("DNI") || err.message.includes("obligatorio")) {
        ResponseService.badRequest(res, err.message);
      } else {
        ResponseService.serverError(res, "Error al actualizar empleado");
      }
    }
  };

  getEmpleadosByRol = this.createFilterHandler('rol', 'rol');
  getEmpleadosByArea = this.createFilterHandler('area', 'area');

  getEmpleadoByDni = (req, res) => {
    try {
      const { dni } = req.params;
      const empleado = model.getByDni(dni);
      if (!empleado) {
        return ResponseService.notFound(res, "Empleado no encontrado");
      }
      ResponseService.success(res, empleado);
    } catch (err) {
      ResponseService.serverError(res, "Error al obtener empleado");
    }
  };
}

export default new EmpleadosController(); 
