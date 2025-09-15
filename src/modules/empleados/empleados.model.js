import fs from "fs";
import path from "path";

const filePath = path.resolve("src/databases/empleados.json");

export const getAllEmpleados = () => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data || "[]");
};

export const getEmpleadoById = (id) => {
  const empleados = getAllEmpleados();
  return empleados.find(e => e.id === Number(id));
};

export const createEmpleado = (empleado) => {
  const empleados = getAllEmpleados();
  const nuevo = { id: Date.now(), ...empleado };
  empleados.push(nuevo);
  fs.writeFileSync(filePath, JSON.stringify(empleados, null, 2));
  return nuevo;
};

export const updateEmpleado = (id, patch) => {
  const empleados = getAllEmpleados();
  const index = empleados.findIndex(e => e.id === Number(id));
  if (index === -1) return null;
  empleados[index] = { ...empleados[index], ...patch };
  fs.writeFileSync(filePath, JSON.stringify(empleados, null, 2));
  return empleados[index];
};

export const deleteEmpleado = (id) => {
  let empleados = getAllEmpleados();
  const before = empleados.length;
  empleados = empleados.filter(e => e.id !== Number(id));
  fs.writeFileSync(filePath, JSON.stringify(empleados, null, 2));
  return empleados.length !== before; // true si borró algo
};
