import mongoose from "mongoose";

const ContadorTareasSchema = new mongoose.Schema({
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

const ContadorTareas = mongoose.model("ContadorTareas", ContadorTareasSchema);

export default ContadorTareas;