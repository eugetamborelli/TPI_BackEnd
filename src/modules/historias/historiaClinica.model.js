import BaseModel from "../../common/base/base.model.js";
import ValidationService from "../../common/services/validation.service.js";
import Paciente from "../pacientes/pacientes.model.js";

class HistoriaClinicaModel extends BaseModel {
    constructor() {
        super("historiasClinicas");
        this.pacienteModel = new Paciente();
    }

    validateData(historia, isUpdate = false) {
        const requiredFields = ["pacienteId"];
        ValidationService.validateRequiredFields(historia, requiredFields, isUpdate);

        if (historia.pacienteId && isNaN(Number(historia.pacienteId))) {
            throw new Error("El ID del paciente debe ser un número válido");
        }

        if (historia.fechaCreacion) {
            ValidationService.validateDate(historia.fechaCreacion, false);
        }

        // Validar que alergias sea un array si se proporciona
        if (historia.alergias !== undefined && !Array.isArray(historia.alergias)) {
            throw new Error("Las alergias deben ser un array");
        }

        // Validar que medicamentosActuales sea un array si se proporciona
        if (historia.medicamentosActuales !== undefined && !Array.isArray(historia.medicamentosActuales)) {
            throw new Error("Los medicamentos actuales deben ser un array");
        }

        // Validar que antecedentes sea un objeto si se proporciona
        if (historia.antecedentes !== undefined && (typeof historia.antecedentes !== 'object' || Array.isArray(historia.antecedentes))) {
            throw new Error("Los antecedentes deben ser un objeto");
        }
    }

    // Helper privado para validar que el paciente existe
    async _validatePacienteExists(pacienteId) {
        const paciente = await this.pacienteModel.getById(pacienteId);
        
        if (!paciente) {
            throw new Error(`No existe un paciente con ID ${pacienteId}`);
        }
    }

    async create(historia) {
        if (historia.pacienteId) {
            await this._validatePacienteExists(historia.pacienteId);
        }

        // Establecer fecha de creación si no se proporciona
        if (!historia.fechaCreacion) {
            historia.fechaCreacion = new Date().toISOString().split('T')[0];
        }

        // Inicializar arrays vacíos si no se proporcionan
        if (!historia.alergias) {
            historia.alergias = [];
        }
        if (!historia.medicamentosActuales) {
            historia.medicamentosActuales = [];
        }
        if (!historia.antecedentes) {
            historia.antecedentes = {};
        }

        return await super.create(historia);
    }

    // Obtener historias clínicas por paciente
    async getByPacienteId(pacienteId) {
        return await this.findBy('pacienteId', Number(pacienteId));
    }

    // Obtener una historia clínica por paciente (la más reciente o única)
    async getByPacienteIdSingle(pacienteId) {
        const historias = await this.getByPacienteId(pacienteId);
        return historias.length > 0 ? historias[historias.length - 1] : null;
    }

    async getAllHistorias() {
        return await this.getAll();
    }

    async getHistoriaById(id) {
        return await this.getById(id);
    }

    async updateHistoria(id, updates) {
        return await this.update(id, updates);
    }

    async deleteHistoria(id) {
        return await this.delete(id);
    }
}

export default HistoriaClinicaModel;