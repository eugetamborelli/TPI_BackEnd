import { readPacientesFile, writePacientesFile } from "./pacientes.utils.js";

class Paciente {
    constructor(id, nombre, apellido, dni, fechaNacimiento, telefono, email, direccion, obraSocial, fechaAlta, historiaClinicaId) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.fechaNacimiento = fechaNacimiento;
        this.telefono = telefono;
        this.email = email;
        this.direccion = direccion;
        this.obraSocial = obraSocial;
        this.fechaAlta = fechaAlta;
        this.historiaClinicaId = historiaClinicaId;
    }

    //GET
    getAllPacientes() {
    return readPacientesFile();
    }

    getPacienteByDni(dni) {
    const pacientes = readPacientesFile();
    const paciente = pacientes.find(p => p.dni === Number(dni));
    return paciente || null;
    }

    //POST
    addPaciente(datosPaciente) {
        const pacientes = readPacientesFile();

        //Valida DNI
        const dniExiste = pacientes.some(p => p.dni === datosPaciente.dni)
        if (dniExiste) {
            return null;
        }

        //Genera id de manera automática e incremental - id = 1 si no hay registros
        const idNuevo = pacientes.length > 0 
        ? pacientes.reduce((maxId, p) => p.id > maxId ? p.id : maxId, 0) + 1 : 1;

        const nuevoPaciente = {
            id: idNuevo,
            ...datosPaciente,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        pacientes.push(nuevoPaciente);
        writePacientesFile(pacientes);

        return nuevoPaciente;
    }

    //PATCH
    updatePaciente(dni, datosPaciente) {
        const pacientes = readPacientesFile();
        const index = pacientes.findIndex(p => p.dni === Number(dni));

        //Si no existe paciente
        if (index === -1) {
            return null;
        }

        //No se permiten cambios en id, dni o createdAt
        const {id, dni, createdAt, ...allowedUpdates} = datosPaciente;

        pacientes[index] = {
            ...pacientes[index],
            ...allowedUpdates,
            updatedAt : new Date().toISOString()
        }

        writePacientesFile(pacientes);

        return pacientes[index];
    }

    //DELETE
    deletePaciente(dni) {
        let pacientes = readPacientesFile();
        const index = pacientes.findIndex(p => p.dni === String(dni));

        //Si no existe paciente
        if (index === -1) {
            return null;
        }

        const pacienteBorrado = pacientes[index];

        pacientes.splice(index, 1);

        writePacientesFile(pacientes);

        return pacienteBorrado;
    }

}