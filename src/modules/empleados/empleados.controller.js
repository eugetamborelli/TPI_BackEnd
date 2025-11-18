import BaseController from "../../common/base/base.controller.js";
import ResponseService from "../../common/services/response.service.js";
import EmpleadosModel from "./empleados.model.js";

const model = new EmpleadosModel();

class EmpleadosController extends BaseController {
  constructor() {
    super(model);
  }
<<<<<<< HEAD

  getEmpleados = (req, res) => {
    try {
      const empleados = model.getAll();
      // No devolver password en las respuestas
      const empleadosSinPassword = empleados.map(({ password, ...rest }) => rest);
      ResponseService.success(res, empleadosSinPassword);
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
      // No devolver password en la respuesta
      const { password, ...empleadoSinPassword } = empleado;
      ResponseService.success(res, empleadoSinPassword);
    } catch (error) {
      ResponseService.serverError(res, "Error al obtener empleado");
    }
  };
  removeEmpleado = this.delete;

  addEmpleado = async (req, res) => {
    try {
      const newEmpleado = await model.create(req.body);
      // No devolver password en la respuesta
      const { password, ...empleadoSinPassword } = newEmpleado;
      ResponseService.created(res, empleadoSinPassword);
    } catch (error) {
      if (error.message.includes("obligatorio") || 
          error.message.includes("inválido") ||
          error.message.includes("debe ser") ||
          error.message.includes("DNI") ||
          error.message.includes("contraseña")) {
        ResponseService.badRequest(res, error.message);
      } else {
        ResponseService.serverError(res, "Error al crear empleado");
      }
    }
  };
=======

  getEmpleados = this.getAll;
  getEmpleado = this.getById;
  addEmpleado = this.create;
  removeEmpleado = this.delete;
>>>>>>> betaniagonzalez@refactortotal

  editEmpleado = async (req, res) => {
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

<<<<<<< HEAD
      const updatedEmpleado = await model.update(empleado.id, req.body);
=======
      const updatedEmpleado = model.update(empleado.id, req.body);
>>>>>>> betaniagonzalez@refactortotal
      if (!updatedEmpleado) {
        return ResponseService.conflict(res, "DNI en uso");
      }
      
<<<<<<< HEAD
      // No devolver password en la respuesta
      const { password, ...empleadoSinPassword } = updatedEmpleado;
      ResponseService.success(res, empleadoSinPassword);
    } catch (err) {
      if (err.message.includes("DNI") || 
          err.message.includes("obligatorio") ||
          err.message.includes("contraseña")) {
=======
      ResponseService.success(res, updatedEmpleado);
    } catch (err) {
      if (err.message.includes("DNI") || err.message.includes("obligatorio")) {
>>>>>>> betaniagonzalez@refactortotal
        ResponseService.badRequest(res, err.message);
      } else {
        ResponseService.serverError(res, "Error al actualizar empleado");
      }
    }
  };

<<<<<<< HEAD
  getEmpleadosByRol = (req, res) => {
    try {
      const { rol } = req.params;
      const empleados = model.filterByRol(rol);
      // No devolver password en las respuestas
      const empleadosSinPassword = empleados.map(({ password, ...rest }) => rest);
      ResponseService.success(res, empleadosSinPassword);
    } catch (error) {
      ResponseService.serverError(res, "Error al filtrar empleados por rol");
    }
  };

  getEmpleadosByArea = (req, res) => {
    try {
      const { area } = req.params;
      const empleados = model.filterByArea(area);
      // No devolver password en las respuestas
      const empleadosSinPassword = empleados.map(({ password, ...rest }) => rest);
      ResponseService.success(res, empleadosSinPassword);
    } catch (error) {
      ResponseService.serverError(res, "Error al filtrar empleados por área");
    }
  };
=======
  getEmpleadosByRol = this.createFilterHandler('rol', 'rol');
  getEmpleadosByArea = this.createFilterHandler('area', 'area');
>>>>>>> betaniagonzalez@refactortotal

  getEmpleadoByDni = (req, res) => {
    try {
      const { dni } = req.params;
      const empleado = model.getByDni(dni);
      if (!empleado) {
        return ResponseService.notFound(res, "Empleado no encontrado");
      }
<<<<<<< HEAD
      // No devolver password en la respuesta
      const { password, ...empleadoSinPassword } = empleado;
      ResponseService.success(res, empleadoSinPassword);
=======
      ResponseService.success(res, empleado);
>>>>>>> betaniagonzalez@refactortotal
    } catch (err) {
      ResponseService.serverError(res, "Error al obtener empleado");
    }
  };
}

export default new EmpleadosController(); 
