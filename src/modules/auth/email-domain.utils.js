// Regla de negocio: Empleados = @saludintegral.com, Pacientes = otros dominios
const DOMINIOS_EMPLEADOS = process.env.EMAIL_DOMINIOS_EMPLEADOS 
    ? process.env.EMAIL_DOMINIOS_EMPLEADOS.split(',').map(d => d.trim().toLowerCase())
    : ['@saludintegral.com'];

export const extractDomain = (email) => {
    if (!email || typeof email !== 'string') {
        return null;
    }
    
    const parts = email.toLowerCase().split('@');
    if (parts.length !== 2) {
        return null;
    }
    
    return `@${parts[1]}`;
};

export const isEmpleadoEmail = (email) => {
    const domain = extractDomain(email);
    if (!domain) {
        return false;
    }
    
    return DOMINIOS_EMPLEADOS.includes(domain);
};

export const isPacienteEmail = (email) => {
    const domain = extractDomain(email);
    if (!domain) return false;
    return !isEmpleadoEmail(email);
};

export const detectUserTypeByEmail = (email) => {
    if (!email) {
        return null;
    }
    
    if (isEmpleadoEmail(email)) {
        return 'empleado';
    }
    
    if (isPacienteEmail(email)) {
        return 'paciente';
    }
    
    return null;
};

export const validateEmailForUserType = (email, tipoUsuario) => {
    if (!email || !tipoUsuario) {
        return false;
    }
    
    if (tipoUsuario === 'empleado') {
        return isEmpleadoEmail(email);
    }
    
    if (tipoUsuario === 'paciente') {
        return isPacienteEmail(email);
    }
    
    return false;
};

export const getEmpleadoDomains = () => {
    return [...DOMINIOS_EMPLEADOS];
};

export const addEmpleadoDomain = (domain) => {
    const normalizedDomain = domain.toLowerCase().startsWith('@') 
        ? domain.toLowerCase() 
        : `@${domain.toLowerCase()}`;
    
    if (!DOMINIOS_EMPLEADOS.includes(normalizedDomain)) {
        DOMINIOS_EMPLEADOS.push(normalizedDomain);
    }
};

