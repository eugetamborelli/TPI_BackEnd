import Paciente from "./pacientes.model.js";

const pacienteModel = new Paciente();

export const getPacientes = (req, res) => {
    try {
        const pacientes = pacientesModel.getAllPacientes();
        res.json(pacientes);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const getPaciente = (req, res) => {
    try {
        const paciente = pacienteModel.getPacienteByDni(req.params.dni);
        res.json({
            mensaje: "Paciente localizado",
            paciente: paciente
        });
    } catch (error) {
        res.status(404).json({error: error.message});
    }
}

export const addPaciente = (req, res) => {
    try {
        const nuevoPaciente = pacienteModel.addPaciente(req.body);
        res.status(201).json({
            mensaje: "Paciente agregado correctamente",
            paciente: nuevoPaciente
        });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

export const updatePaciente = (req, res) => {
    try {
        const pacienteActualizado = pacienteModel.updatePaciente(req.params.dni, req.body);
        res.json({
            mensaje: "Paciente actualizado correctamente",
            paciente: pacienteActualizado
        });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

export const deletePaciente = (req, res) => {
    try {
        const pacienteEliminado = pacienteModel.deletePaciente(req.params.dni);
        res.json({
            mensaje: "Paciente eliminado correctamente",
            paciente: pacienteEliminado
        });
    } catch (error) {
        res.status(404).json({error: error.message});
    }
}