import fs from "fs";
import path from "path";

export const normalizeDate = (dateString) => {
    if (!dateString) return null;

    let date;

    try {
        if (typeof dateString === 'string') {
            if (dateString.includes('T')) {
                date = new Date(dateString);
            } else {
                const [year, month, day] = dateString.split('-').map(Number);
                date = new Date(year, month - 1, day);
            }
        } else if (dateString instanceof Date) {
            date = new Date(dateString);
        } else {
            return null;
        }

        if (isNaN(date.getTime())) {
            return null;
        }

        return new Date(date.getFullYear(), date.getMonth(), date.getDate());

    } catch (error) {
        return null;
    }
};

export const isDateInRange = (dateToCheck, startDate, endDate) => {
    if (!dateToCheck) return false;

    const checkDate = normalizeDate(dateToCheck);
    const start = startDate ? normalizeDate(startDate) : null;
    const end = endDate ? normalizeDate(endDate) : null;

    if (start && !end) {
        return checkDate >= start;
    }

    if (!start && end) {
        return checkDate <= end;
    }

    if (start && end) {
        return checkDate >= start && checkDate <= end;
    }

    return false;
};

const filePath = path.resolve("src/databases/tareas.json");

export const readTareasFile = () => {
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([], null, 2));
            return [];
        }

        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading tareas file:', error);
        return [];
    }
};

export const writeTareasFile = (tareas) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(tareas, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing tareas file:', error);
        return false;
    }
};