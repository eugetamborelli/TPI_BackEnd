import mongoose from 'mongoose';

// Valida que el cuerpo de la solicitud no esté vacío
// Compatible con vistas y API
export const validarCuerpoNoVacio = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        // Si es una petición API
        if (req.path.startsWith('/api/') || req.headers.accept?.includes('application/json')) {
            return res.status(400).json({ error: "El cuerpo de la solicitud no puede estar vacío" });
        }
        // Si es una petición de vista, redirige con error
        return res.status(400).redirect(`${req.path}?error=El cuerpo de la solicitud no puede estar vacío`);
    }
    next();
};

// Valida el ID de MongoDB
// Compatible con vistas y API
export const validarId = (req, res, next) => {
    const id = req.params.id; 

    if (!id) {
        if (req.path.startsWith('/api/') || req.headers.accept?.includes('application/json')) {
            return res.status(400).json({ error: "Parámetro ID faltante en la URL." });
        }
        return res.status(400).redirect(`${req.baseUrl}?error=Parámetro ID faltante en la URL.`);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        if (req.path.startsWith('/api/') || req.headers.accept?.includes('application/json')) {
            return res.status(400).json({ error: "ID de recurso inválido. El formato debe ser un ObjectId de 24 caracteres." });
        }
        return res.status(400).redirect(`${req.baseUrl}?error=ID de recurso inválido. El formato debe ser un ObjectId de 24 caracteres.`);
    }
    next();
};