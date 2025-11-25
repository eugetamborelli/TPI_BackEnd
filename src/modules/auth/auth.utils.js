import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "tu_secreto_super_seguro_cambiar_en_produccion";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

/**
 * Genera un token JWT para un usuario
 * @param {Object} payload - Datos a incluir en el token (ej: { id, dni, rol })
 * @returns {string} Token JWT
 */
export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });
};

/**
 * Verifica y decodifica un token JWT
 * @param {string} token - Token JWT a verificar
 * @returns {Object} Payload decodificado
 * @throws {Error} Si el token es inválido o ha expirado
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new Error("Token expirado");
        }
        if (error.name === "JsonWebTokenError") {
            throw new Error("Token inválido");
        }
        throw error;
    }
};

/**
 * Extrae el token del header Authorization
 * @param {string} authHeader - Header Authorization (formato: "Bearer <token>")
 * @returns {string|null} Token extraído o null si no es válido
 */
export const extractTokenFromHeader = (authHeader) => {
    if (!authHeader) return null;
    
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return null;
    }
    
    return parts[1];
};

