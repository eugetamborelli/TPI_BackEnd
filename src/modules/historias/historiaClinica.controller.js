import BaseController from "../../common/base/base.controller.js";
import Paciente from "../pacientes/pacientes.model.js";
import HistoriaClinicaModel from "./historiaClinica.model.js";
import { 
    parseMedicamentos, 
    parseAntecedentes,
    parseAlergias } from "./historiaClinica.utils.js";

const pacienteModel = new Paciente();
const historiaModel = new HistoriaClinicaModel();

class HistoriaClinicaController extends BaseController {
    constructor() {
        super(historiaModel);
        this.pacienteModel = pacienteModel;
    }

    // --- Vistas ---

    renderDashboard = (req, res) => {
        res.render("historias/dashboard", {
            titulo: "Gestión de Historias Clínicas"
        });
    };

    //Búsqueda de Historia Clínica
    buscarHistoria = async (req, res) => {
        const { dni } = req.query;
        let error = null;
        let historia = null;
        let paciente = null;

        if (dni) {
            try {
                paciente = await this.pacienteModel.getPacienteByDni(dni); 

                if (!paciente) {
                    throw new Error("No existe paciente con ese DNI.");
                }

                // Ultima historia
                historia = await this.model.getByPacienteIdSingle(paciente.id);

                if (!historia) error = "El paciente no tiene historia clínica registrada.";
            } catch (err) {
                error = err.message;
            }
        }

        res.render("historias/buscarHistoria", {
            titulo: "Búsqueda de Historia Clínica",
            historia,
            paciente,
            dniBusqueda: dni || "",
            error
        });
    };

    renderNuevaHistoria = async (req, res) => {
        const { dni } = req.query;
        let paciente = null;

        if (!dni) {
            return res.render("historias/nuevaHistoria", {
                titulo: "Alta de Historia Clínica",
                paciente: null,
                historia: null,
                error: null,
                formData: {}
            });
        }

        try {
            paciente = await this.pacienteModel.getPacienteByDni(dni);

            if (!paciente) {
                throw new Error("Paciente no encontrado.");
            }

            // Si ya existe una historia, redirige a editar
            const historiaExistente = await this.model.getByPacienteIdSingle(paciente.id);

            if (historiaExistente) {
                return res.redirect(`/historias/editarHistoria?dni=${dni}`);
            }

            // Si no existe, muestra el formulario de alta
            return res.render("historias/nuevaHistoria", {
                titulo: "Alta de Historia Clínica",
                paciente,
                historia: null, 
                error: null,
                formData: {}
            });
        } catch (error) {
            return res.render("historias/nuevaHistoria", {
                titulo: "Alta de Historia Clínica",
                paciente: null,
                historia: null,
                error: error.message,
                formData: req.query
            });
        }
    };

    renderEditarHistoria = async (req, res) => {
        const { dni } = req.query;
        let paciente = null;
        let historia = null;

        if (!dni) {
            return res.redirect("/historias/buscarHistoria");
        }

        try {
            paciente = await this.pacienteModel.getPacienteByDni(dni);

            if (!paciente) {
                throw new Error("Paciente no encontrado.");
            }

            historia = await this.model.getByPacienteIdSingle(paciente.id);

            // Si no existe la historia, redirige a alta
            if (!historia) {
                return res.redirect(`/historias/nuevaHistoria?dni=${dni}`);
            }

            // Si existe la historia, muestra el formulario de edición
            return res.render("historias/editarHistoria", {
                titulo: `Editar Historia de ${paciente.nombre} ${paciente.apellido}`,
                paciente,
                historia,
                error: null,
                formData: {}
            });

        } catch (error) {
            return res.status(400).render("historias/editarHistoria", {
                titulo: "Error de Edición",
                paciente: null,
                historia: null,
                error: error.message,
                formData: req.query
            });
        }
    };

    guardarHistoria = async (req, res) => {
        const { dni, id } = req.body; 

        if (!dni) {
            return res.render("historias/nuevaHistoria", {
            error: "Se requiere DNI del paciente",
            formData: req.body
            });
        }

        try {
            const paciente = await this.pacienteModel.getPacienteByDni(dni);
            if (!paciente) {
                throw new Error("No existe un paciente con ese DNI. Realizar primero la carga del Paciente.");
            }

            //Parseo de datos
            const data = {
                pacienteId: paciente.id,
                observaciones: req.body.observaciones || "",
                alergias: parseAlergias(req.body.alergias),
                medicamentosActuales: parseMedicamentos(req.body.medicamentosActuales),
                antecedentes: parseAntecedentes(req.body)
            };

            let historiaFinal;
            if (id) {
                // UPDATE
                historiaFinal = await this.model.updateHistoria(Number(id), data);
            } else {
                // CREATE
                historiaFinal = await this.model.create(data);
            }

            // Redirige a la búsqueda para ver el resultado
            res.redirect(`/historias/buscarHistoria?dni=${dni}`);
        } catch (error) {
            console.error("Error al guardar HC:", error);
            
            const errorView = id ? "historias/editarHistoria" : "historias/nuevaHistoria";
            const paciente = await this.pacienteModel.getPacienteByDni(dni); 

            res.status(400).render(errorView, {
                error: error.message,
                paciente,
                historia: id ? { id: Number(id) } : null, 
                formData: req.body
            });
        }
    };
}

export default new HistoriaClinicaController();