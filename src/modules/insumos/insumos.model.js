// src/modules/insumos/insumos.model.js
import { readInsumosFile, writeInsumosFile, getNextId } from "./insumos.utils.js";

class InsumosModel {
  #all() { return readInsumosFile(); }
  #save(data) { writeInsumosFile(data); }

  getAll() { return this.#all(); }

  getById(id) {
    return this.#all().find(i => i.id === Number(id));
  }

  create(payload) {
    const data = this.#all();

    // Campos requeridos mínimos
    const required = ["nombre", "categoria", "unidad"];
    for (const k of required) if (!payload[k]) throw new Error(`Falta campo: ${k}`);

    // SKU/código opcional único (si lo enviás)
    if (payload.codigo) {
      const existeCodigo = data.some(i => String(i.codigo).toLowerCase() === String(payload.codigo).toLowerCase());
      if (existeCodigo) throw new Error("Código ya existente");
    }

    // ID autoincremental (ignoramos id manual para evitar conflictos)
    const id = getNextId(data);
    const now = new Date().toISOString();

    const nuevo = {
      id,
      nombre: payload.nombre,
      categoria: payload.categoria,      // ej: "descartables", "farmacia", "limpieza"
      unidad: payload.unidad,            // ej: "un", "caja", "ml", "g"
      stock: Number(payload.stock ?? 0), // cantidad en stock actual
      puntoReposicion: Number(payload.puntoReposicion ?? 0), // alerta bajo stock
      proveedor: payload.proveedor ?? null,
      codigo: payload.codigo ?? null,    // SKU interno opcional
      costoUnitario: payload.costoUnitario != null ? Number(payload.costoUnitario) : null,
      createdAt: now,
      updatedAt: now,
    };

    data.push(nuevo);
    this.#save(data);
    return nuevo;
  }

  update(id, patch) {
    const data = this.#all();
    const idx = data.findIndex(i => i.id === Number(id));
    if (idx === -1) return null;

    // No permitir cambiar id/createdAt
    const { id: _ignoreId, createdAt: _ignoreCreatedAt, ...rest } = patch;

    // Si cambian código/SKU, validar unicidad
    if (rest.codigo) {
      const existeOtro = data.some((i, j) =>
        j !== idx && String(i.codigo).toLowerCase() === String(rest.codigo).toLowerCase()
      );
      if (existeOtro) {
        // señalamos conflicto
        return { __conflict__: "Código ya existente" };
      }
    }

    // Normalizaciones numéricas
    if (rest.stock != null) rest.stock = Number(rest.stock);
    if (rest.puntoReposicion != null) rest.puntoReposicion = Number(rest.puntoReposicion);
    if (rest.costoUnitario != null) rest.costoUnitario = Number(rest.costoUnitario);

    data[idx] = { ...data[idx], ...rest, updatedAt: new Date().toISOString() };
    this.#save(data);
    return data[idx];
  }

  remove(id) {
    const data = this.#all();
    const after = data.filter(i => i.id !== Number(id));
    const borrado = after.length !== data.length;
    if (borrado) this.#save(after);
    return borrado;
  }

  // --- Filtros ---
  filterByCategoria(categoria) {
    const norm = s => s?.toString().toLowerCase();
    return this.#all().filter(i => norm(i.categoria) === norm(categoria));
  }

  filterByProveedor(proveedor) {
    const norm = s => s?.toString().toLowerCase();
    return this.#all().filter(i => norm(i.proveedor) === norm(proveedor));
  }

  filterBajoStock() {
    return this.#all().filter(i =>
      Number.isFinite(i.puntoReposicion) &&
      Number.isFinite(i.stock) &&
      i.stock <= i.puntoReposicion
    );
  }

  // --- Movimientos ---
  ingreso(id, cantidad) {
    const data = this.#all();
    const idx = data.findIndex(i => i.id === Number(id));
    if (idx === -1) return null;

    const qty = Number(cantidad);
    if (!Number.isFinite(qty) || qty <= 0) return { __badqty__: true };

    data[idx].stock = Number(data[idx].stock ?? 0) + qty;
    data[idx].updatedAt = new Date().toISOString();
    this.#save(data);
    return data[idx];
  }

  egreso(id, cantidad) {
    const data = this.#all();
    const idx = data.findIndex(i => i.id === Number(id));
    if (idx === -1) return null;

    const qty = Number(cantidad);
    if (!Number.isFinite(qty) || qty <= 0) return { __badqty__: true };

    const actual = Number(data[idx].stock ?? 0);
    if (actual - qty < 0) return { __nostock__: true };

    data[idx].stock = actual - qty;
    data[idx].updatedAt = new Date().toISOString();
    this.#save(data);
    return data[idx];
  }
}

export default InsumosModel;
