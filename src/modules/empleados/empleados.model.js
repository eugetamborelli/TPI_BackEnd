import EmpleadoMongooseModel from "./empleados.schema.js";
import { hashPassword } from "../auth/password.utils.js"; // Para hashear

const normalizeDni = (dni) => String(dni);

const cleanPassword = (empleadoDoc) => {
    if (!empleadoDoc) return null;
    const empleado = empleadoDoc.toObject ? empleadoDoc.toObject() : empleadoDoc;
    const { password, ...empleadoLimpio } = empleado;
    return empleadoLimpio;
};

// Lógica de Validación de Negocio

const validateUniqueDni = async (dni, excludeId = null) => {
    if (!dni) return;

    const dniNormalizado = normalizeDni(dni);

    const query = { dni: dniNormalizado };
    if (excludeId) {
        query._id = { $ne: excludeId };
    }

    const existing = await EmpleadoMongooseModel.findOne(query).lean();
    if (existing) {
        throw new Error("Ya existe un empleado con ese DNI");
    }
};

// CRUD

export const getEmpleadoById = async (id) => {
    try {
        const empleado = await EmpleadoMongooseModel.findById(id).lean();
        return cleanPassword(empleado);
    } catch {
        return null;
    }
};

export const getEmpleadoByDni = async (dni) => {
    const dniNormalizado = normalizeDni(dni);
    const empleado = await EmpleadoMongooseModel.findOne({ dni: dniNormalizado }).lean();
    return cleanPassword(empleado);
};

export const createEmpleado = async (empleadoData) => {
    const payload = { ...empleadoData };

    payload.dni = normalizeDni(payload.dni);

    await validateUniqueDni(payload.dni);

    if (payload.password) {
        payload.password = await hashPassword(payload.password);
    }

    const nuevo = await EmpleadoMongooseModel.create(payload);
    return cleanPassword(nuevo);
};

export const updateEmpleado = async (id, patchData) => {
    const existing = await EmpleadoMongooseModel.findById(id);
    if (!existing) return null;

    const payload = { ...patchData };

    if (payload.dni !== undefined) {
        payload.dni = normalizeDni(payload.dni);
        await validateUniqueDni(payload.dni, id);
    }

    if (payload.password) {
        payload.password = await hashPassword(payload.password);
    }
    

    const updated = await EmpleadoMongooseModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    return cleanPassword(updated);
};

export const deleteEmpleado = async (id) => {
    const result = await EmpleadoMongooseModel.findByIdAndDelete(id);
    return !!result;
};

// Búsqueda y Filtros

export const buscarEmpleados = async (filtros = {}) => {
    const { dni, rol } = filtros;
    const query = {};

    const dniTrim = dni ? String(dni).trim() : "";
    const rolTrim = rol ? String(rol).trim() : "";

    if (dniTrim) {
        query.dni = dniTrim;
    } else if (rolTrim) {
        query.rol = rolTrim;
    }

    const empleados = await EmpleadoMongooseModel.find(query).lean();
    return empleados.map(cleanPassword);
};

// ------- Clase para compatibilidad con Auth (export default) ------- TODO ELIMINAR
export default class EmpleadosModel {
  async getById(id) {
    const doc = await EmpleadoMongooseModel.findById(id).lean();
    return doc;
  }

  async getByDni(dni) {
    const dniNormalizado = normalizeDni(dni);
    const doc = await EmpleadoMongooseModel.findOne({
      dni: dniNormalizado,
    }).lean();
    return doc;
  }

  async findBy(field, value) {
    const query = { [field]: value };
    const docs = await EmpleadoMongooseModel.find(query).lean();
    return docs;
  }

  async create(data) {
    return await EmpleadoMongooseModel.create(data);
  }

  async update(id, patch) {
    return await EmpleadoMongooseModel.findByIdAndUpdate(id, patch, {
      new: true,
      runValidators: true,
    });
  }

  async remove(id) {
    const result = await EmpleadoMongooseModel.findByIdAndDelete(id);
    return !!result;
  }

  async delete(id) {
    return this.remove(id);
  }

  async filterByRol(rol) {
    return await EmpleadoMongooseModel.find({ rol }).lean();
  }

  async filterByArea(area) {
    return await EmpleadoMongooseModel.find({ area }).lean();
  }
}