import {
    getAllTareas,
    getTareaById,
    createTarea,
    updateTarea,
    deleteTarea,
} from "./tareas.model.js";
import { isDateInRange } from "./tareas.utils.js";

export const getTareas = (req, res) => {
    res.json(getAllTareas());
};

export const getTarea = (req, res) => {
    const tarea = getTareaById(req.params.id);
    if (!tarea) return res.status(404).json({ error: "Tarea no encontrada" });
    res.json(tarea);
};

export const addTarea = (req, res) => {
    const nuevaTarea = createTarea(req.body);
    res.status(201).json(nuevaTarea);
};

export const editTarea = (req, res) => {
    const tarea = updateTarea(req.params.id, req.body);
    if (!tarea) return res.status(404).json({ error: "Tarea no encontrada" });
    res.json(tarea);
};

export const removeTarea = (req, res) => {
    deleteTarea(req.params.id);
    res.json({ message: "Tarea eliminada" });
};


// filters
export const getTareasByEstado = (req, res) => {
    const { estado } = req.params;
    const tareas = getAllTareas();
    const filtradas = tareas.filter(t => t.estado.toLowerCase() === estado.toLowerCase());
    res.json(filtradas);
};

export const getTareasByPrioridad = (req, res) => {
    const { prioridad } = req.params;
    const tareas = getAllTareas();
    const filtradas = tareas.filter(t => t.prioridad.toLowerCase() === prioridad.toLowerCase());
    res.json(filtradas);
};

export const getTareasByEmpleado = (req, res) => {
    const { empleadoId } = req.params;
    const tareas = getAllTareas();
    const filtradas = tareas.filter(t => t.empleadoId == empleadoId);

    if (filtradas.length === 0) {
        return res.status(200).json({
            message: `No se encontraron tareas para el empleado con id ${empleadoId}`
        });
    }

    res.json(filtradas);
};

export const getTareasByPaciente = (req, res) => {
    const { pacienteId } = req.params;
    if (!pacienteId) {
        return ("No se encontraron tareas para el paciente solicitado")
    } else {
        const tareas = getAllTareas();
        const filtradas = tareas.filter(t => t.pacienteId == pacienteId);

        if (filtradas.length === 0) {
            return res.status(200).json({
                message: `No se encontraron tareas para el paciente con id ${pacienteId}`
            });
        }

        res.json(filtradas);
    }
};

export const getTareasByFecha = (req, res) => {
    const { inicio, fin, tipo = 'inicio' } = req.query;
    const tareas = getAllTareas();

    if (!inicio && !fin) {
        return res.json(tareas);
    }

    const filtradas = tareas.filter(t => {
        let fechaAComparar;

        switch (tipo) {
            case 'creacion':
                fechaAComparar = t.createdAt;
                break;
            case 'finalizacion':
                fechaAComparar = t.fechaFin;
                break;
            case 'inicio':
            default:
                fechaAComparar = t.fechaInicio;
                break;
        }

        return isDateInRange(fechaAComparar, inicio, fin);
    });

    if (filtradas.length === 0) {
        return res.status(200).json({
            message: "No se encontraron tareas en el rango solicitado",
            filtros: { inicio, fin, tipo }
        });
    }

    res.json(filtradas);
};

