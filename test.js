import mongoose from "mongoose";
import "./src/databases/database.js";
import { Medico } from "./src/models/medicos.js";

// Función asíncrona para probar
const testConexion = async () => {
  try {
    const nuevoMedico = new Medico({
      nombre: "Dra. Valeria Suárez",
      especialidad: "Pediatría",
      matricula: "MP-12345",
      telefono: "1145678901",
      email: "valeria.suarez@clinica.com"
    });

    await nuevoMedico.save();
    console.log("✅ Médico guardado correctamente");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    mongoose.connection.close();
  }
};

testConexion();
