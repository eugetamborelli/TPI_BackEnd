import BaseModel from "../../common/base/base.model.js";
import ValidationService from "../../common/services/validation.service.js";
import { normalizeDate, isDateInRange } from "./empleados.utils.js";

class EmpleadosModel extends BaseModel {
  constructor() {
    super("empleados");
  }

  validateData(empleado, isUpdate = false) {
    const requiredFields = ['nombre', 'apellido', 'dni', 'rol', 'area'];
    ValidationService.validateRequiredFields(empleado, requiredFields, isUpdate);

    ValidationService.validateDni(empleado.dni);

    if (empleado.dni) {
      const existing = this.getByDni(empleado.dni);
      if (existing && (!isUpdate || existing.id !== empleado.id)) {
        throw new Error("Ya existe un empleado con ese DNI");
      }
    }
  }

  create(empleado) {
    const empleados = this.getAll();
    
    const dni = String(empleado.dni ?? "");
    const dniYaExiste = dni ? empleados.some((e) => String(e.dni) === dni) : false;
    if (dniYaExiste) {
      throw new Error("DNI ya existente");
    }

    return super.create(empleado);
  }

  update(id, patch) {
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