import Paciente from "../pacientes/pacientes.model.js"; 
import { 
    getHistoriaByPacienteId, 
    getHistoriaById,
    createHistoria, 
    updateHistoria,
    deleteHistoria
} from "./historiaClinica.model.js";
import { 
    parseMedicamentos, 
    parseAntecedentes, 
    parseAlergias 
} from "./historiaClinica.utils.js";

const pacienteModel = new Paciente();

class HistoriaClinicaController {
    
    constructor() {
        this.pacienteModel = pacienteModel;
    }

    // *** Vistas ***

    renderDashboard = (req, res) => {
        res.render("historias/dashboard", {
            titulo: "Gestión de Historias Clínicas"
        });
    };

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

                historia = await getHistoriaByPacienteId(paciente.id);

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

            const historiaExistente = await getHistoriaByPacienteId(paciente.id);

            if (historiaExistente) {
                return res.redirect(`/historias/editar/${historiaExistente._id}`);
            }

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
        const historiaId = req.params.id;

        try {
            const historia = await getHistoriaById(historiaId);

            if (!historia) {
                return res.redirect("/historias/buscarHistoria?error=Historia clínica no encontrada.");
            }

            const paciente = await this.pacienteModel.getById(historia.pacienteId);

            if (!paciente) {
                throw new Error("Paciente asociado no encontrado.");
            }

            return res.render("historias/editarHistoria", {
                titulo: `Editar Historia de ${paciente.nombre} ${paciente.apellido}`,
                paciente,
                historia,
                error: null,
                formData: {}
            });

        } catch (error) {
            console.error("Error al renderizar edición:", error);
            return res.redirect(`/historias/buscarHistoria?error=Error al cargar la edición: ${error.message}`);
        }
    };

    // *** CRUD ***

    create = async (req, res) => {
        const { dni } = req.body; 

        try {
            const paciente = await this.pacienteModel.getPacienteByDni(dni);
            if (!paciente) throw new Error("No existe un paciente con ese DNI.");

            const data = {
                pacienteId: String(paciente.id),
                observaciones: req.body.observaciones || "",
                alergias: parseAlergias(req.body.alergias),
                medicamentosActuales: parseMedicamentos(req.body.medicamentosActuales),
                antecedentes: parseAntecedentes(req.body)
            };

            await createHistoria(data);

            res.redirect(`/historias/buscarHistoria?dni=${dni}&msg=Historia creada correctamente.`);

        } catch (error) {
            console.error("Error al crear HC:", error);
            
            let pacienteInfo = null;
            try { pacienteInfo = await this.pacienteModel.getPacienteByDni(dni); } catch {}

            res.status(400).render("historias/nuevaHistoria", {
                titulo: "Alta de Historia Clínica",
                error: error.message,
                paciente: pacienteInfo,
                historia: null, 
                formData: req.body
            });
        }
    };

    update = async (req, res) => {
        const historiaId = req.params.id; 
        const { dni } = req.body; 

        try {
            const data = {
                observaciones: req.body.observaciones || "",
                alergias: parseAlergias(req.body.alergias),
                medicamentosActuales: parseMedicamentos(req.body.medicamentosActuales),
                antecedentes: parseAntecedentes(req.body)
            };

            const historiaActualizada = await updateHistoria(historiaId, data);

            if (!historiaActualizada) {
                return res.status(404).redirect(`/historias/buscarHistoria?dni=${dni}&error=No se pudo actualizar. Historia no encontrada.`);
            }

            res.redirect(`/historias/buscarHistoria?dni=${dni}&msg=Historia actualizada correctamente.`);

        } catch (error) {
            console.error("Error al actualizar HC:", error);

            let pacienteInfo = null;
            let historiaOriginal = null;
            try {
                pacienteInfo = await this.pacienteModel.getPacienteByDni(dni);
                historiaOriginal = await getHistoriaById(historiaId);
            } catch {}

            res.status(400).render("historias/editarHistoria", {
                titulo: "Error de Edición",
                error: error.message,
                paciente: pacienteInfo,
                historia: { ...historiaOriginal, ...req.body, _id: historiaId }, 
                formData: req.body
            });
        }
    };

    delete = async (req, res) => {
        const historiaId = req.params.id;
        
        try {
            const historia = await getHistoriaById(historiaId);
            let dniRedirect = "";

            if (historia) {
                const paciente = await this.pacienteModel.getById(historia.pacienteId);
                if (paciente) dniRedirect = `?dni=${paciente.dni}`;
            }

            const deleted = await deleteHistoria(historiaId);

            if (!deleted) {
                return res.status(404).redirect(`/historias/buscarHistoria${dniRedirect}&error=Historia no encontrada.`);
            }

            res.redirect(`/historias/buscarHistoria${dniRedirect}&msg=Historia clínica eliminada.`);

        } catch (error) {
            console.error("Error al eliminar HC:", error);
            res.status(500).redirect(`/historias/buscarHistoria?error=Error interno al eliminar.`);
        }
    };
}

export default new HistoriaClinicaController();