import express from "express";
import Medico from "../models/medicos.js";

const router = express.Router();

// Ruta para listar médicos
router.get("/medicos", async (req, res) => {
  const medicos = await Medico.find(); 
  res.render("index", { medicos }); 
});

// Mostrar formulario para nuevo médico
router.get("/medicos/new", (req, res) => {
    res.render("new");
  });
  
  // Guardar nuevo médico
router.post("/medicos", async (req, res) => {
    const { nombre, especialidad, email, telefono } = req.body;
  
    const nuevoMedico = new Medico({
      nombre,
      especialidad,
      email,
      telefono
    });

    // Mostrar formulario de edición
router.get("/medicos/:id/edit", async (req, res) => {
  const medico = await Medico.findById(req.params.id);
  res.render("edit", { medico });
});

// Actualizar médico
router.put("/medicos/:id", async (req, res) => {
    const { nombre, especialidad, email, telefono } = req.body;
  
    await Medico.findByIdAndUpdate(req.params.id, {
      nombre,
      especialidad,
      email,
      telefono
    });
  
    res.redirect("/medicos");
  });

  // Actualizar médico
router.put("/medicos/:id", async (req, res) => {
    const { nombre, especialidad, email, telefono } = req.body;
  
    await Medico.findByIdAndUpdate(req.params.id, {
      nombre,
      especialidad,
      email,
      telefono
    });
  
    res.redirect("/medicos");
  });
  
  
    await nuevoMedico.save();
    res.redirect("/medicos"); // vuelve a la lista después de guardar
  });
  

export default router;
