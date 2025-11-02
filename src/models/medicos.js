import mongoose from "mongoose";

const medicosSchema = new mongoose.Schema({
  nombre: String,
  especialidad: String,
  matricula: String,
  telefono: String,
  email: String
});

export const Medico = mongoose.model("Medico", medicoSchema);
