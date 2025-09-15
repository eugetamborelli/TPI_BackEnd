import TareasModel from "./tareas.model.js";

const modelo = new TareasModel();

class TareasController {
    getTareas = (req, res) => {
        try {
            res.json(modelo.obtenerTodas());
        } catch (error) {
            res.status(500).json({ error: "Error al obtener tareas" });
        }
    };

    getTarea = (req, res) => {
        try {
            const tarea = modelo.obtenerPorId(req.params.id);
            tarea ? res.json(tarea) : res.status(404).json({ error: "Tarea no encontrada" });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener tarea" });
        }
    };

    addTarea = (req, res) => {
        try {
            const nuevaTarea = modelo.crear(req.body);
            res.status(201).json(nuevaTarea);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    editTarea = (req, res) => {
        try {
            const tarea = modelo.actualizar(req.params.id, req.body);
            tarea ? res.json(tarea) : res.status(404).json({ error: "Tarea no encontrada" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    removeTarea = (req, res) => {
        try {
            const resultado = modelo.eliminar(req.params.id);
            resultado ? res.json({ message: "Tarea eliminada" }) :
                res.status(404).json({ error: "Tarea no encontrada" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar tarea" });
        }
    };

    getTareasByEstado = (req, res) => {
        try {
            const tareas = modelo.filtrarPorEstado(req.params.estado);
            res.json(tareas);
        } catch (error) {
            res.status(500).json({ error: "Error al filtrar por estado" });
        }
    };

    getTareasByPrioridad = (req, res) => {
        try {
            const tareas = modelo.filtrarPorPrioridad(req.params.prioridad);
            res.json(tareas);
        } catch (error) {
            res.status(500).json({ error: "Error al filtrar por prioridad" });
        }
    };

    getTareasByEmpleado = (req, res) => {
        try {
            const tareas = modelo.filtrarPorEmpleado(req.params.empleadoId);
            res.json(tareas.length > 0 ? tareas : { message: "No hay tareas para este empleado" });
        } catch (error) {
            res.status(500).json({ error: "Error al filtrar por empleado" });
        }
    };

    getTareasByPaciente = (req, res) => {
        try {
            const tareas = modelo.filtrarPorPaciente(req.params.pacienteId);
            res.json(tareas.length > 0 ? tareas : { message: "No hay tareas para este paciente" });
        } catch (error) {
            res.status(500).json({ error: "Error al filtrar por paciente" });
        }
    };

    getTareasByFecha = (req, res) => {
        try {
            const { inicio, fin, tipo = 'inicio' } = req.query;
            const tareas = modelo.filtrarPorFecha(inicio, fin, tipo);
            res.json(tareas.length > 0 ? tareas : { message: "No hay tareas en este rango" });
        } catch (error) {
            res.status(500).json({ error: "Error al filtrar por fecha" });
        }
    };
}

export default new TareasController();
