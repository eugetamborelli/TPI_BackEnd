import { writeTareasFile, readTareasFile } from "./tareas.utils.js";

export const getAllTareas = async () => {
    return readTareasFile(); 
};

export const getTareaById = async (id) => {
    const tareas = await getAllTareas(); 
    return tareas.find((t) => t.id === Number(id));
};


export const createTarea = async (tareaData) => {
    const tareas = await getAllTareas(); 

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


export const updateTarea = async (id, tareaData) => {
    const tareas = await getAllTareas(); 
    const index = tareas.findIndex((t) => t.id === Number(id));

    if (index === -1) return null;

    const idNum = Number(id);

    tareas[index] = {
        ...tareas[index],
        ...tareaData,
        updatedAt: new Date().toISOString(),
        id: idNum
    };

    if (writeTareasFile(tareas)) {
        return tareas[index];
    } else {
        throw new Error('Error al actualizar la tarea');
    }
};


export const deleteTarea = async (id) => {
    let tareas = await getAllTareas(); 
    const initialLength = tareas.length;

    tareas = tareas.filter((t) => t.id !== Number(id));

    if (tareas.length === initialLength) {
        return false; 
    }

    return writeTareasFile(tareas); 
};