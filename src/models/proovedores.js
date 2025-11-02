import mongoose from "mongoose";

const proveedoresSchema = new mongoose.Schema({
  id: Int, 
  nombre: String,
  cuit: String,
  telefono: String,
  direccion: String, 
  estado: String
});

export const Proveedores = mongoose.model("Proveedores", proveedorSchema);
