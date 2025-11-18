import ResponseService from "../../common/services/response.service.js";
import { extractTokenFromHeader, verifyToken } from "./auth.utils.js";
import EmpleadosModel from "../empleados/empleados.model.js";
import Paciente from "../pacientes/pacientes.model.js";

const empleadosModel = new EmpleadosModel();
const pacientesModel = new Paciente();

// Middleware: verifica JWT y carga datos del usuario en req.user
export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = extractTokenFromHeader(authHeader);

        if (!token) {
            return ResponseService.badRequest(
                res,
                "Token de autenticación requerido. Formato: Bearer <token>"
            );
        }

        const decoded = verifyToken(token);
        let usuario = null;
        
        if (decoded.tipoUsuario === "empleado") {
            usuario = empleadosModel.getById(decoded.id);
            if (!usuario) {
                return ResponseService.notFound(res, "Empleado no encontrado");
            }
            req.user = {
                id: usuario.id,
                dni: usuario.dni,
                tipoUsuario: "empleado",
                rol: usuario.rol,
                area: usuario.area,
                nombre: usuario.nombre,
                apellido: usuario.apellido
            };
        } else if (decoded.tipoUsuario === "paciente") {
            usuario = pacientesModel.getById(decoded.id);
            if (!usuario) {
                return ResponseService.notFound(res, "Paciente no encontrado");
            }
            req.user = {
                id: usuario.id,
                dni: usuario.dni,
                tipoUsuario: "paciente",
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                fechaNacimiento: usuario.fechaNacimiento,
                telefono: usuario.telefono,
                email: usuario.email
            };
        } else {
            return ResponseService.badRequest(
                res,
                "Tipo de usuario inválido en el token"
            );
        }

        next();
    } catch (error) {
        if (error.message === "Token expirado") {
            return ResponseService.badRequest(res, "Token expirado. Por favor, inicie sesión nuevamente.");
        }
        if (error.message === "Token inválido") {
            return ResponseService.badRequest(res, "Token inválido");
        }
        
        console.error("Error en autenticación:", error);
        ResponseService.serverError(res, "Error al autenticar la petición");
    }
};

// Middleware: verifica que el usuario tenga un rol específico (solo empleados)
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return ResponseService.badRequest(
                res,
                "Autenticación requerida"
            );
        }

        if (req.user.tipoUsuario !== "empleado") {
            return ResponseService.badRequest(
                res,
                "Esta acción solo está disponible para empleados"
            );
        }

        if (!roles.includes(req.user.rol)) {
            return ResponseService.badRequest(
                res,
                "No tiene permisos para realizar esta acción"
            );
        }

        next();
    };
};

export const requireEmpleado = (req, res, next) => {
    if (!req.user) {
        return ResponseService.badRequest(
            res,
            "Autenticación requerida"
        );
    }

    if (req.user.tipoUsuario !== "empleado") {
        return ResponseService.badRequest(
            res,
            "Esta acción solo está disponible para empleados"
        );
    }

    next();
};

export const requirePaciente = (req, res, next) => {
    if (!req.user) {
        return ResponseService.badRequest(
            res,
            "Autenticación requerida"
        );
    }

    if (req.user.tipoUsuario !== "paciente") {
        return ResponseService.badRequest(
            res,
            "Esta acción solo está disponible para pacientes"
        );
    }

    next();
};

