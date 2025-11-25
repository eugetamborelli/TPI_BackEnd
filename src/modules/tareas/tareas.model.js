import mongoose from 'mongoose';
import TareaMongooseModel from './tarea.schema.js'; 

// *** CRUD ***

export const getTareaById = async (id) => {
    try {
        const tarea = await TareaMongooseModel.findById(id).lean(); 
        return tarea;
    } catch(error) {
        return null;
    }
};

export const createTarea = async (tareaData) => {
    try {
        const newTarea = await TareaMongooseModel.create(tareaData); 
        return newTarea;
    } catch (error) {
        throw error;
    }
};

export const updateTarea = async (id, tareaData) => {
    try {
        const updatedTarea = await TareaMongooseModel.findByIdAndUpdate(
            id, 
            tareaData, 
            { new: true, runValidators: true } 
        );
        return updatedTarea; 
    } catch (error) {
        throw error;
    }
};

export const deleteTarea = async (id) => {
    try {
        const result = await TareaMongooseModel.findByIdAndDelete(id);
        return !!result; 
    } catch (error) {
        throw error;
    }
};

// *** Búsqueda y Filtros Avanzados ***

export const buscarTareas = async (filtros = {}) => {
    const query = {};
    const { estado, prioridad, empleadoId, pacienteId, inicio, fin, tipo = 'inicio' } = filtros;

    // Validar y normalizar estado
    if (estado) {
        const estadoNormalizado = estado.toLowerCase();
        query.estado = estadoNormalizado;
    }
    if (prioridad) {
        const prioridadNormalizada = prioridad.toLowerCase();
        query.prioridad = prioridadNormalizada;
    }
    
    if (empleadoId) query.empleadoId = empleadoId;
    if (pacienteId) query.pacienteId = pacienteId; 

    // Validar y procesar fechas
    if (inicio || fin) {
        let fechaCampo = 'fechaInicio';
        if (tipo === 'creacion') fechaCampo = 'createdAt';
        if (tipo === 'finalizacion') fechaCampo = 'fechaFin';
        
        const fechaQuery = {};

        if (inicio) {
            const fechaInicio = new Date(inicio);
            if (isNaN(fechaInicio.getTime())) {
                throw new Error('Fecha de inicio inválida. Debe ser una fecha válida.');
            }
            fechaQuery.$gte = fechaInicio;
        }

        if (fin) {
            const fechaFin = new Date(fin);
            if (isNaN(fechaFin.getTime())) {
                throw new Error('Fecha de fin inválida. Debe ser una fecha válida.');
            }
            let fechaFinBusqueda = new Date(fechaFin);
            fechaFinBusqueda.setDate(fechaFinBusqueda.getDate() + 1);
            fechaQuery.$lt = fechaFinBusqueda; 
        }

        if (Object.keys(fechaQuery).length > 0) {
            query[fechaCampo] = fechaQuery;
        }
    }

    try {
        const tareas = await TareaMongooseModel.find(query).lean();
        return tareas;
    } catch (error) {
        // Preservar el error original si es un error de validación que lanzamos
        if (error.message.includes('inválido') || error.message.includes('inválida')) {
            throw error;
        }
        // Para errores de base de datos, lanzar con más contexto
        throw new Error(`Error al ejecutar la búsqueda de tareas: ${error.message}`);
    }
};