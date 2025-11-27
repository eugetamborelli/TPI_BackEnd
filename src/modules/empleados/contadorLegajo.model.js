// src/modules/empleados/contadorLegajo.model.js
import mongoose from "mongoose";

const ContadorLegajoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  valor: {
    type: Number,
    default: 0,
  },
});

const ContadorLegajo = mongoose.model("ContadorLegajo", ContadorLegajoSchema);

export default ContadorLegajo;
