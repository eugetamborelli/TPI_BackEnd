import { readJsonFile, writeJsonFile } from "../../utils/file.utils.js";
import { isDateInRange, ESTADOS_VALIDOS, PRIORIDADES_VALIDAS } from "./tareas.utils.js";

class TareasModel {
    constructor() {
        this.fileName = "tareas";
    }

    leerArchivo = () => readJsonFile(this.fileName);
    escribirArchivo = (datos) => writeJsonFile(this.fileName, datos);

    validarTarea = (datos, esActualizacion = false) => {
        if (!esActualizacion) {
            const camposObligatorios = ['titulo', 'descripcion', 'estado', 'prioridad'];
            const faltantes = camposObligatorios.filter(campo => !datos[campo]);
            if (faltantes.length > 0) {
                throw new Error(`Campos obligatorios faltantes: ${faltantes.join(', ')}`);
            }
        }

        if (datos.estado && !ESTADOS_VALIDOS.includes(datos.estado.toLowerCase())) {
            throw new Error(`Estado inválido. Valores: ${ESTADOS_VALIDOS.join(', ')}`);
        }

        if (datos.prioridad && !PRIORIDADES_VALIDAS.includes(datos.prioridad.toLowerCase())) {
            throw new Error(`Prioridad inválida. Valores: ${PRIORIDADES_VALIDAS.join(', ')}`);
        }

        if (datos.fechaInicio && datos.fechaFin && new Date(datos.fechaInicio) > new Date(datos.fechaFin)) {
            throw new Error("La fecha de inicio no puede ser posterior a la fecha de fin");
        }
    };

    obtenerTodas = () => this.leerArchivo();

    obtenerPorId = (id) => this.leerArchivo().find(t => t.id === Number(id));

    crear = (datos) => {
        this.validarTarea(datos, false);

        const tareas = this.leerArchivo();
        const nuevoId = tareas.length > 0 ? Math.max(...tareas.map(t => t.id)) + 1 : 1;

        const nuevaTarea = {
            id: nuevoId,
            titulo: datos.titulo.trim(),
            descripcion: datos.descripcion.trim(),
            estado: datos.estado.toLowerCase(),
            prioridad: datos.prioridad.toLowerCase(),
            empleadoId: datos.empleadoId ? Number(datos.empleadoId) : undefined,
            pacienteId: datos.pacienteId ? Number(datos.pacienteId) : undefined,
            fechaInicio: datos.fechaInicio,
            fechaFin: datos.fechaFin,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        tareas.push(nuevaTarea);
        this.escribirArchivo(tareas);
        return nuevaTarea;
    };

    actualizar = (id, datos) => {
        this.validarTarea(datos, true);

        const tareas = this.leerArchivo();
        const indice = tareas.findIndex(t => t.id === Number(id));
        if (indice === -1) return null;

        const tareaActualizada = {
            ...tareas[indice],
            ...datos,
            titulo: datos.titulo ? datos.titulo.trim() : tareas[indice].titulo,
            descripcion: datos.descripcion ? datos.descripcion.trim() : tareas[indice].descripcion,
            estado: datos.estado ? datos.estado.toLowerCase() : tareas[indice].estado,
            prioridad: datos.prioridad ? datos.prioridad.toLowerCase() : tareas[indice].prioridad,
            empleadoId: datos.empleadoId !== undefined ? Number(datos.empleadoId) : tareas[indice].empleadoId,
            pacienteId: datos.pacienteId !== undefined ? Number(datos.pacienteId) : tareas[indice].pacienteId,
            updatedAt: new Date().toISOString()
        };

        tareas[indice] = tareaActualizada;
        this.escribirArchivo(tareas);
        return tareaActualizada;
    };

    eliminar = (id) => {
        const tareas = this.leerArchivo();
        const tareasFiltradas = tareas.filter(t => t.id !== Number(id));

        if (tareas.length === tareasFiltradas.length) return false;

        this.escribirArchivo(tareasFiltradas);
        return true;
    };

    filtrarPorEstado = (estado) => this.leerArchivo().filter(t => t.estado === estado.toLowerCase());
    filtrarPorPrioridad = (prioridad) => this.leerArchivo().filter(t => t.prioridad === prioridad.toLowerCase());
    filtrarPorEmpleado = (empleadoId) => this.leerArchivo().filter(t => t.empleadoId === Number(empleadoId));
    filtrarPorPaciente = (pacienteId) => this.leerArchivo().filter(t => t.pacienteId === Number(pacienteId));
    filtrarPorFecha = (inicio, fin, tipo = 'inicio') => {
        const tareas = this.leerArchivo();
        if (!inicio && !fin) return tareas;
        return tareas.filter(t => {
            const fecha = tipo === 'creacion' ? t.createdAt : tipo === 'finalizacion' ? t.fechaFin : t.fechaInicio;
            return isDateInRange(fecha, inicio, fin);
        });
    };
}

export default TareasModel;
