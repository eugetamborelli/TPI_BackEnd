# TPI_BackEnd

Repositorio para el trabajo integrador de la materia Desarrollo Web (Back-end) — IFTS29.

## 📋 Descripción

API REST y back-end implementado en Node.js (JavaScript) para el sistema de gestión de **Clínica Salud Integral**. El sistema permite gestionar empleados, pacientes, historias clínicas y tareas, con un sistema de autenticación basado en JWT que diferencia automáticamente entre empleados y pacientes según el dominio del email.

## 🎯 Características Principales

- ✅ **Autenticación JWT** con detección automática de tipo de usuario (empleado/paciente)
- ✅ **CRUD completo** para entidades principales:
  - Empleados
  - Pacientes
  - Historias Clínicas
  - Tareas
- ✅ **Rutas RESTful** organizadas por módulos
- ✅ **Vistas renderizadas** con Pug (cuando aplique)
- ✅ **Validación de datos** y manejo centralizado de errores
- ✅ **Base de datos MongoDB** con Mongoose
- ✅ **CORS habilitado** para integración con frontend

## 🛠️ Tecnologías

- **Node.js** + **Express** - Framework web
- **JavaScript (ES6+)** - Lenguaje de programación
- **MongoDB** + **Mongoose** - Base de datos NoSQL
- **Pug** - Motor de plantillas para vistas
- **JWT (jsonwebtoken)** - Autenticación basada en tokens
- **bcryptjs** - Hash de contraseñas
- **dotenv** - Gestión de variables de entorno
- **CORS** - Control de acceso entre orígenes
- **nodemon** - Desarrollo con recarga automática

## 📦 Requisitos

- **Node.js** >= 16
- **npm** >= 8
- **MongoDB** (local o MongoDB Atlas)
- Cuenta de MongoDB Atlas (recomendado) o MongoDB local en funcionamiento

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/eugetamborelli/TPI_BackEnd.git
cd TPI_BackEnd
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

O crea manualmente el archivo `.env` con el siguiente contenido:

```env
# Puerto del servidor
PORT=3000

# Entorno de ejecución
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/tpi_back
# O para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/nombre_db

# JWT Secret (genera uno seguro para producción)
JWT_SECRET=tu_secreto_jwt_super_seguro_aqui
```

### 4. Iniciar el servidor

**Modo desarrollo** (con recarga automática):
```bash
npm run dev
```

**Modo producción**:
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📚 Scripts Disponibles

```bash
npm run dev    # Inicia el servidor en modo desarrollo con nodemon
npm start      # Inicia el servidor en modo producción
npm test       # Ejecuta tests (pendiente de implementar)
```

## 🔐 Sistema de Autenticación

El sistema utiliza un **login unificado** que detecta automáticamente el tipo de usuario según el dominio del email:

- **Empleados**: Email con dominio `@saludintegral.com`
- **Pacientes**: Cualquier otro dominio de email

### Endpoints de Autenticación

#### Login (Empleado o Paciente)
```http
POST /auth/login
Content-Type: application/json

{
  "email": "juan.perez@saludintegral.com",
  "password": "contraseña123"
}
```

O con DNI (fallback):
```json
{
  "dni": "12345678",
  "password": "contraseña123"
}
```

**Respuesta:**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": { ... },
  "tipoUsuario": "empleado" | "paciente"
}
```

#### Verificar Token
```http
GET /auth/verify
Authorization: Bearer <token>
```

## 📡 Endpoints Principales

### Health Check
```http
GET /health
```

### Empleados
- `GET /empleados` - Listar todos los empleados
- `GET /empleados/:id` - Obtener empleado por ID
- `GET /empleados/dni/:dni` - Obtener empleado por DNI
- `GET /empleados/rol/:rol` - Filtrar por rol
- `GET /empleados/area/:area` - Filtrar por área
- `POST /empleados` - Crear empleado
- `PATCH /empleados/:id` - Actualizar empleado
- `DELETE /empleados/:id` - Eliminar empleado

### Pacientes
- `GET /pacientes/listado` - Listar pacientes (vista HTML)
- `POST /pacientes/nuevo-paciente` - Crear paciente
- `PATCH /pacientes/editar/:dni` - Actualizar paciente
- `DELETE /pacientes/:dni` - Eliminar paciente

### Tareas
- `GET /tareas` - Listar todas las tareas
- `GET /tareas/:id` - Obtener tarea por ID
- `GET /tareas/estado/:estado` - Filtrar por estado
- `GET /tareas/prioridad/:prioridad` - Filtrar por prioridad
- `GET /tareas/empleado/:empleadoId` - Filtrar por empleado
- `GET /tareas/paciente/:pacienteId` - Filtrar por paciente
- `GET /tareas/fecha?inicio=YYYY-MM-DD&fin=YYYY-MM-DD` - Filtrar por fecha
- `POST /tareas` - Crear tarea
- `PATCH /tareas/:id` - Actualizar tarea
- `DELETE /tareas/:id` - Eliminar tarea

### Historias Clínicas
- `GET /historias` - Listar todas las historias clínicas
- `GET /historias/:id` - Obtener historia clínica por ID
- `GET /historias/paciente/:pacienteId` - Obtener historia más reciente del paciente
- `GET /historias/paciente/:pacienteId/todas` - Obtener todas las historias del paciente
- `POST /historias` - Crear historia clínica
- `PATCH /historias/:id` - Actualizar historia clínica
- `DELETE /historias/:id` - Eliminar historia clínica

**⚠️ Nota:** La mayoría de los endpoints requieren autenticación mediante token JWT en el header:
```
Authorization: Bearer <token>
```

## 📁 Estructura del Proyecto

```
TPI_BackEnd/
├── src/
│   ├── app.js                 # Configuración de Express
│   ├── index.js               # Punto de entrada de la aplicación
│   ├── common/                # Utilidades y servicios comunes
│   ├── config/                # Archivos de configuración
│   ├── databases/             # Configuración de base de datos
│   ├── models/                # Modelos de datos
│   ├── modules/               # Módulos de la aplicación
│   │   ├── auth/              # Autenticación
│   │   ├── empleados/         # Gestión de empleados
│   │   ├── pacientes/         # Gestión de pacientes
│   │   ├── tareas/            # Gestión de tareas
│   │   ├── historias/         # Historias clínicas
│   │   └── health/            # Health check
│   ├── routes/                # Definición de rutas
│   └── views/                 # Plantillas Pug
├── scripts/                   # Scripts auxiliares
├── .env                       # Variables de entorno (no versionado)
├── .gitignore
├── package.json
├── ENDPOINTS_POSTMAN.md       # Documentación completa de endpoints
├── SISTEMA_AUTENTICACION_SIMPLIFICADO.md
└── README.md                  # Este archivo
```

## 🔒 Seguridad

- Las contraseñas se hashean con **bcryptjs** antes de almacenarse
- Los tokens JWT expiran en **24 horas**
- Validación de dominio de email para diferenciar empleados y pacientes
- Middleware de autenticación para proteger rutas sensibles
- Validación de datos en todos los endpoints

## 📝 Validaciones Importantes

### Empleados
- Email debe tener dominio `@saludintegral.com`
- DNI debe ser único
- Contraseña mínimo 6 caracteres

### Pacientes
- Email puede tener cualquier dominio excepto `@saludintegral.com`
- DNI debe ser único
- Contraseña mínimo 6 caracteres

### Tareas
- Estados válidos: `pendiente`, `en_progreso`, `completada`, `cancelada`
- Prioridades válidas: `baja`, `media`, `alta`, `urgente`

## 🧪 Ejemplos de Uso

### Ejemplo 1: Login y obtener empleados

```bash
# 1. Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.perez@saludintegral.com",
    "password": "contraseña123"
  }'

# 2. Guardar el token de la respuesta y usarlo
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 3. Obtener empleados
curl -X GET http://localhost:3000/empleados \
  -H "Authorization: Bearer $TOKEN"
```

### Ejemplo 2: Crear una tarea

```bash
curl -X POST http://localhost:3000/tareas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "titulo": "Revisar expediente médico",
    "descripcion": "Revisar expediente del paciente Juan Pérez",
    "estado": "pendiente",
    "prioridad": "alta",
    "empleadoId": 101,
    "pacienteId": 201,
    "fechaInicio": "2025-11-20"
  }'
```

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
- Verifica que `MONGODB_URI` esté correctamente configurada en `.env`
- Asegúrate de que MongoDB esté en ejecución (si es local)
- Para MongoDB Atlas, verifica las credenciales y el acceso desde tu IP

### Error de autenticación
- Verifica que el token JWT esté presente en el header `Authorization`
- Asegúrate de que el token no haya expirado (válido por 24 horas)
- Verifica que `JWT_SECRET` esté configurado en `.env`

### Puerto en uso
- Cambia el puerto en `.env` o termina el proceso que está usando el puerto 3000

## 👥 Autores

- Betania Gonzalez ([@Mbetania](https://github.com/Mbetania))
- Eugenia Tamborelli ([@eugetamborelli](https://github.com/eugetamborelli))
- Matias Spataro ([@matspataro](https://github.com/matspataro))
- Micaela Lauces ([@gypsypochi](https://github.com/gypsypochi))

---


