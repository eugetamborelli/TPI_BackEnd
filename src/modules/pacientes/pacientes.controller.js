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
        // No incluir password en los datos enviados a la vista
        pacientes = pacientes.map(({ password, ...rest }) => rest);

        const { dni } = req.query;
        if (dni) {
            try {
                const paciente = await pacienteModel.getPacienteByDni(dni);
                if (paciente) {
                    const { password, ...pacienteSinPassword } = paciente;
                    pacientes = [pacienteSinPassword];
                } else {
                    pacientes = [];
                }
            } catch (error) {
                // Si no encuentra por DNI, mostrar lista vacía
                pacientes = [];
            }
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
        res.status(400).render("pacientes/nuevoPaciente", { 
            error: error.message, 
            formData: req.body || {},
            titulo: "Alta de paciente"
        });
    }
}

//Menú actualizar paciente
export const renderEditarPaciente = async (req, res) => {
    try {
        const paciente = await pacienteModel.getPacienteByDni(req.params.dni);
        // No incluir password en los datos enviados a la vista
        const { password, ...pacienteSinPassword } = paciente;
        res.render("pacientes/editarPaciente", { paciente: pacienteSinPassword });
    } catch (error) {
        res.redirect("/pacientes/listado");
    }
}

export const updatePaciente = async (req, res) => {
    try {
        const pacienteActualizado = await pacienteModel.updatePaciente(req.params.dni, req.body);
        res.redirect("/pacientes/listado");
    } catch (error) {
        // En caso de error, necesitamos obtener el paciente original para el formulario
        try {
            const paciente = await pacienteModel.getPacienteByDni(req.params.dni);
            const { password, ...pacienteSinPassword } = paciente;
            res.status(400).render("pacientes/editarPaciente", { 
                error: error.message, 
                paciente: { ...pacienteSinPassword, ...req.body }
            });
        } catch (getError) {
            res.redirect("/pacientes/listado");
        }
    }
}

export const deletePaciente = async (req, res) => {
    try {
        const pacienteEliminado = await pacienteModel.deletePaciente(req.params.dni);
        res.redirect("/pacientes/listado");
    } catch (error) {
        // En caso de error al eliminar, redirigir con mensaje de error
        const pacientes = await pacienteModel.getAllPacientes();
        res.render("pacientes/listado", { 
            pacientes, 
            error: error.message,
            dniBusqueda: ""
        });
    }
}