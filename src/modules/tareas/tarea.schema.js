import mongoose, { Schema } from 'mongoose';
import { 
    ESTADOS_VALIDOS, 
    PRIORIDADES_VALIDAS, 
    AREAS_VALIDAS 
} from './tareas.utils.js'; 

const TareaSchema = new Schema({
    titulo: {
        type: String,
        required: [true, 'El título de la tarea es obligatorio.'],
        trim: true,
        maxlength: [100, 'El título no puede exceder los 100 caracteres.']
    },
    descripcion: {
        type: String,
        trim: true
    },
    estado: {
        type: String,
        required: true,
        default: 'pendiente',
        enum: {
            values: ESTADOS_VALIDOS,
            message: `Estado no válido. Debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`
        }
    },
    prioridad: {
        type: String,
        required: true,
        default: 'media',
        enum: {
            values: PRIORIDADES_VALIDAS,
            message: `Prioridad no válida. Debe ser uno de: ${PRIORIDADES_VALIDAS.join(', ')}`
        }
    },
    area: {
        type: String,
        required: true,
        enum: {
            values: AREAS_VALIDAS,
            message: `Área no válida. Debe ser uno de: ${AREAS_VALIDAS.join(', ')}`
        }
    },
    fechaInicio: {
        type: Date,
        default: Date.now
    },
    fechaFin: {
        type: Date,
        default: null
    },
    empleadoId: {
        type: String,
    },
    pacienteId: {
        type: String,
    },
    proveedorId: { 
        type: String, // Asumiendo que es opcional y se guarda como String
    },
    observaciones: { 
        type: String,
        trim: true
    }
}, {
    timestamps: true 
});

const TareaMongooseModel = mongoose.model('Tarea', TareaSchema);

export default TareaMongooseModel;