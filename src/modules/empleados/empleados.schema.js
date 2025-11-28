import mongoose, { Schema } from "mongoose";
import ContadorLegajo from "./contadorLegajo.model.js";
import { ROLES, AREAS } from './empleados.utils.js'; 
import { hashPassword } from '../auth/password.utils.js'; 


const EmpleadoSchema = new Schema(
  {
    legajo: {
      type: Number,
      unique: true,
    },

    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      maxlength: [100, "El nombre no puede exceder los 100 caracteres"],
    },
    apellido: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      trim: true,
      maxlength: [100, "El apellido no puede exceder los 100 caracteres"],
    },
    dni: {
      type: String,
      required: [true, "El DNI es obligatorio"],
      trim: true,
      unique: true,
    },
    rol: {
      type: String,
      required: [true, "El rol es obligatorio"],
      trim: true,
      enum: {
          values: ROLES,
          message: 'Rol no válido.'
      }
    },
    area: {
      type: String,
      required: [true, "El área es obligatoria"],
      trim: true,
      enum: {
          values: AREAS,
          message: 'Área no válida.'
      }
    },
    telefono: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, ingrese un email válido.'],
    },
    password: {
      type: String,
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres.'] 
    },
    fechaAlta: {
      type: Date,
      default: Date.now,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-procesamiento antes de guardar en DB

// Generación de Legajo
EmpleadoSchema.pre("save", async function (next) {
  if (this.legajo != null) return next();

  try {
    let contador = await ContadorLegajo.findOne({ nombre: "legajo" });
    if (!contador) {
      contador = await ContadorLegajo.create({ nombre: "legajo", valor: 0 });
    }

    contador.valor += 1;
    await contador.save();

    this.legajo = contador.valor;

    next();
  } catch (error) {
    next(error);
  }
});

// Hash de Contraseña
EmpleadoSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();

    try {
        next();
    } catch (error) {
        next(error);
    }
});


const EmpleadoMongooseModel = mongoose.model("Empleado", EmpleadoSchema);

export default EmpleadoMongooseModel;