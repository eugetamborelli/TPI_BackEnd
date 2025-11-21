import BaseModel from "../../common/base/base.model.js";
import ValidationService from "../../common/services/validation.service.js";
import { normalizeDate, isDateInRange } from "./empleados.utils.js";
import { hashPassword } from "../auth/password.utils.js";
import { isEmpleadoEmail, validateEmailForUserType } from "../auth/email-domain.utils.js";

class EmpleadosModel extends BaseModel {
  constructor() {
    super("empleados");
  }

  // Helper privado para normalizar DNI
  _normalizeDni(dni) {
    return String(dni);
  }

  // Helper privado para validar DNI único
  _validateUniqueDni(dni, excludeId = null) {
    if (!dni) return;

    const empleados = this.getAll();
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

  async create(empleado) {
    // Validar DNI único antes de crear
    this._validateUniqueDni(empleado.dni);

    // Hashear password si se proporciona
    if (empleado.password) {
      empleado.password = await hashPassword(empleado.password);
    }

    return super.create(empleado);
  }

  async update(id, patch) {
    const empleado = this.getById(id);
    if (!empleado) return null;

    // Validar DNI único si se está actualizando
    if (patch.dni !== undefined) {
      this._validateUniqueDni(patch.dni, id);
    }

    // Hashear password si se proporciona en el update
    if (patch.password) {
      patch.password = await hashPassword(patch.password);
    }

    return super.update(id, patch);
  }

  filterByRol(rol) {
    return this.filterBy('rol', rol);
  }

  filterByArea(area) {
    return this.filterBy('area', area);
  }

  getByDni(dni) {
    return this.findBy('dni', String(dni))[0] || null;
  }

  remove(id) { return this.delete(id); }
}

export default EmpleadosModel;