import mongoose from "mongoose";

const pacientesSchema = new mongoose.Schema({
  id: Int,
  nombre: String,
  dni: String,
  fechaNacimiento: Date,
  telefono: String,
  email: String,
  direccion: String,
  obraSocial: String
});

export const Pacientes = mongoose.model("Pacientes", pacienteSchema);
