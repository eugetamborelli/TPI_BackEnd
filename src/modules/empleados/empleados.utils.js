import fs from "fs";
import path from "path";

/** Normaliza strings o objetos Date a una fecha “YYYY-MM-DD” sin hora */
export const normalizeDate = (dateString) => {
  if (!dateString) return null;

  let date;
  try {
    if (typeof dateString === "string") {
      if (dateString.includes("T")) {
        date = new Date(dateString);
      } else {
        const [year, month, day] = dateString.split("-").map(Number);
        date = new Date(year, month - 1, day);
      }
    } else if (dateString instanceof Date) {
      date = new Date(dateString);
    } else {
      return null;
    }

    if (isNaN(date.getTime())) return null;

    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  } catch {
    return null;
  }
};

/** Chequea si una fecha está dentro de un rango [startDate, endDate] (inclusive) */
export const isDateInRange = (dateToCheck, startDate, endDate) => {
  if (!dateToCheck) return false;

  const checkDate = normalizeDate(dateToCheck);
  const start = startDate ? normalizeDate(startDate) : null;
  const end = endDate ? normalizeDate(endDate) : null;

  if (start && !end) return checkDate >= start;
  if (!start && end) return checkDate <= end;
  if (start && end) return checkDate >= start && checkDate <= end;

  return false;
};

// ==== Lectura/Escritura del JSON de empleados ====
const filePath = path.resolve("src/databases/empleados.json");

export const readEmpleadosFile = () => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error("Error reading empleados file:", error);
    return [];
  }
};

export const writeEmpleadosFile = (empleados) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(empleados, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing empleados file:", error);
    return false;
  }
};

export const getNextId = (empleados) => {
  if (!Array.isArray(empleados) || empleados.length === 0) return 1;
  const maxId = Math.max(...empleados.map(e => Number(e.id) || 0));
  return maxId + 1;
};
