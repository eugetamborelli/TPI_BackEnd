import { writeTareasFile, readTareasFile } from "./tareas.utils.js"

export const getAllTareas = () => {
    return readTareasFile();
};

export const getTareaById = (id) => {
    const tareas = readTareasFile();
    return tareas.find((t) => t.id === Number(id));
};

export const createTarea = (tareaData) => {
    const tareas = readTareasFile();

    const newId = tareas.length > 0 ? Math.max(...tareas.map(t => t.id)) + 1 : 1;

    const newTarea = {
        id: newId,
        ...tareaData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    tareas.push(newTarea);

    if (writeTareasFile(tareas)) {
        return newTarea;
    } else {
        throw new Error('Error al guardar la tarea');
    }
};

export const updateTarea = (id, tareaData) => {
    const tareas = readTareasFile();
    const index = tareas.findIndex((t) => t.id === Number(id));

    if (index === -1) return null;

    tareas[index] = {
        ...tareas[index],
        ...tareaData,
        updatedAt: new Date().toISOString(),
        id: Number(id)
    };

    if (writeTareasFile(tareas)) {
        return tareas[index];
    } else {
        throw new Error('Error al actualizar la tarea');
    }
};

export const deleteTarea = (id) => {
    let tareas = readTareasFile();
    const initialLength = tareas.length;

    tareas = tareas.filter((t) => t.id !== Number(id));

    if (tareas.length === initialLength) {
        return false;
    }

    return writeTareasFile(tareas);
};