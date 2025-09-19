import fs from "fs";
import path from "path";

export const readJsonFile = (fileName) => {
    const filePath = getFilePath(fileName);
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([], null, 2));
            return [];
        }
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data || "[]");
    } catch (error) {
        console.error(`Error reading ${fileName} file:`, error);
        return [];
    }
}

export const writeJsonFile = (fileName, data) => {
    const filePath = getFilePath(fileName);
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${fileName} file:`, error);
        return false;
    }
}

//Obtiene el path de los archivos de BD
const getFilePath = (fileName) => {
    return path.resolve(`src/databases/${fileName}.json`);
}