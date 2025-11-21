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
    _findByDni(dni) {
        return this.findBy('dni', this._normalizeDni(dni))[0] || null;
    }

    // Helper privado para validar DNI único
    _validateUniqueDni(dni, excludeId = null) {
        if (!dni) return;
        
        const pacientes = this.getAll();
        const existing = pacientes.find(p => 
            Number(p.dni) === this._normalizeDni(dni) && 
            (!excludeId || p.id !== excludeId)
        );
        
        if (existing) {
            throw new Error(`Ya existe un paciente con el DNI ${dni}`);
        }
    }

    create(datosPaciente) {
        this._validateUniqueDni(datosPaciente.dni);
        return super.create(datosPaciente);
    }

    update(id, updates) {
        // Validar DNI único si se está actualizando
        if (updates.dni !== undefined) {
            const paciente = this.getById(id);
            if (paciente) {
                this._validateUniqueDni(updates.dni, id);
            }
        }
        return super.update(id, updates);
    }

    getAllPacientes() {
        return this.getAll();
    }

    getPacienteByDni(dni) {
        const paciente = this._findByDni(dni);
        if (!paciente) {
            throw new Error(`Paciente con DNI ${dni} no encontrado`);
        }
        return paciente;
    }

    addPaciente(datosPaciente) {
        return this.create(datosPaciente);
    }

    updatePaciente(dni, datosPaciente) {
        const paciente = this._findByDni(dni);
        
        if (!paciente) {
            throw new Error(`Paciente con DNI ${dni} no encontrado`);
        }

        const {id: _ignoreId, dni: _ignoreDni, createdAt: _ignoreCreatedAt, ...allowedUpdates} = datosPaciente;

        const updated = this.update(paciente.id, allowedUpdates);
        if (!updated) {
            throw new Error("Error al actualizar el paciente");
        }
        return updated;
    }

    deletePaciente(dni) {
        const paciente = this._findByDni(dni);
        
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
