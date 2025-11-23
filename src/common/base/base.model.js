import FileService from '../services/file.service.js';

class BaseModel {
    constructor(fileName) {
        if (new.target === BaseModel) {
            throw new Error("BaseModel es una clase abstracta y no puede ser instanciada directamente");
        }
        this.fileName = fileName;
    }

    validateData(data, isUpdate = false) {
        throw new Error("validateData debe ser implementado por la clase hija");
    }

    async getAll() {
        return FileService.readJsonFile(this.fileName);
    }

    async getById(id) {
        const data = this.getAll();
        return data.find(item => item.id === Number(id)) || null;
    }

    async findBy(field, value) {
        const data = this.getAll();
        return data.filter(item => item[field] === value);
    }

    async create(itemData) {
        this.validateData(itemData, false);

        const data = this.getAll();
        const id = FileService.getNextId(data);

        const now = new Date().toISOString();
        const newItem = {
            id,
            ...itemData,
            createdAt: now,
            updatedAt: now
        };

        data.push(newItem);
        
        const saved = FileService.writeJsonFile(this.fileName, data);
        if (!saved) {
            throw new Error("Error al guardar el registro");
        }

        return newItem;
    }

    async update(id, updates) {
        this.validateData(updates, true);

        const data = this.getAll();
        const index = data.findIndex(item => item.id === Number(id));
        
        if (index === -1) return null;

        const { id: _ignoreId, createdAt: _ignoreCreatedAt, ...allowedUpdates } = updates;

        data[index] = {
            ...data[index],
            ...allowedUpdates,
            updatedAt: new Date().toISOString()
        };

        const saved = FileService.writeJsonFile(this.fileName, data);
        if (!saved) {
            throw new Error("Error al actualizar el registro");
        }

        return data[index];
    }

    async delete(id) {
        const data = this.getAll();
        const filteredData = data.filter(item => item.id !== Number(id));
        
        const wasDeleted = filteredData.length !== data.length;
        
        if (wasDeleted) {
            const saved = FileService.writeJsonFile(this.fileName, filteredData);
            if (!saved) {
                throw new Error("Error al eliminar el registro");
            }
        }
        
        return wasDeleted;
    }

    async filterBy(field, value) {
        return this.getAll().filter(item => {
            const itemValue = item[field];
            if (typeof itemValue === 'string' && typeof value === 'string') {
                return itemValue.toLowerCase() === value.toLowerCase();
            }
            return itemValue === value;
        });
    }
}

export default BaseModel;