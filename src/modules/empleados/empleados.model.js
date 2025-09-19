// src/modules/empleados/empleados.model.js
import { readEmpleadosFile, writeEmpleadosFile } from "./empleados.utils.js";

class EmpleadosModel {
  // === helpers privados ===
  #all() {
    return readEmpleadosFile();
  }

  #save(data) {
    writeEmpleadosFile(data);
  }

  // === API pública del modelo ===
  getAll() {
    return this.#all();
  }

  getById(id) {
    const empleados = this.#all();
    return empleados.find((e) => e.id === Number(id));
  }

  create(empleado) {
    const empleados = this.#all();

    // 1) Tomar ID manual si viene; si no, generar uno
    const id = empleado.id != null ? Number(empleado.id) : Date.now();
    if (!Number.isFinite(id)) return null;

    // 2) Validar unicidad de id (y opcionalmente de dni)
    const dni = String(empleado.dni ?? "");
    const idYaExiste = empleados.some((e) => e.id === id);
    const dniYaExiste = dni ? empleados.some((e) => String(e.dni) === dni) : false;
    if (idYaExiste || dniYaExiste) return null; // conflicto -> que lo maneje el controller

    // 3) Timestamps
    const now = new Date().toISOString();

    const nuevo = {
      id,
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      dni,
      rol: empleado.rol,
      area: empleado.area,
      createdAt: now,
      updatedAt: now,
    };

    empleados.push(nuevo);
    this.#save(empleados);
    return nuevo;
  }

  update(id, patch) {
    const empleados = this.#all();
    const index = empleados.findIndex((e) => e.id === Number(id));
    if (index === -1) return null;

    // No permitir cambiar id ni createdAt desde el patch
    const { id: _ignoreId, createdAt: _ignoreCreatedAt, ...rest } = patch;

    // Si cambia el DNI, verificar unicidad
    if (rest.dni != null) {
      const nuevoDni = String(rest.dni);
      const existeOtroConMismoDni = empleados.some(
        (e, i) => i !== index && String(e.dni) === nuevoDni
      );
      if (existeOtroConMismoDni) return null;
    }

    empleados[index] = {
      ...empleados[index],
      ...rest,
      updatedAt: new Date().toISOString(),
    };

    this.#save(empleados);
    return empleados[index];
  }

  remove(id) {
    const empleados = this.#all();
    const after = empleados.filter((e) => e.id !== Number(id));
    const borrado = after.length !== empleados.length;
    this.#save(after);
    return borrado; 
  }

  // === Filtros ===
  filterByRol(rol) {
    const empleados = this.#all();
    return empleados.filter((e) => (e.rol || "").toLowerCase() === rol.toLowerCase());
  }

  filterByArea(area) {
    const empleados = this.#all();
    return empleados.filter((e) => (e.area || "").toLowerCase() === area.toLowerCase());
  }
}

export default EmpleadosModel;           
export const empleadosModel = new EmpleadosModel(); 
