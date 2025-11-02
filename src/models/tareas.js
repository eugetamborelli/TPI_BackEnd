import mongoose from "mongoose";

const tareasSchema = new mongoose.Schema({
  id: Int,
  area: String, 
  titulo: String,  
  descripcion: String,
  estado: { type: String, enum: ["pendiente", "en curso", "completada"] },
  empleadoID: Int, 
  pacienteID: Int, 
  proovedorID: Int, 
  fechaAsignacion: Date,
  observaciones: String
});

export const Tareas = mongoose.model("Tareas", tareaSchema);
