import mongoose, { Schema } from 'mongoose';
import { 
    ESTADOS_VALIDOS, 
    PRIORIDADES_VALIDAS, 
    AREAS_VALIDAS 
} from './tareas.utils.js'; 
import ContadorTareas from "./contadorTareas.model.js";

const TareaSchema = new Schema({
    numeroTarea: {
        type: Number,
        unique: true
    },
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
        type: String,
    },
    observaciones: { 
        type: String,
        trim: true
    }
}, {
    timestamps: true 
});

// Hook para Autoincrementar numeroTarea
TareaSchema.pre("save", async function (next) {
    if (this.numeroTarea != null) return next();

    try {
      // Buscamos el contador específico para tareas
        let contador = await ContadorTareas.findOne({ nombre: "numeroTarea" });

      // Si no existe, lo inicializamos
        if (!contador) {
        contador = await ContadorTareas.create({
            nombre: "numeroTarea",
            valor: 0,
        });
        }

        // Incrementamos y guardamos
        contador.valor += 1;
        await contador.save();

        // Asignamos el nuevo valor a la tarea actual
        this.numeroTarea = contador.valor;

        next();
    } catch (error) {
        next(error);
    }
});

const TareaMongooseModel = mongoose.model('Tarea', TareaSchema);

export default TareaMongooseModel;