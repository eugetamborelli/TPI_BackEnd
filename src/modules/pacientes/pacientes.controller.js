import BaseController from "../../common/base/base.controller.js";
import PacienteModel from "./pacientes.model.js";

class PacientesController extends BaseController {
    constructor() {
        super(new PacienteModel());
    }

    // --- Vistas ---

    renderDashboard = (req, res) => {
        res.render("pacientes/dashboard", { titulo: "Gestión de Pacientes" });
    };

    renderNuevoPaciente = (req, res) => {
        res.render("pacientes/nuevoPaciente", { titulo: "Alta de paciente", formData: {} });
    };

    renderEditarPaciente = async (req, res) => {
        try {
            const paciente = await this.model.getPacienteByDni(req.params.dni);
            res.render("pacientes/editarPaciente", { paciente });
        } catch (error) {
            res.redirect("/pacientes/listado");
        }
    };

    getPacientesListado = async (req, res) => {
        try {
            const { dni } = req.query;
            let pacientes;

            if (dni) {
                try {
                    const paciente = await this.model.getPacienteByDni(dni);
                    pacientes = [paciente];
                } catch {
                    pacientes = [];
                }
            } else {
                pacientes = await this.model.getAll();
            }

            res.render("pacientes/listado", { pacientes, dniBusqueda: dni || "" });
        } catch (error) {
            res.render("pacientes/listado", { pacientes: [], error: error.message });
        }
    };

    // --- CRUD Overrides  ---

    addPaciente = async (req, res) => {
        try {
            await this.model.create(req.body);
            res.redirect("/pacientes/listado");
        } catch (error) {
            res.status(400).render("pacientes/nuevoPaciente", {
                error: error.message,
                formData: req.body || {},
                titulo: "Alta de paciente"
            });
        }
    };

    updatePaciente = async (req, res) => {
        try {
            const id = await this.model.getIdByDni(req.params.dni);
            await this.model.update(id, req.body);
            res.redirect("/pacientes/listado");
        } catch (error) {
            try {
                const pacienteOriginal = await this.model.getPacienteByDni(req.params.dni);
                res.status(400).render("pacientes/editarPaciente", {
                    error: error.message,
                    paciente: { ...pacienteOriginal, ...req.body }
                });
            } catch (fatalError) {
                res.redirect("/pacientes/listado");
            }
        }
    };

    deletePaciente = async (req, res) => {
        try {
            const id = await this.model.getIdByDni(req.params.dni);
            await this.model.delete(id);
            res.redirect("/pacientes/listado");
        } catch (error) {
            const pacientes = await this.model.getAll();
            res.render("pacientes/listado", { 
                pacientes, 
                error: "No se pudo eliminar: " + error.message,
                dniBusqueda: "" 
            });
        }
    };
}

export default new PacientesController();