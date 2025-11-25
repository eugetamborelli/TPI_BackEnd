# Sistema de Autenticación - Versión Simplificada

## 🎯 Principio: Confiar en el Dominio del Email

**Regla de Negocio:**
- **Empleados**: Email con dominio `@saludintegral.com`
- **Pacientes**: Cualquier otro dominio

**¿Por qué confiar en el dominio?**
- ✅ **Instantáneo**: Detección O(1) sin consultar BD
- ✅ **Seguro**: El dominio es parte del email registrado en BD
- ✅ **Simple**: No requiere endpoints adicionales
- ✅ **Escalable**: Funciona igual con millones de usuarios

---

## 📡 Endpoints (Solo 2)

### 1. Login Unificado
**POST** `/auth/login`

Acepta `email` o `dni` + `password`. Detecta automáticamente el tipo por dominio.

### 2. Verificar Token
**GET** `/auth/verify`

Valida si un token es válido (requiere autenticación).

---

## 🔄 Cómo Funciona

### Flujo con Email (Recomendado)

```
Usuario ingresa: juan.perez@saludintegral.com + password
    ↓
Sistema detecta dominio: @saludintegral.com → EMPLEADO (O(1))
    ↓
Busca solo en tabla empleados
    ↓
Verifica password
    ↓
Genera token JWT con tipoUsuario: "empleado"
```

### Flujo con Solo DNI (Fallback)

```
Usuario ingresa: 12345678 + password
    ↓
No hay email → busca primero en empleados
    ↓
Si no encuentra → busca en pacientes
    ↓
Verifica password
    ↓
Genera token JWT con tipoUsuario detectado
```

---

## 🧪 Ejemplos de Prueba (cURL)

### Base URL
```bash
BASE_URL="http://localhost:3000"
```

### 1. Login de Empleado (con Email)

```bash
curl -X POST ${BASE_URL}/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.perez@saludintegral.com",
    "password": "contraseña123"
  }'
```

**Respuesta:**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "dni": "12345678",
    "email": "juan.perez@saludintegral.com",
    "rol": "medico",
    "area": "cardiologia"
  },
  "tipoUsuario": "empleado"
}
```

### 2. Login de Paciente (con Email)

```bash
curl -X POST ${BASE_URL}/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria.gonzalez@gmail.com",
    "password": "contraseña123"
  }'
```

**Respuesta:**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nombre": "María",
    "apellido": "González",
    "dni": "87654321",
    "email": "maria.gonzalez@gmail.com"
  },
  "tipoUsuario": "paciente"
}
```

### 3. Login con Solo DNI (Fallback)

```bash
curl -X POST ${BASE_URL}/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "dni": "12345678",
    "password": "contraseña123"
  }'
```

### 4. Verificar Token

```bash
# Obtener token del login
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Verificar
curl -X GET ${BASE_URL}/auth/verify \
  -H "Authorization: Bearer ${TOKEN}"
```

**Respuesta:**
```json
{
  "message": "Token válido",
  "user": {
    "id": 1,
    "dni": "12345678",
    "tipoUsuario": "empleado",
    "rol": "medico",
    "area": "cardiologia",
    "nombre": "Juan",
    "apellido": "Pérez"
  }
}
```

---

## 💡 Detección de Tipo en Frontend

**No necesitas endpoint de detección.** El frontend puede detectar el tipo simplemente mirando el dominio:

```javascript
function detectUserType(email) {
  if (!email) return null;
  
  const domain = email.split('@')[1];
  
  if (domain === 'saludintegral.com') {
    return 'empleado';
  }
  
  return 'paciente';
}

// Uso
const email = "juan.perez@saludintegral.com";
const tipo = detectUserType(email); // "empleado"
```

---

## 🔒 Integración de JWT

### ¿Cómo se Integró JWT?

1. **Instalación**: `jsonwebtoken` y `bcryptjs`

2. **Generación de Token** (`auth.utils.js`):
   ```javascript
   const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
   ```

3. **Token Incluye**:
   - `id`: ID del usuario
   - `dni`: DNI del usuario
   - `tipoUsuario`: "empleado" o "paciente"
   - `rol`, `area`: Solo para empleados
   - `iat`, `exp`: Timestamps automáticos

4. **Verificación** (`auth.middleware.js`):
   - Extrae token del header `Authorization: Bearer <token>`
   - Verifica firma y expiración
   - Decodifica payload
   - Carga datos actualizados del usuario en `req.user`

### Ventajas de JWT

- ✅ **Stateless**: No requiere sesiones en servidor
- ✅ **Escalable**: Funciona en múltiples servidores
- ✅ **Portable**: El token contiene toda la información necesaria
- ✅ **Seguro**: Firmado con secreto, no se puede falsificar

---

## 📊 Comparación: Antes vs Ahora

| Aspecto | Antes (Complejo) | Ahora (Simplificado) |
|---------|------------------|---------------------|
| **Endpoints** | 5 endpoints | 2 endpoints |
| **Detección de tipo** | Endpoint `/detect-type` | Frontend detecta por dominio |
| **Login** | 3 endpoints separados | 1 endpoint unificado |
| **Código** | ~400 líneas | ~170 líneas |
| **Complejidad** | Alta | Baja |
| **Performance** | Igual | Igual |

---

## ✅ Ventajas de la Simplificación

1. **Menos código**: Más fácil de mantener
2. **Menos endpoints**: API más simple
3. **Misma funcionalidad**: Todo sigue funcionando
4. **Mejor UX**: Frontend puede detectar tipo sin consultar servidor
5. **Más rápido**: Menos requests al servidor

---

## 🚀 Uso Recomendado

### Frontend: Detección Local

```javascript
// El frontend detecta el tipo antes de hacer login
const email = "juan.perez@saludintegral.com";
const tipo = email.includes('@saludintegral.com') ? 'empleado' : 'paciente';

// Personalizar UI según tipo
if (tipo === 'empleado') {
  showEmpleadoFields();
} else {
  showPacienteFields();
}

// Hacer login (el backend confirma el tipo)
const response = await fetch('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
```

---

## 📝 Resumen

**Sistema Simplificado:**
- ✅ 1 endpoint de login (detecta tipo automáticamente)
- ✅ 1 endpoint de verificación
- ✅ Confía en el dominio del email
- ✅ Frontend detecta tipo localmente
- ✅ JWT integrado completamente
- ✅ Código más limpio y mantenible

**Principio:** Si el dominio es `@saludintegral.com` → es empleado. Si no → es paciente. Simple y efectivo.

