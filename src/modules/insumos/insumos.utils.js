import fs from "fs";
import path from "path";

// ==== Lectura/Escritura del JSON de insumos ====
const filePath = path.resolve("src/databases/insumos.json");

export const readInsumosFile = () => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error("Error reading insumos file:", error);
    return [];
  }
};

export const writeInsumosFile = (insumos) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(insumos, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing insumos file:", error);
    return false;
  }
};

export const getNextId = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return 1;
  const maxId = Math.max(...arr.map(i => Number(i.id) || 0));
  return maxId + 1;
};
