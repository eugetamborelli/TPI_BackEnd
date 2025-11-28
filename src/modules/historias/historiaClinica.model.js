import HistoriaClinicaMongooseModel from "./historiaClinica.schema.js";

// *** Funciones de Búsqueda ***

export const getHistoriaById = async (id) => {
    try {
        const historia = await HistoriaClinicaMongooseModel.findById(id).lean();
        return historia;
    } catch (error) {
        console.error("Error al obtener historia por ID:", error);
        return null;
    }
};

export const getHistoriaByPacienteId = async (pacienteId) => {
    try {
        const historia = await HistoriaClinicaMongooseModel.findOne({ 
            pacienteId: String(pacienteId) 
        }).lean();
        return historia;
    } catch (error) {
        console.error("Error al buscar historia por paciente:", error);
        return null;
    }
};

// *** Funciones CRUD ***

export const createHistoria = async (data) => {
    try {
        const nuevaHistoria = await HistoriaClinicaMongooseModel.create(data);
        return nuevaHistoria;
    } catch (error) {
        throw error; // El controlador manejará el error (ej. duplicado)
    }
};

export const updateHistoria = async (id, data) => {
    try {
        const historiaActualizada = await HistoriaClinicaMongooseModel.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );
        return historiaActualizada;
    } catch (error) {
        throw error;
    }
};

export const deleteHistoria = async (id) => {
    try {
        const result = await HistoriaClinicaMongooseModel.findByIdAndDelete(id);
        return !!result;
    } catch (error) {
        throw error;
    }
};