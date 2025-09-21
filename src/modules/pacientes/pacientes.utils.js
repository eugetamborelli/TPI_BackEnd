import fs from "fs"
import path from "path"

const filePath = path.resolve("src/databases/pacientes.json");

export const readPacientesFile = () => {
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([], null, 2));
            return [];
        }
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data || "[]");
    } catch (error) {
        console.error("Error reading pacientes file:", error);
        return [];
    }
};

export const writePacientesFile = (pacientes) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(pacientes, null, 2));
        return true;
    } catch (error) {
        console.error("Error writing pacientes file:", error);
        return false;
    }
};