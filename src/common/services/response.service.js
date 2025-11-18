class ResponseService {
    static success(res, data, status = 200) {
        return res.status(status).json(data);
    }

    static created(res, data) {
        return this.success(res, data, 201);
    }

    static notFound(res, message = "Recurso no encontrado") {
        return res.status(404).json({ error: message });
    }

    static badRequest(res, message) {
        return res.status(400).json({ error: message });
    }

    static conflict(res, message) {
        return res.status(409).json({ error: message });
    }

    static serverError(res, message = "Error interno del servidor") {
        return res.status(500).json({ error: message });
    }

    static deleted(res, message = "Eliminado correctamente") {
        return this.success(res, { message });
    }
}

export default ResponseService;