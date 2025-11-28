import mongoose, { Schema } from "mongoose";
import ContadorHistoria from "./contadorHistoria.model.js";

const MedicamentoSchema = new Schema({
  nombre: { type: String, trim: true, required: true },
  dosis: { type: String, trim: true },
  frecuencia: { type: String, trim: true }
}, { _id: false });

const HistoriaClinicaSchema = new Schema(
  {
    numeroHistoria: {
      type: Number,
      unique: true
    },

    pacienteId: {
      type: String,
      required: [true, "El ID del paciente es obligatorio"],
      unique: true
    },

    fechaCreacion: {
      type: Date,
      default: Date.now,
    },

    alergias: [{
      type: String,
      trim: true
    }],

    medicamentosActuales: [MedicamentoSchema],

    antecedentes: {
      familiares: [{ type: String, trim: true }],
      personales: [{ type: String, trim: true }],
      quirurgicos: [{ type: String, trim: true }]
    },

    observaciones: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true,
  }
);

HistoriaClinicaSchema.pre("save", async function (next) {
  if (this.numeroHistoria != null) return next();

  try {
    let contador = await ContadorHistoria.findOne({ nombre: "numeroHistoria" });

    if (!contador) {
      contador = await ContadorHistoria.create({
        nombre: "numeroHistoria",
        valor: 0,
      });
    }

    contador.valor += 1;
    await contador.save();

    this.numeroHistoria = contador.valor;

    next();
  } catch (error) {
    next(error);
  }
});

const HistoriaClinicaMongooseModel = mongoose.model("HistoriaClinica", HistoriaClinicaSchema);

export default HistoriaClinicaMongooseModel;