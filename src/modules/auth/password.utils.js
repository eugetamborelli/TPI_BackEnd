import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Hashea una contraseña en texto plano
 * @param {string} plainPassword - Contraseña en texto plano
 * @returns {Promise<string>} Contraseña hasheada
 */
export const hashPassword = async (plainPassword) => {
    if (!plainPassword || typeof plainPassword !== "string") {
        throw new Error("La contraseña debe ser una cadena de texto");
    }

    if (plainPassword.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

/**
 * Verifica si una contraseña en texto plano coincide con un hash
 * @param {string} plainPassword - Contraseña en texto plano
 * @param {string} hashedPassword - Contraseña hasheada
 * @returns {Promise<boolean>} true si coinciden, false en caso contrario
 */
export const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

