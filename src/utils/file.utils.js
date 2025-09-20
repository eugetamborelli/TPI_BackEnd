import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const readJsonFile = async (fileName) => {
    const filePath = getFilePath(fileName);
    try {
        await fs.access(filePath).catch(async () => {
        await fs.writeFile(filePath, JSON.stringify([], null, 2));
        });

        const data = await fs.readFile(filePath, "utf8");
        return JSON.parse(data || "[]");
    } catch (error) {
        console.error(`Error reading ${fileName} file:`, error);
        return [];
    }
}

export const writeJsonFile = async (fileName, data) => {
    const filePath = getFilePath(fileName);
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${fileName} file:`, error);
        return false;
    }
}

//Obtiene el path de los archivos de BD
const getFilePath = (fileName) => {
    return path.join(__dirname, "../databases", `${fileName}.json`);
}