<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 4fb4bba (integración con rama de cambios index y app)
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
=======
import fs from "fs";
import path from "path";

const filePath = path.resolve("src/databases/tareas.json");

export const getAllTareas = () => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

export const getTareaById = (id) => {
    const tareas = getAllTareas();
    return tareas.find((t) => t.id === Number(id));
};

export const createTarea = (tarea) => {
    const tareas = getAllTareas();
    const newTarea = { id: Date.now(), ...tarea };
    tareas.push(newTarea);
    fs.writeFileSync(filePath, JSON.stringify(tareas, null, 2));
    return newTarea;
};

export const updateTarea = (id, tarea) => {
    const tareas = getAllTareas();
    const index = tareas.findIndex((t) => t.id === Number(id));
    if (index === -1) return null;
    tareas[index] = { ...tareas[index], ...tarea };
    fs.writeFileSync(filePath, JSON.stringify(tareas, null, 2));
    return tareas[index];
};

export const deleteTarea = (id) => {
    let tareas = getAllTareas();
    tareas = tareas.filter((t) => t.id !== Number(id));
    fs.writeFileSync(filePath, JSON.stringify(tareas, null, 2));
    return true;
};

>>>>>>> 8f92813 (add tarea module)
