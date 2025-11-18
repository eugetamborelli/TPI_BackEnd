import ResponseService from "../../common/services/response.service.js";
import EmpleadosModel from "../empleados/empleados.model.js";
import Paciente from "../pacientes/pacientes.model.js";
import { generateToken } from "./auth.utils.js";
import { comparePassword } from "./password.utils.js";
import { detectUserTypeByEmail } from "./email-domain.utils.js";

const empleadosModel = new EmpleadosModel();
const pacientesModel = new Paciente();

class AuthController {
    // Login: confía en el dominio del email para determinar tipo de usuario
    // Si hay email: detecta tipo por dominio (@saludintegral.com = empleado)
    // Si solo hay DNI: busca primero en empleados, luego en pacientes
    login = async (req, res) => {
        try {
            const { dni, email, password } = req.body;

            // Validar que se proporcionen los campos requeridos
            if (!password) {
                return ResponseService.badRequest(
                    res,
                    "Se requiere contraseña"
                );
            }

            if (!dni && !email) {
                return ResponseService.badRequest(
                    res,
                    "Se requiere DNI o email"
                );
            }

            let usuario = null;
            let tipoUsuario = null;
            let tokenPayload = {};

            if (email) {
                const detectedType = detectUserTypeByEmail(email);
                
                if (detectedType === 'empleado') {
                    const empleado = dni 
                        ? empleadosModel.getByDni(dni)
                        : empleadosModel.findBy('email', email)[0] || null;
                    
                    if (empleado) {
                        if (email && empleado.email && empleado.email.toLowerCase() !== email.toLowerCase()) {
                            return ResponseService.badRequest(res, "El email no corresponde a un empleado");
                        }
                        
                        if (!empleado.password) {
                            return ResponseService.badRequest(
                                res,
                                "El empleado no tiene contraseña configurada. Contacte al administrador."
                            );
                        }

                        const isPasswordValid = await comparePassword(password, empleado.password);
                        if (isPasswordValid) {
                            usuario = empleado;
                            tipoUsuario = "empleado";
                            tokenPayload = {
                                id: empleado.id,
                                dni: empleado.dni,
                                tipoUsuario: "empleado",
                                rol: empleado.rol,
                                area: empleado.area
                            };
                        }
                    }
                } else if (detectedType === 'paciente') {
                    const paciente = dni 
                        ? pacientesModel.getByDni(dni)
                        : pacientesModel.findBy('email', email)[0] || null;
                    
                    if (paciente) {
                        if (email && paciente.email && paciente.email.toLowerCase() !== email.toLowerCase()) {
                            return ResponseService.badRequest(res, "El email no corresponde a un paciente");
                        }
                        
                        if (!paciente.password) {
                            return ResponseService.badRequest(
                                res,
                                "El paciente no tiene contraseña configurada. Contacte al administrador."
                            );
                        }

                        const isPasswordValid = await comparePassword(password, paciente.password);
                        if (isPasswordValid) {
                            usuario = paciente;
                            tipoUsuario = "paciente";
                            tokenPayload = {
                                id: paciente.id,
                                dni: paciente.dni,
                                tipoUsuario: "paciente"
                            };
                        }
                    }
                }
            } else {
                const empleado = empleadosModel.getByDni(dni);
                if (empleado) {
                    if (!empleado.password) {
                        return ResponseService.badRequest(
                            res,
                            "El empleado no tiene contraseña configurada. Contacte al administrador."
                        );
                    }

                    const isPasswordValid = await comparePassword(password, empleado.password);
                    if (isPasswordValid) {
                        usuario = empleado;
                        tipoUsuario = "empleado";
                        tokenPayload = {
                            id: empleado.id,
                            dni: empleado.dni,
                            tipoUsuario: "empleado",
                            rol: empleado.rol,
                            area: empleado.area
                        };
                    }
                }

                if (!usuario) {
                    const paciente = pacientesModel.getByDni(dni);
                    if (paciente) {
                        if (!paciente.password) {
                            return ResponseService.badRequest(
                                res,
                                "El paciente no tiene contraseña configurada. Contacte al administrador."
                            );
                        }

                        const isPasswordValid = await comparePassword(password, paciente.password);
                        if (isPasswordValid) {
                            usuario = paciente;
                            tipoUsuario = "paciente";
                            tokenPayload = {
                                id: paciente.id,
                                dni: paciente.dni,
                                tipoUsuario: "paciente"
                            };
                        }
                    }
                }
            }

            if (!usuario) {
                return ResponseService.badRequest(
                    res,
                    "Credenciales inválidas"
                );
            }

            const token = generateToken(tokenPayload);
            const { password: _, ...usuarioSinPassword } = usuario;

            ResponseService.success(res, {
                message: "Login exitoso",
                token,
                usuario: usuarioSinPassword,
                tipoUsuario
            });
        } catch (error) {
            console.error("Error en login:", error);
            ResponseService.serverError(
                res,
                "Error al procesar el login"
            );
        }
    };


    verify = (req, res) => {
        try {
            ResponseService.success(res, {
                message: "Token válido",
                user: req.user
            });
        } catch (error) {
            ResponseService.serverError(
                res,
                "Error al verificar el token"
            );
        }
    };
}

export default new AuthController();

