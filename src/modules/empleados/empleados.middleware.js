export const validarCampos = (req, res, next) => {
    const { nombre, apellido, dni, rol, area } = req.body;

    if (!nombre && !apellido && !dni && !rol && !area) {
        return res.status(400).json({
            error: "Debe proporcionar al menos un campo para actualizar: nombre, apellido, dni, rol, area"
        });
    }

    if (nombre !== undefined && (!nombre || nombre.trim() === "")) {
        return res.status(400).json({ error: "El nombre no puede estar vacío" });
    }
    if (apellido !== undefined && (!apellido || apellido.trim() === "")) {
        return res.status(400).json({ error: "El apellido no puede estar vacío" });
    }
    if (dni !== undefined && (!dni || String(dni).trim() === "")) {
        return res.status(400).json({ error: "El DNI no puede estar vacío" });
    }
    if (rol !== undefined && (!rol || rol.trim() === "")) {
        return res.status(400).json({ error: "El rol no puede estar vacío" });
    }
    if (area !== undefined && (!area || area.trim() === "")) {
        return res.status(400).json({ error: "El área no puede estar vacía" });
    }

    if (dni !== undefined) {
        const dniStr = String(dni).trim();
        if (!/^\d{7,8}$/.test(dniStr)) {
            return res.status(400).json({
                error: "El DNI debe tener entre 7 y 8 dígitos numéricos"
            });
        }
    }

    next();
};