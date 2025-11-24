import { ESTADOS_VALIDOS, PRIORIDADES_VALIDAS } from "./tareas.utils.js";

export const validarCuerpoNoVacio = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "El cuerpo de la solicitud no puede estar vacío" });
    }
    next();
};

export const validarId = (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "ID inválido" });
    }
    next();
};

export const validarCamposObligatorios = (req, res, next) => {
    const { titulo, descripcion, estado, prioridad, area } = req.body;
    const camposFaltantes = [];

    if (!titulo) camposFaltantes.push("titulo");
    if (!descripcion) camposFaltantes.push("descripcion");
    if (!estado) camposFaltantes.push("estado");
    if (!prioridad) camposFaltantes.push("prioridad");
    if (!area) camposFaltantes.push("area");

    if (camposFaltantes.length > 0) {
        return res.status(400).json({ error: `Campos obligatorios faltantes: ${camposFaltantes.join(', ')}` });
    }
    next();
};

export const validarCamposOpcionales = (req, res, next) => {
    const { titulo, descripcion, estado, prioridad, area } = req.body;

    if (!titulo && !descripcion && !estado && !prioridad && !area) {
        return res.status(400).json({
            error: "Debe proporcionar al menos un campo para actualizar: titulo, descripcion, estado, prioridad"
        });
    }

    if (titulo !== undefined && (!titulo || titulo.trim() === "")) {
        return res.status(400).json({ error: "El título no puede estar vacío" });
    }
    if (descripcion !== undefined && (!descripcion || descripcion.trim() === "")) {
        return res.status(400).json({ error: "La descripción no puede estar vacía" });
    }
    if (area !== undefined && (!area || area.trim() === "")) {
        return res.status(400).json({ error: "El área no puede estar vacía" });
    }

    next();
};


export const validarEstado = (req, res, next) => {
    const { estado } = req.body;
    if (estado && !ESTADOS_VALIDOS.includes(estado.toLowerCase())) {
        return res.status(400).json({ error: `Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}` });
    }
    next();
};

export const validarPrioridad = (req, res, next) => {
    const { prioridad } = req.body;
    if (prioridad && !PRIORIDADES_VALIDAS.includes(prioridad.toLowerCase())) {
        return res.status(400).json({ error: `Prioridad inválida. Valores permitidos: ${PRIORIDADES_VALIDAS.join(', ')}` });
    }
    next();
};