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

    if (estado) query.estado = estado.toLowerCase(); 
    if (prioridad) query.prioridad = prioridad.toLowerCase();
    
    if (empleadoId) query.empleadoId = empleadoId;
    if (pacienteId) query.pacienteId = pacienteId; 

    if (inicio || fin) {
        let fechaCampo = 'fechaInicio';
        if (tipo === 'creacion') fechaCampo = 'createdAt';
        if (tipo === 'finalizacion') fechaCampo = 'fechaFin';
        
        const fechaQuery = {};

        if (inicio) {
            fechaQuery.$gte = new Date(inicio);
        }

        if (fin) {
            let fechaFinBusqueda = new Date(fin);
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
        throw new Error('Error al ejecutar la búsqueda de tareas.');
    }
};

// *** Mapeo de Funciones REVISAR SI VA

/* export const getAllTareas = async () => buscarTareas({}); 
export const obtenerTodas = getAllTareas;

export const obtenerPorId = getTareaById;
export const crear = createTarea;
export const actualizar = updateTarea;
export const eliminar = deleteTarea;

export const buscar = buscarTareas;  */