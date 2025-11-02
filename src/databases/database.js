import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/clinica", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Conectado a MongoDB"))
.catch(err => console.error("❌ Error al conectar:", err));
