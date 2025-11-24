import BaseModel from "../../common/base/base.model.js";
import ValidationService from "../../common/services/validation.service.js";
import { hashPassword } from "../auth/password.utils.js";
import { isEmpleadoEmail } from "../auth/email-domain.utils.js";

class EmpleadosModel extends BaseModel {
  constructor() {
    super("empleados");
  }

  // Helper privado para normalizar DNI
  _normalizeDni(dni) {
    return String(dni);
  }

  // Helper privado para validar DNI único
  async _validateUniqueDni(dni, excludeId = null) {
    if (!dni) return;

    const empleados = await this.getAll();
    const dniNormalizado = this._normalizeDni(dni);
    const existing = empleados.find(e =>
      this._normalizeDni(e.dni) === dniNormalizado &&
      (!excludeId || e.id !== excludeId)
    );

    if (existing) {
      throw new Error("Ya existe un empleado con ese DNI");
    }
  }

  validateData(empleado, isUpdate = false) {
    const requiredFields = ['nombre', 'apellido', 'dni', 'rol', 'area'];
    ValidationService.validateRequiredFields(empleado, requiredFields, isUpdate);

    ValidationService.validateDni(empleado.dni);

    // Validar email si se proporciona
    ValidationService.validateEmail(empleado.email);

    // Validar que el email tenga dominio corporativo (regla de negocio)
    if (empleado.email && !isEmpleadoEmail(empleado.email)) {
      throw new Error("Los empleados deben tener email con dominio corporativo (ej: @saludintegral.com)");
    }

    // Validar password si se proporciona
    if (empleado.password !== undefined) {
      if (typeof empleado.password !== 'string' || empleado.password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }
    }
  }

  // Helper privado para eliminar la contraseña del objeto que retorna
    _cleanPassword(empleado) {
        if (!empleado) return null;
        const { password, ...empleadoLimpio } = empleado;
        return empleadoLimpio;
    }

  // *** CRUD ***
  async create(empleado) {
    await this._validateUniqueDni(empleado.dni);

    // Hashear password si se proporciona
    if (empleado.password) {
      empleado.password = await hashPassword(empleado.password);
    }

    const nuevoEmpleado = await super.create(empleado);
    return this._cleanPassword(nuevoEmpleado);
  }

  async update(id, patch) {
    const empleado = await this.getById(id);
    if (!empleado) return null;

    if (patch.dni !== undefined) {
      this._validateUniqueDni(patch.dni, id);
    }

    // Hashear password si se proporciona en el update
    if (patch.password) {
      patch.password = await hashPassword(patch.password);
    }

    const empleadoActualizado = await super.update(id, patch);
    return this._cleanPassword(empleadoActualizado);
  }

  async remove(id) { 
    return this.delete(id); 
  }

  async filterByRol(rol) {
    const empleados = await super.filterBy('rol', rol);
    return empleados.map(this._cleanPassword);
  }

  async filterByArea(area) {
    const empleados = await super.filterBy('area', area);
    return empleados.map(this._cleanPassword);
  }

  async getByDni(dni) {
    const empleado = await super.findBy('dni', String(dni))[0] || null;
    return this._cleanPassword(empleado);
  }

  async getById(id) {
    const empleado = await super.getById(id);
    return this._cleanPassword(empleado);
  }
}

export default EmpleadosModel;