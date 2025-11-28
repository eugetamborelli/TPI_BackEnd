// src/modules/pacientes/pacientes.schema.js
import mongoose, { Schema } from "mongoose";
import ContadorLegajo from "../empleados/contadorLegajo.model.js";

const PacienteSchema = new Schema(
  {
    pacienteId: {
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
      index: true,
    },
    fechaNacimiento: {
      type: String,
      required: [true, "La fecha de nacimiento es obligatoria"],
      trim: true,
    },
    telefono: {
      type: String,
      required: [true, "El teléfono es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    direccion: {
      type: String,
      trim: true,
    },
    obraSocial: {
      type: String,
      trim: true,
    },
    fechaAlta: {
      type: String,
      trim: true,
    },
    historiaClinicaId: {
      type: Number,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Índice para búsquedas por email
PacienteSchema.index({ email: 1 });

// Pre-procesamiento antes de guardar en DB
// Generación de pacienteId numérico (similar al legajo de empleados)
PacienteSchema.pre("save", async function (next) {
  if (this.pacienteId != null) {
    if (typeof next === 'function') {
      return next();
    }
    return;
  }

  try {
    let contador = await ContadorLegajo.findOne({ nombre: "pacienteId" });
    if (!contador) {
      contador = await ContadorLegajo.create({ nombre: "pacienteId", valor: 0 });
    }

    contador.valor += 1;
    await contador.save();

    this.pacienteId = contador.valor;

    if (typeof next === 'function') {
      next();
    }
  } catch (error) {
    if (typeof next === 'function') {
      next(error);
    } else {
      throw error;
    }
  }
});

const PacienteMongooseModel = mongoose.model("Paciente", PacienteSchema);

export default PacienteMongooseModel;

