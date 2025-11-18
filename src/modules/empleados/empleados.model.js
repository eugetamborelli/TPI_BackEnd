import BaseModel from "../../common/base/base.model.js";
import ValidationService from "../../common/services/validation.service.js";
import { normalizeDate, isDateInRange } from "./empleados.utils.js";
import { hashPassword } from "../auth/password.utils.js";
import { isEmpleadoEmail, validateEmailForUserType } from "../auth/email-domain.utils.js";

class EmpleadosModel extends BaseModel {
  constructor() {
    super("empleados");
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

    if (empleado.dni) {
      const existing = this.getByDni(empleado.dni);
      if (existing && (!isUpdate || existing.id !== empleado.id)) {
        throw new Error("Ya existe un empleado con ese DNI");
      }
    }

    // Validar password si se proporciona
    if (empleado.password !== undefined) {
      if (typeof empleado.password !== 'string' || empleado.password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }
    } else if (!isUpdate) {
      // Password es opcional, pero recomendado al crear
      // No lanzamos error, solo validamos si se proporciona
    }
  }

  async create(empleado) {
    const empleados = this.getAll();
    
    const dni = String(empleado.dni ?? "");
    const dniYaExiste = dni ? empleados.some((e) => String(e.dni) === dni) : false;
    if (dniYaExiste) {
      throw new Error("DNI ya existente");
    }

    // Hashear password si se proporciona
    if (empleado.password) {
      empleado.password = await hashPassword(empleado.password);
    }

    return super.create(empleado);
  }

  async update(id, patch) {
    const empleados = this.getAll();
    const index = empleados.findIndex((e) => e.id === Number(id));
    if (index === -1) return null;

    if (patch.dni != null) {
      const nuevoDni = String(patch.dni);
      const existeOtro = empleados.some((e, i) => i !== index && String(e.dni) === nuevoDni);
      if (existeOtro) {
        throw new Error("DNI ya existente");
      }
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