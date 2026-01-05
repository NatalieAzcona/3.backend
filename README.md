# API de Gestión de Usuarios y Tareas  
Proyecto backend realizado con Node.js, Express y MongoDB.

Este repositorio contiene una API REST que permite:
- Registrar usuarios
- Iniciar sesión
- Subir imágenes a Cloudinary
- Crear, leer, actualizar y eliminar tareas
- Asignar tareas a usuarios
- Controlar permisos mediante roles (`user`, `admin`)
- Gestionar autenticación con JWT

---

## Requisitos previos

Asegúrate de tener instalado:

- **Node.js** (v18 o superior)
- **npm**
- **MongoDB Atlas** o una base MongoDB local
- Una cuenta en **Cloudinary** para almacenar imágenes

---

## **Instalación**
1. Clona el repositorio:
   ```
   git clone https://github.com/NatalieAzcona/3.backend
   ```
2. Instala las dependencias:
   ```
   npm install express mongoose jsonwebtoken bcrypt dotenv multer cloudinary 
   ```
3. Configura las variables de entorno:
   - Crea un archivo .env en la raíz del proyecto con las siguientes variables (estos valores se configuran localmente. Nota: por tratarse del proyecto, se sube a GitHub el .env):
     ```
    PORT=3000
    DB_URL=
    JWT_SECRET=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    CLOUDINARY_CLOUD_NAME=
     ```
4. Inicia el servidor:
   ```
   npm start
   ```

---
## MODELOS 
###  User
{
  name: { type: String, required: true, trim: true }
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, required: true, trim: true, minlength: [8, "8 caracteres mínimo"] }
  role: { type: String, enum: ["user", "admin"], default: "user" },
  image: { type: String, trim: true, required: true },
  tasks: [{ type: Schema.Types.ObjectId, ref: "tasks" }]
}

✔ Contraseña encriptada con bcrypt
✔ Imagen subida a Cloudinary
✔ Rol por defecto: user
✔ Array tasks[] con referencias a tareas
✔ Evita duplicados mediante $addToSet en controladores

### Task
{
  user: { type: ObjectId, ref: "users", required: true },
  task: { type: String, enum: ["write", "edit", "publish", "design"] },
  time: Number
}


Cada tarea pertenece a un usuario, se define el tipo de tarea y el tiempo de ejecución.

---

## Diagrama de relaciones 
- Un **usuario** puede tener **muchas tareas**
- Una **task** pertenece a **un solo usuario**
- `User.tasks[]` almacena solo los IDs de las tasks
- `Task.user` almacena el ID del usuario propietario

## Resumen de Endpoints

### Usuarios

| Método | Endpoint | Autenticación | Descripción |
|------|----------|---------------|-------------|
| POST | `/api/v1/users/register` | No | Registro de usuario con imagen |
| POST | `/api/v1/users/login` | No | Inicio de sesión y obtención de JWT |
| GET | `/api/v1/users` | Admin | Obtener todos los usuarios |
| GET | `/api/v1/users/:id` | Usuario | Obtener usuario por ID |
| PUT | `/api/v1/users/:id` | Usuario / Admin | Actualizar datos del usuario |
| DELETE | `/api/v1/users/:id` | Usuario / Admin | Eliminar usuario |
| PATCH | `/api/v1/users/:id/role` | Admin | Cambiar rol del usuario |

---

### Tasks

| Método | Endpoint | Autenticación | Descripción |
|------|----------|---------------|-------------|
| GET | `/api/v1/tasks` | No | Obtener todas las tareas |
| GET | `/api/v1/tasks/user/:userId` | No | Obtener tareas por usuario |
| GET | `/api/v1/tasks/:id` | No | Obtener tarea por ID |
| POST | `/api/v1/tasks` | No | Crear una tarea |
| PUT | `/api/v1/tasks/:id` | No | Actualizar una tarea |
| DELETE | `/api/v1/tasks/:id` | No | Eliminar una tarea |


## Endpoints API

Se puede utilizar Insomnia para hacer pruebas. Las rutas protegidas deben incluir el token JWT en los headers

## Usuarios
### Registro de usuario

URL: /api/v1/users/register

* Método: POST
* Middlewares: upload.single('image')

**Descripción:**
* Crea un nuevo usuario con rol user.
* La imagen se envía como archivo en el campo image.
* El middleware de subida (Cloudinary/Multer) sube el archivo y deja la URL final en req.file.path.
* Esa ruta se guarda en user.image.
* La contraseña se cifra en el presave del modelo.

**Cuerpo:**

* name: Nombre del usuario
* email: correo@ejemplo.com
* password: contraseña
* image: <archivo imagen>

**Respuestas:** 
* 201 Created
```
{
  "_id": "id_del_usuario",
  "name": "Nombre del usuario",
  "email": "correo@ejemplo.com",
  "image": "url_o_ruta_cloudinary",
  "role": "user"
}
```

* 400 Bad Request
Falta algún campo obligatorio, falta la imagen o el email ya existe.

### Inicio de sesión

URL: /api/v1/users/login
Método: POST
**Descripción:** 
Valida email y contraseña, genera token JWT y devuelve el usuario sin la contraseña.

Cuerpo:
```
{
  "email": "correo@ejemplo.com",
  "password": "contraseña"
}
```

**Respuestas:**
* 200 OK
```
{
  "token": "jwt_generado",
  "user": {
    "_id": "id_usuario",
    "name": "Nombre",
    "email": "correo@ejemplo.com",
    "image": "url",
    "role": "user"
  }
}
```
* 400 Bad Request
Email incorrecto, falta información o contraseña inválida.

### Obtener todos los usuarios

URL: /api/v1/users

Método: GET
Middlewares: isAuth, isAdmin

**Descripción:**
Devuelve todos los usuarios sin contraseña.

**Respuestas:**
* 200 OK
```
[
  {
    "_id": "id_usuario",
    "name": "Nombre",
    "email": "correo@ejemplo.com",
    "role": "user"
  }
]
```

### Obtener usuario por ID

URL: /api/v1/users/:id

Método: GET
Middlewares: isAuth
**Descripción:**
Devuelve un usuario específico por ID.
**Respuestas:**
* 200 OK
```
{
  "_id": "id_usuario",
  "name": "Nombre",
  "email": "correo@ejemplo.com",
  "role": "user"
}
```

### Actualizar usuario

URL: /api/v1/users/:id
Método: PUT
Middlewares: isAuth, upload.single('image')

**Descripción:**
Permite actualizar name, email y opcionalmente la imagen.
Solo puede modificarse si el usuario autenticado es admin, o si el usuario autenticado es el dueño de la cuenta.

**Cuerpo (ejemplo):**
```
{
  "name": "Nuevo nombre",
  "email": "nuevo_correo@ejemplo.com"
}
```
**Respuestas:**

* 200 OK
```
{
  "_id": "id",
  "name": "Nuevo nombre",
  "email": "nuevo_correo@ejemplo.com",
  "image": "nueva_url"
}
```

### Eliminar usuario

URL: /api/v1/users/:id
Método: DELETE
Middlewares: isAuth

**Descripción:**
Borra un usuario y también elimina su imagen de Cloudinary si existe.

**Respuestas:**
* 200 OK
```
{
  "message": "Usuario eliminado"
}
```

### Cambiar rol

URL: /api/v1/users/:id/role
Método: PATCH
Middlewares: isAuth, isAdmin

**Descripción:**
Cambia el rol entre "user" y "admin".

Cuerpo:
```
{
  "role": "admin"
}
```

**Respuestas:**
*200 OK

{
  "message": "rol actualizado"
}

## Tasks

Cualquier cliente puede crear, leer, actualizar o borrar tasks.

### Obtener todas las tasks

URL: /api/v1/tasks

Método: GET

Descripción:
Devuelve todas las tareas, incluyendo el usuario. Las tareas pueden ser "write", "edit", "publish", "design"

**Respuestas:**

* 200 OK
```
[
  {
    "_id": "id_task",
    "task": "write",
    "user": {
      "_id": "id_usuario",
      "name": "Nombre"
    }
  }
]
```

### Obtener tasks por usuario

URL: /api/v1/tasks/user/:userId

Método: GET

Descripción:
Devuelve todas las tareas asociadas a un usuario al introducir el id. Las tareas pueden ser "write", "edit", "publish", "design"

**Respuestas:**
* 200 OK
```
[
  {
    "_id": "id_task",
    "task": "write",
    "user": {
      "_id": "id_usuario",
      "name": "Nombre"
    }
  }
]
```

### Obtener task por ID de la task

URL: /api/v1/tasks/:id
Método: GET
**Descripción:**
Devuelve una tarea concreta por su ID y a quién está asociada. 

Respuestas:
* 200 OK
```
{
  "_id": "id_task",
  "task": "Descripción",
  "user": {
    "_id": "id_usuario",
    "name": "Nombre"
  }
}
```

### Crear una task

URL: /api/v1/tasks
Método: POST
**Descripción:** crea una nueva tarea asociada a un usuario y añade la tarea al array tasks del usuario. Las tareas pueden ser "write", "edit", "publish", "design"

Cuerpo:
```
{
  "user": "id_usuario",
  "task": "design",
  "time": "20251221"
}
```


**Respuestas:**
* 201 Created
```
{
  "_id": "id_task",
  "user": "id_usuario",
  "task": "Descripción"
}
```

### Actualizar task

URL: /api/v1/tasks/:id

Método: PUT
**Descripción:**
Actualiza cualquier campo de la tarea. Las tareas pueden ser "write", "edit", "publish", "design"

Cuerpo (ejemplo):
```
{
  "task": "write",
  "time": "2025121123"
}
```
**Respuestas:**

* 200 OK
```
{
  "_id": "id_task",
  "task": "Nueva descripción"
}
```

### Eliminar task

URL: /api/v1/tasks/:id
Método: DELETE
Descripción: elimina la tarea y la quita del array tasks del usuario.

**Respuestas:**
* 200 OK
```
{
  "message": "eliminamos esta task",
  "elemento": { "_id": "id_task" }
}
```

## **Middleware**
### **Autenticación `isAuth`**
- Verifica que el usuario tenga un token válido.
- Si el token es válido, agrega el usuario a `req.user` y permite el acceso.
- Si no, devuelve un error `401 Unauthorized`.

### **Autorización `isAdmin`**
- Verifica que el usuario tenga el rol de `admin`.
- Si no, devuelve un error `403 Forbidden`.

---

## **Estructura del Proyecto**
```
src/
├── api/
│   ├── controllers/
│   │   ├── user.controller.js
│   │   ├── task.controller.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Task.js
│   ├── routes/
│       ├── user.routes.js
│       ├── task.routes.js
├── config/
│       ├── db.js
├── data/
│       ├── tasks.js
│       ├── users.js
├── middlewares/
│   ├── auth.js
│   ├── cloudinary.js
├── utils/
│   ├── seeds/
│   │   ├── tasks.seed.js
│   │   ├── users.seed.js
│   ├── token.js
│   ├── deleteImgCloudinary.js
├── index.js
```

---

## **Tecnologías Usadas**
- **Backend:**
  - Node.js
  - Express.js
  - MongoDB (Mongoose)
- **Autenticación:**
  - JSON Web Tokens (JWT)
- **Almacenamiento de imágenes:**
  - Cloudinary

---

## **Pruebas**
### **Herramienta:** Insomnia
- Realiza pruebas de los endpoints enviando las solicitudes con los datos requeridos.
- Se debe incluir el token en el header `Authorization` para las rutas protegidas.
- 
## Autor

Proyecto desarrollado por **Natalie Azcona** como parte de prácticas de backend.

