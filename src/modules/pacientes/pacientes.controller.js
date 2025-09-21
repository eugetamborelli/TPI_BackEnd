import Paciente from "./pacientes.model.js";

const pacienteModel = new Paciente();

//Menú principal
export const renderDashboard = (req, res) => {
    res.render("pacientes/dashboard", {
        titulo: "Gestión de Pacientes"
    });
}

//Menú Listados
export const getPacientesListado = async(req, res) => {
    try {
        let pacientes = await pacienteModel.getAllPacientes();

        const { dni } = req.query;
        if (dni) {
            const paciente = await pacienteModel.getPacienteByDni(dni);
            pacientes = paciente ? [paciente] : [];
        }

        res.render("pacientes/listado", { pacientes, dniBusqueda: dni || "" });
    } catch (error) {
        res.render("pacientes/listado", { pacientes: [], error: error.message });
    }
}

//Menú nuevo Paciente
export const renderNuevoPaciente = (req, res) => {
    res.render("pacientes/nuevoPaciente", {
        titulo: "Alta de paciente",
        formData: {}
    });
}

export const addPaciente = async (req, res) => {
    try {
        const nuevoPaciente = await pacienteModel.addPaciente(req.body);

        res.redirect("/pacientes/listado");
    } catch (error) {
        res.status(400).render("pacientes/nuevoPaciente", { error: error.message, formData: req.body || {} });
    }
}

//Menú actualizar paciente
export const renderEditarPaciente = async (req, res) => {
    try {
        const paciente = await pacienteModel.getPacienteByDni(req.params.dni);
        res.render("pacientes/editarPaciente", { paciente });
    } catch (error) {
        res.redirect("/pacientes/listado");
    }
}

export const updatePaciente = async (req, res) => {
    try {
        const pacienteActualizado = await pacienteModel.updatePaciente(req.params.dni, req.body);
        res.redirect("/pacientes/listado");
    } catch (error) {
        res.status(400).render("pacientes/editarPaciente", { error: error.message, paciente: req.body })
    }
}

export const deletePaciente = async (req, res) => {
    try {
        const pacienteEliminado = await pacienteModel.deletePaciente(req.params.dni);
        res.redirect("/pacientes/listado");
    } catch (error) {
        res.render("pacientes/listado", { pacientes: [], error: error.message });
    }
}