import ValidationService from "../../common/services/validation.service.js";
import ResponseService from "../../common/services/response.service.js";

export const validarCampos = (req, res, next) => {
    const { nombre, apellido, dni, rol, area } = req.body;

    if (!nombre && !apellido && !dni && !rol && !area) {
        return ResponseService.badRequest(res, 
            "Debe proporcionar al menos un campo para actualizar: nombre, apellido, dni, rol, area"
        );
    }

    const validations = [
        { field: nombre, name: "nombre" },
        { field: apellido, name: "apellido" },
        { field: dni, name: "dni", isDni: true },
        { field: rol, name: "rol" },
        { field: area, name: "área" }
    ];

    for (const { field, name, isDni } of validations) {
        if (field !== undefined) {
            if (isDni) {
                try {
                    ValidationService.validateDni(field, true);
                } catch (error) {
                    return ResponseService.badRequest(res, error.message);
                }
            } else if (!field || String(field).trim() === "") {
                return ResponseService.badRequest(res, `El ${name} no puede estar vacío`);
            }
        }
    }

    next();
};