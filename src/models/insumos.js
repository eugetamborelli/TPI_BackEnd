import mongoose from "mongoose";

const insumosSchema = new mongoose.Schema({
  id: Int, 
  nombre: String, 
  categoria: String, 
  unidad: Int, 
  stock: Int, 
  proovedor: String, 
  codigo: Int, 
  costoUnitario: Int

});

export const Insumos = mongoose.model("Insumos", insumoSchema);
