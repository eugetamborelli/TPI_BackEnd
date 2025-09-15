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

