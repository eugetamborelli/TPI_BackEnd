import { readPacientesFile, writePacientesFile } from "./pacientes.utils.js";

export default class Paciente {
    constructor(id, nombre, apellido, dni, fechaNacimiento, telefono, email, direccion, obraSocial, fechaAlta, historiaClinicaId) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = Number(dni);
        this.fechaNacimiento = fechaNacimiento;
        this.telefono = telefono;
        this.email = email;
        this.direccion = direccion;
        this.obraSocial = obraSocial;
        this.fechaAlta = fechaAlta;
        this.historiaClinicaId = historiaClinicaId;
    }

    //GET
    async getAllPacientes() {
        return await readPacientesFile();
    }

    async getPacienteByDni(dni) {
        const pacientes = await readPacientesFile();
        const paciente = pacientes.find(p => Number(p.dni) === Number(dni));

        if(!paciente) {
        throw new Error(`Paciente con DNI ${dni} no encontrado`);
        }

        return paciente;
    }

    //POST
    async addPaciente(datosPaciente) {
        const pacientes = await readPacientesFile();

        //Validaciones-campos obligatorios
        validatePacienteData(datosPaciente);

        //Valida DNI
        const dniExiste = pacientes.some(p => Number(p.dni) === Number(datosPaciente.dni))
        if (dniExiste) {
            throw new Error(`Ya existe un paciente con el DNI ${datosPaciente.dni}`);
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

        const guardadoCorrecto = await writePacientesFile(pacientes);
        if (!guardadoCorrecto) {
            throw new Error("Error al guardar el paciente");
        }

        return nuevoPaciente;
    }

    //PATCH
    async updatePaciente(dni, datosPaciente) {
        const pacientes = await readPacientesFile();
        const index = pacientes.findIndex(p => Number(p.dni) === Number(dni));

        if (index === -1) {
            throw new Error(`Paciente con DNI ${dni} no encontrado`);
        }

        //No se permiten cambios en id, dni o createdAt
        const {id, dni: dniParam, createdAt, ...allowedUpdates} = datosPaciente;

        //Validaciones-campos obligatorios
        validatePacienteData(allowedUpdates, true);

        pacientes[index] = {
            ...pacientes[index],
            ...allowedUpdates,
            updatedAt : new Date().toISOString()
        }

        const guardadoCorrecto = await writePacientesFile(pacientes);
        if (!guardadoCorrecto) {
            throw new Error("Error al actualizar el paciente");
        }

        return pacientes[index];
    }

    //DELETE
    async deletePaciente(dni) {
        let pacientes = await readPacientesFile();
        const index = pacientes.findIndex(p => Number(p.dni) === Number(dni));

        if (index === -1) {
            throw new Error(`Paciente con DNI ${dni} no encontrado`);
        }

        const pacienteBorrado = pacientes[index];

        pacientes.splice(index, 1);
        
        const guardadoCorrecto = await writePacientesFile(pacientes);
        if (!guardadoCorrecto) {
            throw new Error("Error al eliminar el paciente");
        }

        return pacienteBorrado;
    }
}

//Validar datos y verificar campos obligatorios
function validatePacienteData(datosPaciente, isUpdate = false) {
    //Campos obligatorios - solo en creación de paciente
    const requiredFields = ["nombre", "apellido", "dni", "fechaNacimiento", "telefono"];
    for (const field of requiredFields) {
        if (!isUpdate && !datosPaciente[field]) {
            throw new Error(`El campo ${field} es obligatorio`);
        }
    }

    //DNI numérico
    if (datosPaciente.dni && isNaN(Number(datosPaciente.dni))) {
        throw new Error("DNI debe ser un número válido");
    }

    //Fecha de nacimiento válida
    if (datosPaciente.fechaNacimiento) {
        const fecha = new Date(datosPaciente.fechaNacimiento);
        if (isNaN(fecha.getTime()) || fecha > new Date()) {
            throw new Error("Fecha de nacimiento inválida");
        }
    }

    //Email válido
    if (datosPaciente.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(datosPaciente.email)) {
            throw new Error("Email inválido");
        }
    }

    //Teléfono válido
    if (datosPaciente.telefono) {
        const telRegex = /^[0-9\s\-()+]+$/;
        if (!telRegex.test(datosPaciente.telefono)) {
            throw new Error("Teléfono inválido");
        }
    }

    //Fecha de alta posterior a nacimiento
    if (datosPaciente.fechaAlta && datosPaciente.fechaNacimiento) {
        const nacimiento = new Date(datosPaciente.fechaNacimiento);
        const alta = new Date(datosPaciente.fechaAlta);
        if (alta < nacimiento) {
            throw new Error("La fecha de alta no puede ser anterior a la fecha de nacimiento");
        }
    }
}