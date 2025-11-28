import {
    getAllPacientes,
    getPacienteByDni,
    getPacienteById,
    createPaciente,
    updatePaciente,
    deletePaciente,
    buscarPacientes
} from "./pacientes.model.js";

class PacientesController {

    // *** Vistas ***

    renderDashboard = (req, res) => {
        res.render("pacientes/dashboard", { titulo: "Gestión de Pacientes" });
    };

    renderNuevoPaciente = (req, res) => {
        res.render("pacientes/nuevoPaciente", { 
            titulo: "Alta de paciente", 
            formData: {},
            error: req.query.error 
        });
    };

    renderEditarPaciente = async (req, res) => {
        // Buscamos por ID de Mongo (_id) que viene en la URL
        const { id } = req.params; 
        try {
            const paciente = await getPacienteById(id);
            if (!paciente) return res.redirect("/pacientes/listado?error=Paciente no encontrado");
            
            res.render("pacientes/editarPaciente", { paciente });
        } catch (error) {
            res.redirect("/pacientes/listado?error=Error al cargar paciente");
        }
    };

    getPacientesListado = async (req, res) => {
        const { dni, msg, error } = req.query;
        try {
            let pacientes = [];
            if (dni) {
                const paciente = await getPacienteByDni(dni);
                if (paciente) pacientes = [paciente];
            } else {
                pacientes = await getAllPacientes();
            }
            
            const viewPacientes = pacientes.map(p => ({...p, id: p._id}));

            res.render("pacientes/listado", { 
                pacientes: viewPacientes, 
                dniBusqueda: dni || "",
                successMsg: msg,
                error: error
            });
        } catch (err) {
            res.render("pacientes/listado", { 
                pacientes: [], 
                error: "Error al cargar listado: " + err.message 
            });
        }
    };

    // *** CRUD *** 

    addPaciente = async (req, res) => {
        try {
            const nuevo = await createPaciente(req.body);
            res.redirect(`/pacientes/listado?msg=Paciente ${nuevo.nombre} creado con éxito.`);
        } catch (error) {
            let msg = error.message;
            if (error.name === 'ValidationError') msg = Object.values(error.errors).map(e => e.message).join('. ');
            
            res.status(400).render("pacientes/nuevoPaciente", {
                error: msg,
                formData: req.body,
                titulo: "Alta de paciente"
            });
        }
    };

    updatePaciente = async (req, res) => {
        const { id } = req.params; // ID de Mongo
        try {
            const updated = await updatePaciente(id, req.body);
            
            if (!updated) return res.redirect("/pacientes/listado?error=Paciente no encontrado para actualizar");

            res.redirect(`/pacientes/listado?msg=Paciente actualizado correctamente.`);
        } catch (error) {
            let msg = error.message;
            if (error.name === 'ValidationError') msg = Object.values(error.errors).map(e => e.message).join('. ');

            // Recargar datos originales en caso de error
            const original = await getPacienteById(id);
            
            res.status(400).render("pacientes/editarPaciente", {
                error: msg,
                // Combinamos original con body, asegurando mantener el _id correcto
                paciente: { ...original, ...req.body, _id: id } 
            });
        }
    };

    deletePaciente = async (req, res) => {
        const { id } = req.params; // ID de Mongo
        try {
            const deleted = await deletePaciente(id);
            
            if (!deleted) return res.redirect("/pacientes/listado?error=No se pudo eliminar el paciente (ID no encontrado).");
            
            res.redirect("/pacientes/listado?msg=Paciente eliminado correctamente.");
        } catch (error) {
            res.redirect(`/pacientes/listado?error=Error al eliminar: ${error.message}`);
        }
    };
}

export default new PacientesController();