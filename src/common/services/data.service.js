/**
 * Servicio de utilidades para manipulación de datos
 */
class DataService {
    /**
     * Remueve campos sensibles de un objeto o array de objetos
     * @param {Object|Array} data - Objeto o array de objetos
     * @param {Array} fieldsToRemove - Campos a remover (default: ['password'])
     * @returns {Object|Array} - Objeto o array sin los campos especificados
     */
    static removeSensitiveFields(data, fieldsToRemove = ['password']) {
        if (Array.isArray(data)) {
            return data.map(item => this.removeSensitiveFields(item, fieldsToRemove));
        }
        
        if (data && typeof data === 'object') {
            const { [fieldsToRemove[0]]: _, ...rest } = data;
            return rest;
        }
        
        return data;
    }

    /**
     * Busca un elemento por ID o por un campo específico (útil para DNI)
     * @param {string|number} identifier - ID o valor del campo
     * @param {Function} getById - Función para buscar por ID
     * @param {Function} getByField - Función para buscar por campo alternativo
     * @returns {Object|null} - Elemento encontrado o null
     */
    static findByIdOrField(identifier, getById, getByField) {
        // Intentar buscar por ID si es numérico
        if (!isNaN(identifier)) {
            const byId = getById(Number(identifier));
            if (byId) return byId;
        }
        
        // Buscar por campo alternativo
        if (getByField) {
            return getByField(identifier);
        }
        
        return null;
    }
}

export default DataService;

