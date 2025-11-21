# 📋 Guía de Endpoints - Postman Collection

## 🔧 Configuración Inicial

### Base URL
```
http://localhost:3000
```

### Variables de Postman (Recomendado)
Crea variables de entorno en Postman:
- `base_url`: `http://localhost:3000`
- `token`: (se actualizará después del login)

---

## 🔐 1. AUTENTICACIÓN

### 1.1 Login (Empleado con Email)
**POST** `{{base_url}}/auth/login`

**Ejemplo de URL completa:**
```
POST http://localhost:3000/auth/login
```

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "juan.perez@saludintegral.com",
  "password": "contraseña123"
}
```

**Ejemplo de Respuesta:**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 102,
    "nombre": "Juan",
    "apellido": "Pérez",
    "dni": "28999111",
    "email": "juan.perez@saludintegral.com",
    "rol": "médico",
    "area": "Atención Médica"
  },
  "tipoUsuario": "empleado"
}
```

**Nota:** Guarda el `token` de la respuesta para usar en otros endpoints.

---

### 1.2 Login (Paciente con Email)
**POST** `{{base_url}}/auth/login`

**Ejemplo de URL completa:**
```
POST http://localhost:3000/auth/login
```

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "juan.perez@example.com",
  "password": "contraseña123"
}
```

**Ejemplo de Respuesta:**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "dni": 12345678,
    "email": "juan.perez@example.com",
    "fechaNacimiento": "1985-04-20",
    "telefono": "1123456789"
  },
  "tipoUsuario": "paciente"
}
```

---

### 1.3 Login (Solo con DNI - Fallback)
**POST** `{{base_url}}/auth/login`

**Ejemplo de URL completa:**
```
POST http://localhost:3000/auth/login
```

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "dni": "12345678",
  "password": "contraseña123"
}
```

**Nota:** El sistema busca primero en empleados, luego en pacientes.

---

### 1.4 Verificar Token
**GET** `{{base_url}}/auth/verify`

**Ejemplo de URL completa:**
```
GET http://localhost:3000/auth/verify
```

**Headers:**
```
Authorization: Bearer {{token}}
```

**Ejemplo de Respuesta:**
```json
{
  "message": "Token válido",
  "user": {
    "id": 102,
    "dni": "28999111",
    "tipoUsuario": "empleado",
    "rol": "médico",
    "area": "Atención Médica",
    "nombre": "Juan",
    "apellido": "Pérez"
  }
}
```

---

## 🏥 2. HEALTH CHECK

### 2.1 Health Check
**GET** `{{base_url}}/health`

**Ejemplo de URL completa:**
```
GET http://localhost:3000/health
```

**Headers:** Ninguno requerido

**Ejemplo de Respuesta:**
```json
{
  "status": "OK",
  "message": "API is healthy"
}
```

---

## 👥 3. EMPLEADOS

### 3.1 Obtener Todos los Empleados
**GET** `{{base_url}}/empleados`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Ejemplo de Respuesta:**
```json
[
  {
    "id": 101,
    "nombre": "Carla",
    "apellido": "Méndez",
    "dni": "32123456",
    "rol": "recepcionista",
    "area": "Administración de Turnos",
    "email": "carla.mendez@saludintegral.com",
    "updatedAt": "2025-09-15T22:57:25.109Z"
  }
]
```

---

### 3.2 Obtener Empleado por DNI
**GET** `{{base_url}}/empleados/dni/:dni`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Parámetros de URL:**
- `dni`: DNI del empleado (ej: `32123456`)

**Ejemplo de URL completa:**
```
GET http://localhost:3000/empleados/dni/32123456
```

**Ejemplo de Respuesta:**
```json
{
  "id": 101,
  "nombre": "Carla",
  "apellido": "Méndez",
  "dni": "32123456",
  "rol": "recepcionista",
  "area": "Administración de Turnos",
  "email": "carla.mendez@saludintegral.com",
  "updatedAt": "2025-09-15T22:57:25.109Z"
}
```

---

### 3.3 Obtener Empleados por Rol
**GET** `{{base_url}}/empleados/rol/:rol`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Parámetros de URL:**
- `rol`: Rol del empleado (ej: `médico`, `recepcionista`, `enfermera`, `administrador`, `encargado de stock`)

**Ejemplo de URL completa:**
```
GET http://localhost:3000/empleados/rol/médico
```

**Nota:** Si el rol contiene espacios, usa codificación URL (ej: `encargado%20de%20stock`)

---

### 3.4 Obtener Empleados por Área
**GET** `{{base_url}}/empleados/area/:area`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Parámetros de URL:**
- `area`: Área del empleado (ej: `Atención Médica`, `Administración de Turnos`)

**Ejemplo de URL completa:**
```
GET http://localhost:3000/empleados/area/Atención%20Médica
```

**Nota:** Si el área contiene espacios, usa codificación URL

---

### 3.5 Obtener Empleado por ID
**GET** `{{base_url}}/empleados/:id`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Parámetros de URL:**
- `id`: ID del empleado (ej: `101`)

**Ejemplo de URL completa:**
```
GET http://localhost:3000/empleados/101
```

**Ejemplo de Respuesta:**
```json
{
  "id": 101,
  "nombre": "Carla",
  "apellido": "Méndez",
  "dni": "32123456",
  "rol": "recepcionista",
  "area": "Administración de Turnos",
  "email": "carla.mendez@saludintegral.com",
  "updatedAt": "2025-09-15T22:57:25.109Z"
}
```

**⚠️ Importante:** Esta ruta debe usarse DESPUÉS de intentar las rutas específicas (`/dni/:dni`, `/rol/:rol`, `/area/:area`). Si necesitas buscar por un ID numérico, usa esta ruta.

---

### 3.6 Crear Empleado
**POST** `{{base_url}}/empleados`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Ejemplo de URL completa:**
```
POST http://localhost:3000/empleados
```

**Body (JSON):**
```json
{
  "nombre": "Pedro",
  "apellido": "García",
  "dni": "33444555",
  "rol": "médico",
  "area": "Atención Médica",
  "email": "pedro.garcia@saludintegral.com",
  "password": "contraseña123"
}
```

**Campos Requeridos:**
- `nombre`: string
- `apellido`: string
- `dni`: string o number (único)
- `rol`: string
- `area`: string

**Campos Opcionales:**
- `email`: string (debe tener dominio `@saludintegral.com`)
- `password`: string (mínimo 6 caracteres, se hashea automáticamente)

**Ejemplo de Respuesta:**
```json
{
  "id": 107,
  "nombre": "Pedro",
  "apellido": "García",
  "dni": "33444555",
  "rol": "médico",
  "area": "Atención Médica",
  "email": "pedro.garcia@saludintegral.com",
  "createdAt": "2025-11-20T10:00:00.000Z",
  "updatedAt": "2025-11-20T10:00:00.000Z"
}
```

---

### 3.7 Actualizar Empleado
**PATCH** `{{base_url}}/empleados/:id`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Parámetros de URL:**
- `id`: ID del empleado

**Ejemplo de URL completa:**
```
PATCH http://localhost:3000/empleados/101
```

**Body (JSON):**
```json
{
  "nombre": "Pedro",
  "apellido": "García López",
  "rol": "médico",
  "area": "Emergencias",
  "password": "nuevaContraseña123"
}
```

**Nota:** Todos los campos son opcionales. Solo envía los que quieres actualizar.

---

### 3.8 Eliminar Empleado
**DELETE** `{{base_url}}/empleados/:id`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Parámetros de URL:**
- `id`: ID del empleado

**Ejemplo de URL completa:**
```
DELETE http://localhost:3000/empleados/101
```

**Ejemplo de Respuesta:**
```json
{
  "message": "Eliminado correctamente"
}
```

---

## 🏥 4. PACIENTES

**⚠️ Nota Importante:** Los endpoints de pacientes están diseñados principalmente para vistas HTML. Si necesitas respuestas JSON, considera crear endpoints adicionales en el controlador.

### 4.1 Obtener Todos los Pacientes (Vista HTML)
**GET** `{{base_url}}/pacientes/listado`

**Headers:** Ninguno requerido (es una vista, no API JSON)

**Query Parameters (Opcional):**
- `dni`: Filtrar por DNI (ej: `?dni=12345678`)

**Ejemplo de URL completa:**
```
GET http://localhost:3000/pacientes/listado
GET http://localhost:3000/pacientes/listado?dni=12345678
```

**Nota:** Este endpoint renderiza una vista HTML. Para API JSON, revisa el modelo.

---

### 4.2 Crear Paciente
**POST** `{{base_url}}/pacientes/nuevo-paciente`

**Headers:**
```
Content-Type: application/json
```

**Ejemplo de URL completa:**
```
POST http://localhost:3000/pacientes/nuevo-paciente
```

**Body (JSON):**
```json
{
  "nombre": "Carlos",
  "apellido": "Martínez",
  "dni": "44555666",
  "fechaNacimiento": "1995-05-15",
  "telefono": "1155566677",
  "email": "carlos.martinez@example.com",
  "direccion": "Av. Corrientes 1234",
  "obraSocial": "OSDE",
  "fechaAlta": "2025-11-20"
}
```

**Campos Requeridos:**
- `nombre`: string
- `apellido`: string
- `dni`: string o number (único)
- `fechaNacimiento`: string (formato: `YYYY-MM-DD`)
- `telefono`: string

**Campos Opcionales:**
- `email`: string (validado)
- `direccion`: string
- `obraSocial`: string
- `fechaAlta`: string (formato: `YYYY-MM-DD`)
- `historiaClinicaId`: number

---

### 4.3 Actualizar Paciente
**PATCH** `{{base_url}}/pacientes/editar/:dni`

**Headers:**
```
Content-Type: application/json
```

**Parámetros de URL:**
- `dni`: DNI del paciente

**Ejemplo de URL completa:**
```
PATCH http://localhost:3000/pacientes/editar/12345678
```

**Body (JSON):**
```json
{
  "nombre": "Carlos",
  "apellido": "Martínez López",
  "telefono": "1155566677",
  "email": "carlos.martinez.nuevo@example.com",
  "direccion": "Av. Corrientes 1234, Piso 5"
}
```

**Nota:** Todos los campos son opcionales excepto que no puedes cambiar el DNI.

---

### 4.4 Eliminar Paciente
**DELETE** `{{base_url}}/pacientes/:dni`

**Headers:** Ninguno requerido

**Parámetros de URL:**
- `dni`: DNI del paciente

**Ejemplo de URL completa:**
```
DELETE http://localhost:3000/pacientes/12345678
```

---

## ✅ 5. TAREAS

### 5.1 Obtener Todas las Tareas
**GET** `{{base_url}}/tareas`

**Ejemplo de URL completa:**
```
GET http://localhost:3000/tareas
```

**Headers:**
```
Authorization: Bearer {{token}}
```

**Ejemplo de Respuesta:**
```json
[
  {
    "id": 1,
    "titulo": "Revisión de historia clínica",
    "descripcion": "Revisar historia clínica del paciente Juan Pérez",
    "estado": "en_progreso",
    "prioridad": "alta",
    "empleadoId": 101,
    "pacienteId": 201,
    "fechaInicio": "2025-09-01",
    "fechaFin": null,
    "createdAt": "2025-09-08T10:00:00Z",
    "updatedAt": "2025-09-14T10:00:00Z"
  }
]
```

---

### 5.2 Obtener Tarea por ID
**GET** `{{base_url}}/tareas/:id`

**Ejemplo de URL completa:**
```
GET http://localhost:3000/tareas/1
```

**Headers:**
```
Authorization: Bearer {{token}}
```

**Parámetros de URL:**
- `id`: ID de la tarea

---

### 5.3 Obtener Tareas por Estado
**GET** `{{base_url}}/tareas/estado/:estado`

**Ejemplo de URL completa:**
```
GET http://localhost:3000/tareas/estado/pendiente
```

**Headers:**
```
Authorization: Bearer {{token}}
```

**Parámetros de URL:**
- `estado`: Estado de la tarea
  - Valores válidos: `pendiente`, `en_progreso`, `completada`, `cancelada`

**Ejemplo:**
```
GET /tareas/estado/pendiente
```

---

### 5.4 Obtener Tareas por Prioridad
**GET** `{{base_url}}/tareas/prioridad/:prioridad`

**Ejemplo de URL completa:**
```
GET http://localhost:3000/tareas/prioridad/alta
```

**Headers:**
```
Authorization: Bearer {{token}}
```

**Parámetros de URL:**
- `prioridad`: Prioridad de la tarea
  - Valores válidos: `baja`, `media`, `alta`, `urgente`

**Ejemplo:**
```
GET /tareas/prioridad/alta
```

---

### 5.5 Obtener Tareas por Empleado
**GET** `{{base_url}}/tareas/empleado/:empleadoId`

**Ejemplo de URL completa:**
```
GET http://localhost:3000/tareas/empleado/101
```

**Headers:**
```
Authorization: Bearer {{token}}
```

**Parámetros de URL:**
- `empleadoId`: ID del empleado

**Ejemplo:**
```
GET /tareas/empleado/101
```

---

### 5.6 Obtener Tareas por Paciente
**GET** `{{base_url}}/tareas/paciente/:pacienteId`

**Ejemplo de URL completa:**
```
GET http://localhost:3000/tareas/paciente/201
```

**Headers:**
```
Authorization: Bearer {{token}}
```

**Parámetros de URL:**
- `pacienteId`: ID del paciente

**Ejemplo:**
```
GET /tareas/paciente/201
```

---

### 5.7 Obtener Tareas por Fecha
**GET** `{{base_url}}/tareas/fecha`

**Ejemplo de URL completa:**
```
GET http://localhost:3000/tareas/fecha?inicio=2025-09-01&fin=2025-09-30
```

**Headers:**
```
Authorization: Bearer {{token}}
```

**Query Parameters:**
- `inicio`: Fecha de inicio (formato: `YYYY-MM-DD`)
- `fin`: Fecha de fin (formato: `YYYY-MM-DD`)
- `tipo`: Tipo de fecha a filtrar (opcional)
  - Valores: `inicio` (por defecto), `creacion`, `finalizacion`

**Ejemplos:**
```
GET /tareas/fecha?inicio=2025-09-01&fin=2025-09-30
GET /tareas/fecha?inicio=2025-09-01&fin=2025-09-30&tipo=creacion
```

---

### 5.8 Crear Tarea
**POST** `{{base_url}}/tareas`

**Ejemplo de URL completa:**
```
POST http://localhost:3000/tareas
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "titulo": "Revisar expediente médico",
  "descripcion": "Revisar expediente del paciente Juan Pérez",
  "estado": "pendiente",
  "prioridad": "alta",
  "empleadoId": 101,
  "pacienteId": 201,
  "fechaInicio": "2025-11-20",
  "fechaFin": "2025-11-25"
}
```

**Campos Requeridos:**
- `titulo`: string
- `descripcion`: string
- `estado`: string (valores: `pendiente`, `en_progreso`, `completada`, `cancelada`)
- `prioridad`: string (valores: `baja`, `media`, `alta`, `urgente`)

**Campos Opcionales:**
- `empleadoId`: number
- `pacienteId`: number
- `fechaInicio`: string (formato: `YYYY-MM-DD`)
- `fechaFin`: string (formato: `YYYY-MM-DD`)

**Ejemplo de Respuesta:**
```json
{
  "id": 1757906491315,
  "titulo": "Revisar expediente médico",
  "descripcion": "Revisar expediente del paciente Juan Pérez",
  "estado": "pendiente",
  "prioridad": "alta",
  "empleadoId": 101,
  "pacienteId": 201,
  "fechaInicio": "2025-11-20",
  "fechaFin": "2025-11-25",
  "createdAt": "2025-11-20T10:00:00.000Z",
  "updatedAt": "2025-11-20T10:00:00.000Z"
}
```

---

### 5.9 Actualizar Tarea
**PATCH** `{{base_url}}/tareas/:id`

**Ejemplo de URL completa:**
```
PATCH http://localhost:3000/tareas/1
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Parámetros de URL:**
- `id`: ID de la tarea

**Body (JSON):**
```json
{
  "titulo": "Revisar expediente médico - URGENTE",
  "estado": "en_progreso",
  "prioridad": "urgente"
}
```

**Nota:** Todos los campos son opcionales. Debes enviar al menos uno de: `titulo`, `descripcion`, `estado`, `prioridad`.

---

### 5.10 Eliminar Tarea
**DELETE** `{{base_url}}/tareas/:id`

**Ejemplo de URL completa:**
```
DELETE http://localhost:3000/tareas/1
```

**Headers:**
```
Authorization: Bearer {{token}}
```

**Parámetros de URL:**
- `id`: ID de la tarea

**Ejemplo de Respuesta:**
```json
{
  "message": "Eliminado correctamente"
}
```

---

## 📋 6. HISTORIAS CLÍNICAS

**⚠️ Nota Importante:** Todas las rutas de historias clínicas requieren autenticación y que el usuario sea empleado. Los pacientes no pueden acceder directamente a las historias clínicas.

### 6.1 Obtener Todas las Historias Clínicas
**GET** `{{base_url}}/historias`

**Ejemplo de URL completa:**
```
GET http://localhost:3000/historias
```

**Headers:**
```
Authorization: Bearer {{token}}
```

**Ejemplo de Respuesta:**
```json
[
  {
    "id": 1,
    "pacienteId": 1,
    "fechaCreacion": "2023-01-15",
    "alergias": ["Penicilina", "Polen"],
    "medicamentosActuales": [
      {
        "nombre": "Ibuprofeno",
        "dosis": "400mg",
        "frecuencia": "Cada 8 horas"
      }
    ],
    "antecedentes": {
      "familiares": ["Diabetes tipo 2 en padre"],
      "personales": ["Hipertensión"],
      "quirurgicos": ["Apendicectomía en 2010"]
    },
    "observaciones": "Paciente con seguimiento regular",
    "createdAt": "2023-01-15T10:00:00.000Z",
    "updatedAt": "2023-01-15T10:00:00.000Z"
  }
]
```

---

### 6.2 Obtener Historia Clínica por ID
**GET** `{{base_url}}/historias/:id`

**Ejemplo de URL completa:**
```
GET http://localhost:3000/historias/1
```

**Headers:**
```
Authorization: Bearer {{token}}
```

**Parámetros de URL:**
- `id`: ID de la historia clínica

**Ejemplo de Respuesta:**
```json
{
  "id": 1,
  "pacienteId": 1,
  "fechaCreacion": "2023-01-15",
  "alergias": ["Penicilina", "Polen"],
  "medicamentosActuales": [
    {
      "nombre": "Ibuprofeno",
      "dosis": "400mg",
      "frecuencia": "Cada 8 horas"
    }
  ],
  "antecedentes": {
    "familiares": ["Diabetes tipo 2 en padre"],
    "personales": ["Hipertensión"],
    "quirurgicos": ["Apendicectomía en 2010"]
  },
  "observaciones": "Paciente con seguimiento regular",
  "createdAt": "2023-01-15T10:00:00.000Z",
  "updatedAt": "2023-01-15T10:00:00.000Z"
}
```

---

### 6.3 Obtener Historia Clínica por Paciente (Única/Más Reciente)
**GET** `{{base_url}}/historias/paciente/:pacienteId`

**Ejemplo de URL completa:**
```
GET http://localhost:3000/historias/paciente/1
```

**Headers:**
```
Authorization: Bearer {{token}}
```

**Parámetros de URL:**
- `pacienteId`: ID del paciente

**Ejemplo de Respuesta:**
```json
{
  "id": 1,
  "pacienteId": 1,
  "fechaCreacion": "2023-01-15",
  "alergias": ["Penicilina", "Polen"],
  "medicamentosActuales": [
    {
      "nombre": "Ibuprofeno",
      "dosis": "400mg",
      "frecuencia": "Cada 8 horas"
    }
  ],
  "antecedentes": {
    "familiares": ["Diabetes tipo 2 en padre"],
    "personales": ["Hipertensión"],
    "quirurgicos": ["Apendicectomía en 2010"]
  },
  "observaciones": "Paciente con seguimiento regular",
  "createdAt": "2023-01-15T10:00:00.000Z",
  "updatedAt": "2023-01-15T10:00:00.000Z"
}
```

**Nota:** Retorna la historia clínica más reciente del paciente. Si no existe, retorna 404.

---

### 6.4 Obtener Todas las Historias Clínicas de un Paciente
**GET** `{{base_url}}/historias/paciente/:pacienteId/todas`

**Ejemplo de URL completa:**
```
GET http://localhost:3000/historias/paciente/1/todas
```

**Headers:**
```
Authorization: Bearer {{token}}
```

**Parámetros de URL:**
- `pacienteId`: ID del paciente

**Ejemplo de Respuesta:**
```json
[
  {
    "id": 1,
    "pacienteId": 1,
    "fechaCreacion": "2023-01-15",
    "alergias": ["Penicilina", "Polen"],
    "medicamentosActuales": [
      {
        "nombre": "Ibuprofeno",
        "dosis": "400mg",
        "frecuencia": "Cada 8 horas"
      }
    ],
    "antecedentes": {
      "familiares": ["Diabetes tipo 2 en padre"],
      "personales": ["Hipertensión"],
      "quirurgicos": ["Apendicectomía en 2010"]
    },
    "observaciones": "Paciente con seguimiento regular",
    "createdAt": "2023-01-15T10:00:00.000Z",
    "updatedAt": "2023-01-15T10:00:00.000Z"
  }
]
```

---

### 6.5 Crear Historia Clínica
**POST** `{{base_url}}/historias`

**Ejemplo de URL completa:**
```
POST http://localhost:3000/historias
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "pacienteId": 1,
  "fechaCreacion": "2025-11-20",
  "alergias": ["Penicilina", "Polen"],
  "medicamentosActuales": [
    {
      "nombre": "Ibuprofeno",
      "dosis": "400mg",
      "frecuencia": "Cada 8 horas"
    }
  ],
  "antecedentes": {
    "familiares": ["Diabetes tipo 2 en padre"],
    "personales": ["Hipertensión"],
    "quirurgicos": ["Apendicectomía en 2010"]
  },
  "observaciones": "Paciente con seguimiento regular"
}
```

**Campos Requeridos:**
- `pacienteId`: number (debe existir un paciente con ese ID)

**Campos Opcionales:**
- `fechaCreacion`: string (formato: `YYYY-MM-DD`, se establece automáticamente si no se proporciona)
- `alergias`: array de strings (se inicializa como array vacío si no se proporciona)
- `medicamentosActuales`: array de objetos (se inicializa como array vacío si no se proporciona)
  - Cada medicamento puede tener: `nombre`, `dosis`, `frecuencia`
- `antecedentes`: object (se inicializa como objeto vacío si no se proporciona)
  - Puede contener: `familiares`, `personales`, `quirurgicos` (todos arrays)
- `observaciones`: string

**Ejemplo de Respuesta:**
```json
{
  "id": 3,
  "pacienteId": 1,
  "fechaCreacion": "2025-11-20",
  "alergias": ["Penicilina", "Polen"],
  "medicamentosActuales": [
    {
      "nombre": "Ibuprofeno",
      "dosis": "400mg",
      "frecuencia": "Cada 8 horas"
    }
  ],
  "antecedentes": {
    "familiares": ["Diabetes tipo 2 en padre"],
    "personales": ["Hipertensión"],
    "quirurgicos": ["Apendicectomía en 2010"]
  },
  "observaciones": "Paciente con seguimiento regular",
  "createdAt": "2025-11-20T10:00:00.000Z",
  "updatedAt": "2025-11-20T10:00:00.000Z"
}
```

**Nota:** El sistema valida que el `pacienteId` exista antes de crear la historia clínica.

---

### 6.6 Actualizar Historia Clínica
**PATCH** `{{base_url}}/historias/:id`

**Ejemplo de URL completa:**
```
PATCH http://localhost:3000/historias/1
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Parámetros de URL:**
- `id`: ID de la historia clínica

**Body (JSON):**
```json
{
  "alergias": ["Penicilina", "Polen", "Aspirina"],
  "medicamentosActuales": [
    {
      "nombre": "Ibuprofeno",
      "dosis": "400mg",
      "frecuencia": "Cada 8 horas"
    },
    {
      "nombre": "Paracetamol",
      "dosis": "500mg",
      "frecuencia": "Cada 6 horas"
    }
  ],
  "observaciones": "Paciente con seguimiento regular. Nueva alergia detectada."
}
```

**Nota:** Todos los campos son opcionales. Solo envía los campos que deseas actualizar.

**Ejemplo de Respuesta:**
```json
{
  "id": 1,
  "pacienteId": 1,
  "fechaCreacion": "2023-01-15",
  "alergias": ["Penicilina", "Polen", "Aspirina"],
  "medicamentosActuales": [
    {
      "nombre": "Ibuprofeno",
      "dosis": "400mg",
      "frecuencia": "Cada 8 horas"
    },
    {
      "nombre": "Paracetamol",
      "dosis": "500mg",
      "frecuencia": "Cada 6 horas"
    }
  ],
  "antecedentes": {
    "familiares": ["Diabetes tipo 2 en padre"],
    "personales": ["Hipertensión"],
    "quirurgicos": ["Apendicectomía en 2010"]
  },
  "observaciones": "Paciente con seguimiento regular. Nueva alergia detectada.",
  "createdAt": "2023-01-15T10:00:00.000Z",
  "updatedAt": "2025-11-20T15:30:00.000Z"
}
```

---

### 6.7 Eliminar Historia Clínica
**DELETE** `{{base_url}}/historias/:id`

**Ejemplo de URL completa:**
```
DELETE http://localhost:3000/historias/1
```

**Headers:**
```
Authorization: Bearer {{token}}
```

**Parámetros de URL:**
- `id`: ID de la historia clínica

**Ejemplo de Respuesta:**
```json
{
  "message": "Eliminado correctamente"
}
```

---

## 🔑 Configuración de Token en Postman

### Opción 1: Variable de Entorno
1. Después de hacer login, copia el `token` de la respuesta
2. En Postman, ve a **Environments** → Crea/Edita un entorno
3. Agrega variable `token` con el valor del token
4. En los endpoints que requieren autenticación, usa: `Bearer {{token}}`

### Opción 2: Script de Postman (Automático)
En el endpoint de login, agrega este script en la pestaña **Tests**:

```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    if (jsonData.token) {
        pm.environment.set("token", jsonData.token);
        console.log("Token guardado automáticamente");
    }
}
```

Esto guardará automáticamente el token después de cada login exitoso.

---

## 📝 Notas Importantes

### Autenticación JWT
- Los tokens expiran en **24 horas** por defecto
- El formato del header es: `Authorization: Bearer <token>`
- Si el token expira, recibirás un error 400 con mensaje "Token expirado"

### Validaciones
- **Empleados**: El email debe tener dominio `@saludintegral.com`
- **Pacientes**: El email puede tener cualquier dominio excepto `@saludintegral.com`
- **DNI**: Debe ser único dentro de cada tipo de usuario
- **Contraseñas**: Mínimo 6 caracteres (se hashean automáticamente)

### Códigos de Estado HTTP
- `200`: Éxito
- `201`: Creado exitosamente
- `400`: Error de validación o solicitud incorrecta
- `404`: Recurso no encontrado
- `409`: Conflicto (ej: DNI duplicado)
- `500`: Error interno del servidor

### Formato de Fechas
- Usa formato ISO: `YYYY-MM-DD` (ej: `2025-11-20`)
- Para fechas con hora: `YYYY-MM-DDTHH:mm:ss.sssZ`

---

## 🧪 Usuarios de Prueba

### Empleados Disponibles
```json
{
  "email": "juan.perez@saludintegral.com",
  "dni": "28999111",
  "password": "contraseña123"
}
```

```json
{
  "email": "carla.mendez@saludintegral.com",
  "dni": "32123456",
  "password": "contraseña123"
}
```

### Pacientes Disponibles
```json
{
  "email": "juan.perez@example.com",
  "dni": "12345678",
  "password": "contraseña123"
}
```

**Nota:** Las contraseñas reales están hasheadas en la base de datos. Necesitarás crear nuevos usuarios o actualizar las contraseñas para probar el login.

---

## 📦 Importar a Postman

1. Copia todo el contenido de este archivo
2. En Postman, ve a **Import**
3. Selecciona **Raw text**
4. Pega el contenido
5. Postman detectará automáticamente los endpoints y los organizará en una colección

O crea manualmente cada request usando la información de este documento.

---

**Última actualización:** 2025-11-21

