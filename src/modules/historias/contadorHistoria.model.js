import mongoose from "mongoose";

const ContadorHistoriaSchema = new mongoose.Schema({
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

const ContadorHistoria = mongoose.model("ContadorHistoria", ContadorHistoriaSchema);

export default ContadorHistoria;