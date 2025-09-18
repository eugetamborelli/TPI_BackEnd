// Validar especialidad
export const especialidadesValidas = ["Cardiología", "Pediatría", "Dermatología", "Neurología"];

export const validarEspecialidad = (especialidad) => {
    return especialidadesValidas.includes(especialidad);
};

// Validar disponibilidad (ejemplo simple: string no vacío)
export const validarDisponibilidad = (disponibilidad) => {
    return typeof disponibilidad === "string" && disponibilidad.trim().length > 0;
};
