import mongoose from "mongoose";

const historiaClinicaSchema = new mongoose.Schema({
  id: Int, 
  pacienteID: Int, 
  descripcion: String, 
  fecha: String,
  ultimaActualizacion: String
});

export const HistoriaClinica = mongoose.model("HistoriaClinica", historiaClinicaSchema);
