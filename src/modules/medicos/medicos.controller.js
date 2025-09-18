import {
    getAllMedicos,
    getMedicoById,
    createMedico,
    updateMedico,
    deleteMedico
} from "./medicos.model.js";

// Obtener todos los médicos
export const getMedicos = (req, res) => {
    const medicos = getAllMedicos();
    res.json(medicos);
};

// Obtener un médico por ID
export const getMedico = (req, res) => {
    const medico = getMedicoById(req.params.id);
    if (!medico) return res.status(404).json({ error: "Médico no encontrado" });
    res.json(medico);
};

// Crear un nuevo médico
export const addMedico = (req, res) => {
    try {
        const nuevoMedico = createMedico(req.body);
        res.status(201).json(nuevoMedico);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar un médico existente
export const editMedico = (req, res) => {
    try {
        const medico = updateMedico(req.params.id, req.body);
        if (!medico) return res.status(404).json({ error: "Médico no encontrado" });
        res.json(medico);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un médico
export const removeMedico = (req, res) => {
    const result = deleteMedico(req.params.id);
    if (!result.success) {
        return res.status(400).json({ error: result.message });
    }
    res.json({ message: result.message });
};
