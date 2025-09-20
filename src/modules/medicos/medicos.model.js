import fs from "fs";
import path from "path";
import { validarEspecialidad, validarDisponibilidad } from "./medicos.utils.js";
import { getAllTareas } from "../tareas/tareas.model.js"; // Para verificar turnos

// Ruta del archivo JSON
const filePath = path.resolve("src/databases/medicos.json");

// Leer medicos.json
const readMedicosFile = () => {
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([], null, 2));
            return [];
        }
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading medicos file:", error);
        return [];
    }
};

// Escribir medicos.json
const writeMedicosFile = (medicos) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(medicos, null, 2));
        return true;
    } catch (error) {
        console.error("Error writing medicos file:", error);
        return false;
    }
};

// Obtener todos los médicos
export const getAllMedicos = () => readMedicosFile();

// Obtener médico por ID
export const getMedicoById = (id) => {
    const medicos = readMedicosFile();
    return medicos.find((m) => m.id === Number(id));
};

// Crear nuevo médico
export const createMedico = (medicoData) => {
    const medicos = readMedicosFile();

    // Validaciones
    if (!medicoData.nombre || !medicoData.especialidad || !medicoData.consultorio || !medicoData.disponibilidad) {
        throw new Error("Todos los campos son obligatorios");
    }
    if (!validarEspecialidad(medicoData.especialidad)) {
        throw new Error(`Especialidad inválida. Debe ser una de: ${validarEspecialidad.toString()}`);
    }
    if (!validarDisponibilidad(medicoData.disponibilidad)) {
        throw new Error("Disponibilidad inválida");
    }

    // ID incremental
    const newId = medicos.length > 0 ? Math.max(...medicos.map(m => m.id)) + 1 : 1;

    const newMedico = {
        id: newId,
        ...medicoData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    medicos.push(newMedico);

    if (writeMedicosFile(medicos)) {
        return newMedico;
    } else {
        throw new Error("Error al guardar el médico");
    }
};

// Actualizar médico existente
export const updateMedico = (id, medicoData) => {
    const medicos = readMedicosFile();
    const index = medicos.findIndex((m) => m.id === Number(id));

    if (index === -1) return null; // Médico no encontrado

    // Validaciones si se actualiza la especialidad o disponibilidad
    if (medicoData.especialidad && !validarEspecialidad(medicoData.especialidad)) {
        throw new Error(`Especialidad inválida. Debe ser una de: ${validarEspecialidad.toString()}`);
    }
    if (medicoData.disponibilidad && !validarDisponibilidad(medicoData.disponibilidad)) {
        throw new Error("Disponibilidad inválida");
    }

    medicos[index] = {
        ...medicos[index],
        ...medicoData,
        updatedAt: new Date().toISOString(),
        id: Number(id)
    };

    if (writeMedicosFile(medicos)) {
        return medicos[index];
    } else {
        throw new Error("Error al actualizar el médico");
    }
};

// Eliminar médico (verificando turnos)
export const deleteMedico = (id) => {
    const medicos = readMedicosFile();
    const index = medicos.findIndex((m) => m.id === Number(id));

    if (index === -1) return { success: false, message: "Médico no encontrado" };

    // Verificar si tiene tareas/turnos asignados
    const tareas = getAllTareas();
    const turnosAsignados = tareas.filter(t => t.empleadoId === Number(id));

    if (turnosAsignados.length > 0) {
        return { success: false, message: "No se puede eliminar: médico con turnos asignados" };
    }

    medicos.splice(index, 1); // Elimina el médico

    if (writeMedicosFile(medicos)) {
        return { success: true, message: "Médico eliminado correctamente" };
    } else {
        return { success: false, message: "Error al eliminar el médico" };
    }
};

// Exportar utils internos
export { readMedicosFile, writeMedicosFile };
