class ValidationService {
    static validateRequiredFields(data, requiredFields, isUpdate = false) {
        if (isUpdate) return;
        
        const missingFields = requiredFields.filter(field => !data[field]);
        if (missingFields.length > 0) {
            throw new Error(`Campos obligatorios faltantes: ${missingFields.join(', ')}`);
        }
    }

    static validateEnum(field, value, validOptions) {
        if (value && !validOptions.includes(value.toLowerCase())) {
            throw new Error(`${field} inválido. Valores permitidos: ${validOptions.join(', ')}`);
        }
    }

    static validateEmail(email) {
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error("Email inválido");
            }
        }
    }

    static validateDni(dni) {
        if (dni && isNaN(Number(dni))) {
            throw new Error("DNI debe ser un número válido");
        }
    }

    static validateDate(date, allowFuture = false) {
        if (date) {
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                throw new Error("Fecha inválida");
            }
            if (!allowFuture && dateObj > new Date()) {
                throw new Error("La fecha no puede ser futura");
            }
        }
    }

    static validateDateRange(startDate, endDate) {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (start > end) {
                throw new Error("La fecha de inicio no puede ser posterior a la fecha de fin");
            }
        }
    }

    static validatePhone(phone) {
        if (phone) {
            const phoneRegex = /^[0-9\s\-()+]+$/;
            if (!phoneRegex.test(phone)) {
                throw new Error("Teléfono inválido");
            }
        }
    }
}

export default ValidationService;