import BaseModel from "../../common/base/base.model.js";
import ValidationService from "../../common/services/validation.service.js";
import { hashPassword } from "../auth/password.utils.js";

export default class Paciente extends BaseModel {
    constructor() {
        super("pacientes");
    }

    validateData(datosPaciente, isUpdate = false) {
        const requiredFields = ["nombre", "apellido", "dni", "fechaNacimiento", "telefono"];
        ValidationService.validateRequiredFields(datosPaciente, requiredFields, isUpdate);

        ValidationService.validateDni(datosPaciente.dni);
        ValidationService.validateDate(datosPaciente.fechaNacimiento, false);
        ValidationService.validateEmail(datosPaciente.email);
        ValidationService.validatePhone(datosPaciente.telefono);

        if (datosPaciente.fechaAlta && datosPaciente.fechaNacimiento) {
            const nacimiento = new Date(datosPaciente.fechaNacimiento);
            const alta = new Date(datosPaciente.fechaAlta);
            if (alta < nacimiento) {
                throw new Error("La fecha de alta no puede ser anterior a la fecha de nacimiento");
            }
        }

        // Validar password si se proporciona
        if (datosPaciente.password !== undefined) {
            if (typeof datosPaciente.password !== 'string' || datosPaciente.password.length < 6) {
                throw new Error("La contraseña debe tener al menos 6 caracteres");
            }
        }
    }

    async create(datosPaciente) {
        const pacientes = this.getAll();
        const existing = pacientes.find(p => Number(p.dni) === Number(datosPaciente.dni));
        if (existing) {
            throw new Error(`Ya existe un paciente con el DNI ${datosPaciente.dni}`);
        }

        // Hashear password si se proporciona
        if (datosPaciente.password) {
            datosPaciente.password = await hashPassword(datosPaciente.password);
        }

        return super.create(datosPaciente);
    }

    async getAllPacientes() {
        return this.getAll();
    }

    async getPacienteByDni(dni) {
        const paciente = this.findBy('dni', Number(dni))[0] || null;
        if (!paciente) {
            throw new Error(`Paciente con DNI ${dni} no encontrado`);
        }
        return paciente;
    }

    findPacienteByDni(dni) {
        return this.findBy('dni', Number(dni))[0] || null;
    }

    getByDni(dni) {
        // Buscar por DNI como número o string
        const pacientes = this.getAll();
        const dniStr = String(dni);
        const dniNum = Number(dni);
        
        return pacientes.find(p => 
            String(p.dni) === dniStr || Number(p.dni) === dniNum
        ) || null;
    }

    async addPaciente(datosPaciente) {
        try {
            return await this.create(datosPaciente);
        } catch (error) {
            throw error;
        }
    }

    async updatePaciente(dni, datosPaciente) {
        const pacientes = this.getAll();
        const paciente = pacientes.find(p => Number(p.dni) === Number(dni));
        
        if (!paciente) {
            throw new Error(`Paciente con DNI ${dni} no encontrado`);
        }

        const {id, dni: dniParam, createdAt, ...allowedUpdates} = datosPaciente;

        // Hashear password si se proporciona en el update
        if (allowedUpdates.password) {
            allowedUpdates.password = await hashPassword(allowedUpdates.password);
        }

        try {
            const updated = this.update(paciente.id, allowedUpdates);
            if (!updated) {
                throw new Error("Error al actualizar el paciente");
            }
            return updated;
        } catch (error) {
            throw error;
        }
    }

    async deletePaciente(dni) {
        const pacientes = this.getAll();
        const paciente = pacientes.find(p => Number(p.dni) === Number(dni));
        
        if (!paciente) {
            throw new Error(`Paciente con DNI ${dni} no encontrado`);
        }

        const deleted = this.delete(paciente.id);
        if (!deleted) {
            throw new Error("Error al eliminar el paciente");
        }

        return paciente;
    }
}
