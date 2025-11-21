import BaseController from "../../common/base/base.controller.js";
import ResponseService from "../../common/services/response.service.js";
import HistoriaClinicaModel from "./historiaClinica.model.js";

const model = new HistoriaClinicaModel();

class HistoriaClinicaController extends BaseController {
    constructor() {
        super(model);
    }

    // Helper privado para manejar errores de validación
    _handleValidationError(error, res, defaultMessage) {
        const validationKeywords = ["obligatorio", "inválido", "debe ser", "deben ser", "existe"];
        if (validationKeywords.some(keyword => error.message.includes(keyword))) {
            return ResponseService.badRequest(res, error.message);
        }
        return ResponseService.serverError(res, defaultMessage);
    }

    getHistorias = (req, res) => {
        try {
            const historias = model.getAll();
            ResponseService.success(res, historias);
        } catch (error) {
            ResponseService.serverError(res, "Error al obtener historias clínicas");
        }
    };

    getHistoria = (req, res) => {
        try {
            const historia = model.getById(req.params.id);
            if (!historia) {
                return ResponseService.notFound(res, "Historia clínica no encontrada");
            }
            ResponseService.success(res, historia);
        } catch (error) {
            ResponseService.serverError(res, "Error al obtener historia clínica");
        }
    };

    getHistoriasByPaciente = (req, res) => {
        try {
            const { pacienteId } = req.params;
            const historias = model.getByPacienteId(pacienteId);
            ResponseService.success(res, historias);
        } catch (error) {
            ResponseService.serverError(res, "Error al obtener historias clínicas del paciente");
        }
    };

    getHistoriaByPaciente = (req, res) => {
        try {
            const { pacienteId } = req.params;
            const historia = model.getByPacienteIdSingle(pacienteId);
            if (!historia) {
                return ResponseService.notFound(res, "Historia clínica no encontrada para este paciente");
            }
            ResponseService.success(res, historia);
        } catch (error) {
            ResponseService.serverError(res, "Error al obtener historia clínica del paciente");
        }
    };

    addHistoria = (req, res) => {
        try {
            const newHistoria = model.create(req.body);
            ResponseService.created(res, newHistoria);
        } catch (error) {
            this._handleValidationError(error, res, "Error al crear historia clínica");
        }
    };

    editHistoria = (req, res) => {
        try {
            const { id } = req.params;
            const updatedHistoria = model.update(id, req.body);
            if (!updatedHistoria) {
                return ResponseService.notFound(res, "Historia clínica no encontrada");
            }
            ResponseService.success(res, updatedHistoria);
        } catch (error) {
            this._handleValidationError(error, res, "Error al actualizar historia clínica");
        }
    };

    removeHistoria = this.delete;
}

export default new HistoriaClinicaController();

