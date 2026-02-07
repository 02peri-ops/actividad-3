# API Tareas - Documentacion de Arquitectura

## Descripcion del Proyecto

API RESTful construida con Node.js y Express para la gestion de tareas con sistema de autenticacion basado en JWT (JSON Web Tokens). Permite a los usuarios registrarse, iniciar sesion y gestionar sus propias tareas de forma segura.

## Arquitectura del Proyecto

```
api-tareas/
├── server.js              # Punto de entrada de la aplicacion
├── package.json           # Dependencias y scripts del proyecto
├── controllers/           # Logica de negocio
│   ├── authController.js  # Controlador de autenticacion
│   └── tareasController.js # Controlador de tareas
├── routes/                # Definicion de rutas API
│   ├── auth.js           # Rutas de autenticacion
│   └── tareas.js         # Rutas de tareas
├── middleware/           # Middleware personalizado
│   ├── auth.js           # Middleware de autenticacion JWT
│   └── errorHandler.js   # Manejo centralizado de errores
└── data/                 # Almacenamiento local (JSON)
    ├── tareas.json       # Base de datos de tareas
    └── usuarios.json     # Base de datos de usuarios
```

## Stack Tecnologico

| Tecnologia | Proposito |
|------------|-----------|
| **Node.js** | Entorno de ejecucion JavaScript |
| **Express.js** | Framework web minimalista para API REST |
| **bcryptjs** | Encriptacion de contraseñas con hash |
| **jsonwebtoken** | Generacion y verificacion de tokens JWT |
| **body-parser** | Parsing de cuerpos de peticion HTTP |

## Dependencias

```json
{
  "bcryptjs": "^2.4.3",
  "body-parser": "^1.20.2",
  "express": "^4.18.2",
  "jsonwebtoken": "^9.0.2"
}
```

## Dependencias de Desarrollo

```json
{
  "nodemon": "^3.1.11"
}
```

## Inicio Rapido

### Instalacion

```bash
npm install
```

### Scripts Disponibles

| Script | Descripcion |
|--------|-------------|
| `npm start` | Inicia el servidor con Node.js |
| `npm run dev` | Inicia el servidor con Nodemon (desarrollo) |
| `npm run debug` | Inicia el servidor en modo inspeccion |

### Ejecutar el Servidor

```bash
npm run dev
```

El servidor estara disponible en: **http://localhost:3000**

## Autenticacion

### Flujo de Autenticacion JWT

```
+-------------+     +-------------+     +-------------+     +-------------+
|   Usuario   |---->|   Login/    |---->|   Generate  |---->|   Client    |
|             |     |  Register   |     |    Token    |     |   Stores    |
+-------------+     +-------------+     +-------------+     +-------------+
                                                                  |
                                                                  v
+-------------+     +-------------+     +-------------+     +-------------+
|   Usuario   |<----|   Return    |<----|   Verify    |<----|   Send      |
|   Accesses  |     |    Data     |     |   Token     |     |   Request   |
|   Resource  |     +-------------+     +-------------+     +-------------+
+-------------+
```

### Endpoints de Autenticacion

#### 1. Registrar Usuario

```http
POST /auth/register
Content-Type: application/json

{
  "username": "tu_usuario",
  "password": "tu_contrasena"
}
```

**Respuesta Exitosa (201):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "tu_usuario"
}
```

#### 2. Iniciar Sesion

```http
POST /auth/login
Content-Type: application/json

{
  "username": "tu_usuario",
  "password": "tu_contrasena"
}
```

**Respuesta Exitosa (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "tu_usuario"
}
```

## Gestion de Tareas

### Uso del Token

Todas las rutas de tareas requieren autenticacion. Incluye el token en el header:

```http
Authorization: Bearer <tu_token_jwt>
```

### Endpoints de Tareas

#### 1. Obtener Todas las Tareas

```http
GET /tareas
Authorization: Bearer <tu_token>
```

**Respuesta (200):**

```json
[
  {
    "id": 1770218956540,
    "titulo": "Prueba de PUT",
    "descripcion": "Punto com",
    "usuarioId": 1770218788946
  }
]
```

#### 2. Crear Nueva Tarea

```http
POST /tareas
Authorization: Bearer <tu_token>
Content-Type: application/json

{
  "titulo": "Nueva Tarea",
  "descripcion": "Descripcion de la tarea"
}
```

**Respuesta Exitosa (201):**

```json
{
  "id": 1770305955259,
  "titulo": "Nueva Tarea",
  "descripcion": "Descripcion de la tarea",
  "usuarioId": 1770218788946
}
```

#### 3. Actualizar Tarea

```http
PUT /tareas/:id
Authorization: Bearer <tu_token>
Content-Type: application/json

{
  "titulo": "Titulo Actualizado",
  "descripcion": "Nueva descripcion"
}
```

**Respuesta (200):**

```json
{
  "id": 1770218956540,
  "titulo": "Titulo Actualizado",
  "descripcion": "Nueva descripcion",
  "usuarioId": 1770218788946
}
```

#### 4. Eliminar Tarea

```http
DELETE /tareas/:id
Authorization: Bearer <tu_token>
```

**Respuesta (200):**

```json
{
  "mensaje": "Tarea eliminada"
}
```

## Seguridad

### Middleware de Autenticacion

El middleware [authMiddleware](middleware/auth.js:4) verifica:

1. Presencia del token en el header `Authorization`
2. Validez del token JWT usando la clave secreta
3. Decodificacion del payload para obtener datos del usuario

```javascript
const token = req.header('Authorization')?.replace('Bearer ', '');

if (!token) {
  return res.status(401).json({ error: 'Token de acceso requerido' });
}

const decoded = jwt.verify(token, SECRET_KEY);
req.user = decoded;
next();
```

### Encriptacion de Contrasenas

Las contrasenas se almacenan utilizando **bcrypt** con salt de 10 rounds:

```javascript
const salt = await bcrypt.genSalt(10);
const passwordHash = await bcrypt.hash(password, salt);
```

### Clave Secreta

**IMPORTANTE:** La clave secreta JWT esta hardcodeada en desarrollo. Para produccion, usar variables de entorno:

```javascript
const SECRET_KEY = process.env.JWT_SECRET || 'tu-clave-secreta-desarrollo';
```

## Estructura de Archivos

### Server (server.js)

Punto de entrada principal que configura:

- Express app
- Body parser middleware
- Rutas de autenticacion (publicas)
- Rutas de tareas (protegidas)
- Manejo de errores global
- Ruta 404

El archivo [server.js](server.js:1) contiene la configuracion del servidor Express, incluyendo:

- Inicializacion de Express en la variable `app`
- Puerto configurado en `PORT = 3000`
- Middleware para parsear JSON y URL-encoded
- Rutas publicas bajo `/auth`
- Rutas protegidas bajo `/tareas`
- Ruta de prueba en `/`
- Manejador de errores al final
- Manejo de rutas no encontradas (404)

### Controladores

#### authController.js

| Funcion | Descripcion |
|---------|-------------|
| `register` | Registra nuevos usuarios con contrasena encriptada |
| `login` | Autentica usuarios y genera tokens JWT |

**Funciones Helper:**

- `leerUsuarios()` - Lee usuarios desde JSON
- `escribirUsuarios()` - Guarda usuarios en JSON

El archivo [authController.js](controllers/authController.js:1) implementa:

- Lectura y escritura asincrona de usuarios usando `fs.promises`
- Validacion de username y password requeridos
- Verificacion de usuario existente antes de registro
- Generacion de hash de contrasena con bcrypt
- Generacion de tokens JWT con expiration por defecto
- Comparacion segura de contrasenas en login

#### tareasController.js

| Funcion | Descripcion |
|---------|-------------|
| `getTareas` | Obtiene todas las tareas del usuario |
| `createTarea` | Crea una nueva tarea asociada al usuario |
| `updateTarea` | Actualiza tarea (verifica propiedad) |
| `deleteTarea` | Elimina tarea (verifica propiedad) |

**Funciones Helper:**

- `leerTareas()` - Lee tareas desde JSON
- `escribirTareas()` - Guarda tareas en JSON

El archivo [tareasController.js](controllers/tareasController.js:1) implementa:

- Lectura y escritura asincrona de tareas
- Validacion de titulo y descripcion requeridos
- Asociacion de tareas con el ID del usuario ( propietario )
- Verificacion de propiedad antes de actualizar o eliminar
- Parsing de ID de parametros de URL
- Manejo de errorestry-catch

### Middleware

#### auth.js

Protege rutas verificando tokens JWT. Extrae informacion del usuario decoded y la adjunta a `req.user`.

El archivo [auth.js](middleware/auth.js:1):

- Extrae el token del header Authorization
- Verifica el token con la clave secreta
- Decodifica el payload y lo adjunta a `req.user`
- Responde con 401 si no hay token o es invalido

#### errorHandler.js

Manejo centralizado de errores con:

- Logging de errores en consola
- Manejo de errores de validacion
- Respuestas consistentes en formato JSON

El archivo [errorHandler.js](middleware/errorHandler.js:1) es un middleware de nivel 4 (error) que:

- Imprime el stack trace en consola
- Verifica el tipo de error (ValidationError)
- Maneja errores de duplicado (codigo 11000)
- Retorna mensajes de error apropiados segun el entorno

### Rutas

#### auth.js

```javascript
POST /register  -> register
POST /login     -> login
```

El archivo [auth.js](routes/auth.js:1) exporta un router de Express con dos rutas:

- `POST /register` - Delegado a `authController.register`
- `POST /login` - Delegado a `authController.login`

#### tareas.js

```javascript
GET /tareas          -> getTareas (protegido)
POST /tareas         -> createTarea (protegido)
PUT /tareas/:id      -> updateTarea (protegido)
DELETE /tareas/:id   -> deleteTarea (protegido)
```

El archivo [tareas.js](routes/tareas.js:1):

- Aplica `authMiddleware` a todas las rutas mediante `router.use()`
- Delega cada metodo HTTP al controlador correspondiente
- Maneja parametros de URL para :id

## Estructura de Datos

### Usuario

```json
{
  "id": 1770218788946,
  "username": "Gilberto",
  "password": "$2a$10$FYNMQrWJBPGBmsoqTVaSSOWYLslzP.K1mTSWJO2CldueP.qnV..2G"
}
```

- `id`: Timestamp de creacion (milisegundos)
- `username`: Nombre de usuario unico
- `password`: Hash BCrypt de la contrasena

### Tarea

```json
{
  "id": 1770218956540,
  "titulo": "Prueba de Put",
  "descripcion": "Punto com",
  "usuarioId": 1770218788946
}
```

- `id`: Identificador unico de la tarea
- `titulo`: Titulo de la tarea
- `descripcion`: Descripcion detallada
- `usuarioId`: ID del usuario propietario

## Pruebas con cURL

### Registrar usuario

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123456"}'
```

### Iniciar sesion

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123456"}'
```

### Obtener tareas (con token)

```bash
curl -X GET http://localhost:3000/tareas \
  -H "Authorization: Bearer <tu_token>"
```

### Crear tarea

```bash
curl -X POST http://localhost:3000/tareas \
  -H "Authorization: Bearer <tu_token>" \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Mi tarea","descripcion":"Descripcion"}'
```

### Actualizar tarea

```bash
curl -X PUT http://localhost:3000/tareas/<id> \
  -H "Authorization: Bearer <tu_token>" \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Titulo nuevo","descripcion":"Nueva descripcion"}'
```

### Eliminar tarea

```bash
curl -X DELETE http://localhost:3000/tareas/<id> \
  -H "Authorization: Bearer <tu_token>"
```

## Codigos de Error HTTP

| Codigo | Descripcion |
|--------|-------------|
| 400 | Bad Request - Datos invalidos |
| 401 | Unauthorized - Token requerido o invalido |
| 403 | Forbidden - Sin permisos para el recurso |
| 404 | Not Found - Recurso no existe |
| 500 | Internal Server Error - Error en el servidor |

## Mensajes de Error Comunes

| Mensaje | Causa |
|---------|-------|
| "Token de acceso requerido" | Falta el header Authorization |
| "Token invalido" | Token expirado o malformado |
| "Usuario ya existe" | Username duplicado en registro |
| "Credenciales invalidas" | Username o contrasena incorrectos |
| "Username y password requeridos" | Campos vacios en peticion |
| "Tarea no encontrada" | ID de tarea no existe |
| "No tienes permiso" | Usuario no es propietario de la tarea |

## Limitaciones Conocidas

1. **Almacenamiento en JSON**: Los datos se pierden si se reinicia el servidor sin guardar
2. **Sin paginacion**: No hay soporte para paginar resultados de tareas
3. **Sin busqueda**: No hay endpoint para buscar tareas por titulo o contenido
4. **Tokens sin expiracion**: Los tokens JWT no tienen fecha de expiracion configurada
5. **Sin refresh tokens**: No existe mecanismo para renovar tokens
6. **Una sesion por usuario**: No hay limite de sesiones simultaneas
7. **Validacion basica**: Validacion minima de datos de entrada
8. **Sin rate limiting**: Vulnerable a ataques de fuerza bruta
