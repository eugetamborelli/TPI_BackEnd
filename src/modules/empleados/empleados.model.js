import { readEmpleadosFile, writeEmpleadosFile, getNextId } from "./empleados.utils.js";

class EmpleadosModel {
  #all() { return readEmpleadosFile(); }
  #save(data) { writeEmpleadosFile(data); }

  getAll() { return this.#all(); }

  getById(id) {
    return this.#all().find((e) => e.id === Number(id));
  }

  create(empleado) {
    const empleados = this.#all();

    const id = empleado.id != null ? Number(empleado.id) : getNextId(empleados);
    if (!Number.isFinite(id)) return null;

    const dni = String(empleado.dni ?? "");
    const idYaExiste = empleados.some((e) => e.id === id);
    const dniYaExiste = dni ? empleados.some((e) => String(e.dni) === dni) : false;
    if (idYaExiste || dniYaExiste) return null;

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

    const { id: _ignoreId, createdAt: _ignoreCreatedAt, ...rest } = patch;

    if (rest.dni != null) {
      const nuevoDni = String(rest.dni);
      const existeOtro = empleados.some((e, i) => i !== index && String(e.dni) === nuevoDni);
      if (existeOtro) return null;
    }

    empleados[index] = { ...empleados[index], ...rest, updatedAt: new Date().toISOString() };
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

  // Filtros
  filterByRol(rol) {
    return this.#all().filter((e) => (e.rol || "").toLowerCase() === rol.toLowerCase());
  }
  filterByArea(area) {
    return this.#all().filter((e) => (e.area || "").toLowerCase() === area.toLowerCase());
  }
  getByDni(dni) {
    return this.#all().find((e) => String(e.dni) === String(dni));
  }
}

export default EmpleadosModel;       