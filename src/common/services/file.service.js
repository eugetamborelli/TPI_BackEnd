import fs from "fs";
import path from "path";

class FileService {
    static readJsonFile(fileName) {
        const filePath = this.getFilePath(fileName);
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

    static writeJsonFile(fileName, data) {
        const filePath = this.getFilePath(fileName);
        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error(`Error writing ${fileName} file:`, error);
            return false;
        }
    }

    static getFilePath(fileName) {
        return path.resolve(`src/databases/${fileName}.json`);
    }

    static getNextId(data) {
        if (!Array.isArray(data) || data.length === 0) return 1;
        const maxId = Math.max(...data.map(item => Number(item.id) || 0));
        return maxId + 1;
    }
}

export default FileService;