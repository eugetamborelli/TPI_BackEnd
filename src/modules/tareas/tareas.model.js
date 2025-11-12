import BaseModel from "../../common/base/base.model.js";
import ValidationService from "../../common/services/validation.service.js";
import { isDateInRange, ESTADOS_VALIDOS, PRIORIDADES_VALIDAS } from "./tareas.utils.js";

class TareasModel extends BaseModel {
    constructor() {
        super("tareas");
    }

    validateData(datos, isUpdate = false) {
        const requiredFields = ['titulo', 'descripcion', 'estado', 'prioridad'];
        ValidationService.validateRequiredFields(datos, requiredFields, isUpdate);

        ValidationService.validateEnum('estado', datos.estado, ESTADOS_VALIDOS);
        ValidationService.validateEnum('prioridad', datos.prioridad, PRIORIDADES_VALIDAS);
        ValidationService.validateDateRange(datos.fechaInicio, datos.fechaFin);
        ValidationService.validateDate(datos.fechaInicio, true);
        ValidationService.validateDate(datos.fechaFin, true);
    }

    create(datos) {
        const datosNormalizados = {
            titulo: datos.titulo?.trim(),
            descripcion: datos.descripcion?.trim(),
            estado: datos.estado?.toLowerCase(),
            prioridad: datos.prioridad?.toLowerCase(),
            empleadoId: datos.empleadoId ? Number(datos.empleadoId) : undefined,
            pacienteId: datos.pacienteId ? Number(datos.pacienteId) : undefined,
            fechaInicio: datos.fechaInicio,
            fechaFin: datos.fechaFin
        };

        return super.create(datosNormalizados);
    }

    update(id, datos) {
        const datosNormalizados = {};
        
        if (datos.titulo !== undefined) datosNormalizados.titulo = datos.titulo.trim();
        if (datos.descripcion !== undefined) datosNormalizados.descripcion = datos.descripcion.trim();
        if (datos.estado !== undefined) datosNormalizados.estado = datos.estado.toLowerCase();
        if (datos.prioridad !== undefined) datosNormalizados.prioridad = datos.prioridad.toLowerCase();
        if (datos.empleadoId !== undefined) datosNormalizados.empleadoId = Number(datos.empleadoId);
        if (datos.pacienteId !== undefined) datosNormalizados.pacienteId = Number(datos.pacienteId);
        if (datos.fechaInicio !== undefined) datosNormalizados.fechaInicio = datos.fechaInicio;
        if (datos.fechaFin !== undefined) datosNormalizados.fechaFin = datos.fechaFin;

        return super.update(id, datosNormalizados);
    }

    filtrarPorEstado(estado) {
        return this.filterBy('estado', estado.toLowerCase());
    }

    filtrarPorPrioridad(prioridad) {
        return this.filterBy('prioridad', prioridad.toLowerCase());
    }

    filtrarPorEmpleado(empleadoId) {
        return this.filterBy('empleadoId', Number(empleadoId));
    }

    filtrarPorPaciente(pacienteId) {
        return this.filterBy('pacienteId', Number(pacienteId));
    }

    filtrarPorFecha(inicio, fin, tipo = 'inicio') {
        const tareas = this.getAll();
        if (!inicio && !fin) return tareas;
        
        return tareas.filter(t => {
            const fecha = tipo === 'creacion' ? t.createdAt : 
                         tipo === 'finalizacion' ? t.fechaFin : t.fechaInicio;
            return isDateInRange(fecha, inicio, fin);
        });
    }

    obtenerTodas() { return this.getAll(); }
    obtenerPorId(id) { return this.getById(id); }
    crear(datos) { return this.create(datos); }
    actualizar(id, datos) { return this.update(id, datos); }
    eliminar(id) { return this.delete(id); }
}

export default TareasModel;