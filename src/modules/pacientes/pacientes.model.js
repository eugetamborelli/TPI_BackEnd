import BaseModel from "../../common/base/base.model.js";
import ValidationService from "../../common/services/validation.service.js";

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
    }

    // Helper privado para normalizar DNI
    _normalizeDni(dni) {
        return Number(dni);
    }

    // Helper privado para buscar paciente por DNI
    async _findByDni(dni) {
        const pacientes = await this.getAll();
        return pacientes.find(p => Number(p.dni) === this._normalizeDni(dni)) || null;
    }

    // Helper privado para validar DNI único
    async _validateUniqueDni(dni, excludeId = null) {
        if (!dni) return;
        
        const pacientes = await this.getAll();
        const existing = pacientes.find(p => 
            Number(p.dni) === this._normalizeDni(dni) && 
            (!excludeId || p.id !== excludeId)
        );
        
        if (existing) {
            throw new Error(`Ya existe un paciente con el DNI ${dni}`);
        }
    }

    async create(datosPaciente) {
        await this._validateUniqueDni(datosPaciente.dni);
        return await super.create(datosPaciente);
    }

    async update(id, updates) {
        if (updates.dni !== undefined) {
            await this._validateUniqueDni(updates.dni, id);
        }

        return await super.update(id, updates);
    }

    async getPacienteByDni(dni) {
        const paciente = await this._findByDni(dni);
        if (!paciente) {
            throw new Error(`Paciente con DNI ${dni} no encontrado`);
        }
        return paciente;
    }

    async getIdByDni(dni) {
        const paciente = await this.getPacienteByDni(dni);
        return paciente.id;
    }
}
