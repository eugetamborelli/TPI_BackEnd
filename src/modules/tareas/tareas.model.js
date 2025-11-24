import BaseModel from "../../common/base/base.model.js";
import ValidationService from "../../common/services/validation.service.js";
import { isDateInRange, ESTADOS_VALIDOS, PRIORIDADES_VALIDAS } from "./tareas.utils.js";

class TareasModel extends BaseModel {
    constructor() {
        super("tareas");
    }

    validateData(datos, isUpdate = false) {
        const requiredFields = ['titulo', 'descripcion', 'estado', 'prioridad', 'area'];
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
            //opcionales
            empleadoId: datos.empleadoId ? Number(datos.empleadoId) : undefined,
            pacienteId: datos.pacienteId ? Number(datos.pacienteId) : undefined,
            proveedorId: datos.proveedorId ? Number(datos.proveedorId) : undefined,
            area: datos.area?.trim() || null, 
            observaciones: datos.observaciones?.trim() || null,
            fechaInicio: datos.fechaInicio,
            fechaFin: datos.fechaFin
        };

        // Se valida el objeto normalizado
        this.validateData(datosNormalizados); 
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
        if (datos.proveedorId !== undefined) datosNormalizados.proveedorId = Number(datos.proveedorId);
        if (datos.area !== undefined) datosNormalizados.area = datos.area.trim() || null;
        if (datos.observaciones !== undefined) datosNormalizados.observaciones = datos.observaciones.trim() || null;
        if (datos.fechaInicio !== undefined) datosNormalizados.fechaInicio = datos.fechaInicio || null;
        if (datos.fechaFin !== undefined) datosNormalizados.fechaFin = datos.fechaFin || null;

        this.validateData(datosNormalizados, true); // true para update
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

    //Método para tener un array con los filtros
    async buscar(filtros) {
    let resultados = await this.getAll(); 
    
    if (filtros.estado) {
        resultados = resultados.filter(t => t.estado === filtros.estado.toLowerCase());
    }
    if (filtros.prioridad) {
        resultados = resultados.filter(t => t.prioridad === filtros.prioridad.toLowerCase());
    }
    if (filtros.empleadoId) {
        const id = Number(filtros.empleadoId);
        resultados = resultados.filter(t => t.empleadoId === id);
    }
    if (filtros.pacienteId) {
        const id = Number(filtros.pacienteId);
        resultados = resultados.filter(t => t.pacienteId === id);
    }
    if (filtros.inicio || filtros.fin) {
        resultados = resultados.filter(t => {
            const fecha = filtros.tipo === 'creacion' ? t.createdAt : 
            filtros.tipo === 'finalizacion' ? t.fechaFin : t.fechaInicio;
            return isDateInRange(fecha, filtros.inicio, filtros.fin);
        });
    }

    return resultados;
}

    obtenerTodas() { return this.getAll(); }
    obtenerPorId(id) { return this.getById(id); }
    crear(datos) { return this.create(datos); }
    actualizar(id, datos) { return this.update(id, datos); }
    eliminar(id) { return this.delete(id); }
}

export default TareasModel;