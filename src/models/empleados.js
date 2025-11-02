import mongoose from "mongoose";

const empleadosSchema = new mongoose.Schema({
  id: Int,
  nombre: String, 
  rol: String, 
  area: String
});

export const Empleados = mongoose.model("Empleados", empleadoSchema);