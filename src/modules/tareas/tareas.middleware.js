import mongoose from 'mongoose';

//Valida que el cuerpo de la solicitud no esté vacío
export const validarCuerpoNoVacio = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "El cuerpo de la solicitud no puede estar vacío" });
    }
    next();
};

//Valida el ID de MongoDB (ObjectId)
export const validarId = (req, res, next) => {
    const id = req.params.id; 

    // Verificación adicional para asegurar que el ID existe antes de validarlo
    if (!id) {
        return res.status(400).json({ error: "Parámetro ID faltante en la URL." });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID de recurso inválido. El formato debe ser un ObjectId de 24 caracteres." });
    }
    next();
};