export const ESTADOS_VALIDOS = ['pendiente', 'en_progreso', 'completada', 'cancelada'];
export const PRIORIDADES_VALIDAS = ['baja', 'media', 'alta', 'urgente'];

export const isDateInRange = (date, start, end) => {
    if (!date) return false;
    const targetDate = new Date(date);
    if (start && new Date(start) > targetDate) return false;
    if (end && new Date(end) < targetDate) return false;
    return true;
};