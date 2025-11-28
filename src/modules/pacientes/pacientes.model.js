import PacienteMongooseModel from "./pacientes.schema.js";
import ValidationService from "../../common/services/validation.service.js";

const normalizeDni = (dni) => String(dni).trim();

const cleanPassword = (pacienteDoc) => {
  if (!pacienteDoc) return null;
  const paciente = pacienteDoc.toObject ? pacienteDoc.toObject() : pacienteDoc;
  const { password, ...pacienteLimpio } = paciente;
  return pacienteLimpio;
};

const validateUniqueDni = async (dni, excludeId = null) => {
  if (!dni) return;

  const dniNormalizado = normalizeDni(dni);

  const query = { dni: dniNormalizado };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const existing = await PacienteMongooseModel.findOne(query).lean();
  if (existing) {
    throw new Error(`Ya existe un paciente con el DNI ${dni}`);
  }
};

const validateData = (paciente, isUpdate = false) => {
  const requiredFields = ["nombre", "apellido", "dni", "fechaNacimiento", "telefono"];
  ValidationService.validateRequiredFields(paciente, requiredFields, isUpdate);

  ValidationService.validateDni(paciente.dni);
  
  if (paciente.fechaNacimiento) {
    ValidationService.validateDate(paciente.fechaNacimiento, false);
  }
  
  if (paciente.email) {
    ValidationService.validateEmail(paciente.email);
  }
  
  if (paciente.telefono) {
    ValidationService.validatePhone(paciente.telefono);
  }

  if (paciente.fechaAlta && paciente.fechaNacimiento) {
    const nacimiento = new Date(paciente.fechaNacimiento);
    const alta = new Date(paciente.fechaAlta);
    if (alta < nacimiento) {
      throw new Error("La fecha de alta no puede ser anterior a la fecha de nacimiento");
    }
  }
};

// *** CRUD ***

export const getPacienteById = async (id) => {
  try {
    // Si es un número, buscar por el campo 'pacienteId' numérico
    if (typeof id === 'number' || /^\d+$/.test(String(id))) {
      const paciente = await PacienteMongooseModel.findOne({ pacienteId: Number(id) }).lean();
      return cleanPassword(paciente);
    }
    // Si es un ObjectId, buscar por _id
    const paciente = await PacienteMongooseModel.findById(id).lean();
    return cleanPassword(paciente);
  } catch {
    return null;
  }
};

export const getPacienteByDni = async (dni) => {
  const dniNormalizado = normalizeDni(dni);
  const paciente = await PacienteMongooseModel.findOne({
    dni: dniNormalizado,
  }).lean();
  
  if (!paciente) {
    throw new Error(`Paciente con DNI ${dni} no encontrado`);
  }
  
  return cleanPassword(paciente);
};

export const getAllPacientes = async () => {
  const pacientes = await PacienteMongooseModel.find({}).lean();
  return pacientes.map(cleanPassword);
};

export const createPaciente = async (pacienteData) => {
  const payload = { ...pacienteData };

  // Normalizar campos
  payload.dni = normalizeDni(payload.dni);
  payload.email = payload.email ? payload.email.trim().toLowerCase() : "";
  payload.direccion = payload.direccion || "";
  payload.obraSocial = payload.obraSocial || "";
  payload.fechaAlta = payload.fechaAlta || "";
  payload.historiaClinicaId = payload.historiaClinicaId || null;

  await validateUniqueDni(payload.dni);
  validateData(payload, false);

  const nuevo = await PacienteMongooseModel.create(payload);
  return cleanPassword(nuevo);
};

export const updatePaciente = async (id, patchData) => {
  const existing = await PacienteMongooseModel.findById(id);
  if (!existing) return null;

  const payload = { ...patchData };

  if (payload.dni !== undefined) {
    payload.dni = normalizeDni(payload.dni);
    await validateUniqueDni(payload.dni, id);
  }

  if (payload.email) {
    payload.email = payload.email.trim().toLowerCase();
  }

  const toValidate = {
    ...existing.toObject(),
    ...payload,
  };
  validateData(toValidate, true);

  const updated = await PacienteMongooseModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return cleanPassword(updated);
};

export const deletePaciente = async (id) => {
  const result = await PacienteMongooseModel.findByIdAndDelete(id);
  return !!result;
};

export const buscarPacientes = async (filtros = {}) => {
  const { dni, email } = filtros;
  const query = {};

  if (dni) {
    query.dni = normalizeDni(dni);
  }
  
  if (email) {
    query.email = email.trim().toLowerCase();
  }

  const pacientes = await PacienteMongooseModel.find(query).lean();
  return pacientes.map(cleanPassword);
};

// ------- Clase para compatibilidad con Auth y otros módulos (export default) -------
export default class Paciente {
  async getAll() {
    return await getAllPacientes();
  }

  async getById(id) {
    // Buscar por pacienteId numérico o por _id de MongoDB
    let paciente;
    if (typeof id === 'number' || /^\d+$/.test(String(id))) {
      // Si es un número, buscar por el campo 'pacienteId' numérico
      paciente = await PacienteMongooseModel.findOne({ pacienteId: Number(id) }).lean();
    } else {
      // Si es un ObjectId, buscar por _id
      paciente = await getPacienteById(id);
    }
    
    if (!paciente) return null;
    
    return cleanPassword(paciente);
  }

  async getByDni(dni) {
    try {
      const paciente = await getPacienteByDni(dni);
      return cleanPassword(paciente);
    } catch (error) {
      return null;
    }
  }

  async findBy(field, value) {
    const query = { [field]: value };
    const docs = await PacienteMongooseModel.find(query).lean();
    return docs.map(doc => cleanPassword(doc));
  }

  async create(data) {
    const nuevo = await createPaciente(data);
    return cleanPassword(nuevo);
  }

  async update(id, patch) {
    // Buscar por pacienteId numérico o por _id de MongoDB
    let pacienteMongoId = id;
    if (typeof id === 'number' || /^\d+$/.test(String(id))) {
      // Si es un número, buscar el _id del paciente con ese pacienteId numérico
      const paciente = await PacienteMongooseModel.findOne({ pacienteId: Number(id) }).lean();
      if (!paciente) return null;
      pacienteMongoId = paciente._id;
    }
    
    const updated = await updatePaciente(pacienteMongoId, patch);
    if (!updated) return null;
    return cleanPassword(updated);
  }

  async delete(id) {
    // Buscar por pacienteId numérico o por _id de MongoDB
    let pacienteMongoId = id;
    if (typeof id === 'number' || /^\d+$/.test(String(id))) {
      // Si es un número, buscar el _id del paciente con ese pacienteId numérico
      const paciente = await PacienteMongooseModel.findOne({ pacienteId: Number(id) }).lean();
      if (!paciente) return false;
      pacienteMongoId = paciente._id;
    }
    
    return await deletePaciente(pacienteMongoId);
  }

  // Métodos específicos de pacientes
  async getPacienteByDni(dni) {
    const paciente = await getPacienteByDni(dni);
    return cleanPassword(paciente);
  }

  async getIdByDni(dni) {
    const paciente = await getPacienteByDni(dni);
    // Retornar el pacienteId numérico, no el _id
    return paciente.pacienteId;
  }
}
