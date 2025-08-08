# Sistema de Gestión de Contactos

Una app full-stack para manejar usuarios y sus contactos. Básicamente un CRUD completo donde puedes crear usuarios y cada usuario puede tener sus propios contactos.

## 🚀 Demo
La app está corriendo acá: https://sistema-gestion-contactos.vercel.app/

## Lo que usé

- **Next.js 14** - Para el frontend y las APIs
- **MongoDB Atlas** - Base de datos en la nube 
- **Tailwind CSS** - Para que se vea bonito
- **React Hooks** - Para manejar el estado

## Qué hace la app

- Crear, editar y eliminar usuarios
- Cada usuario puede tener sus contactos
- CRUD completo para contactos (crear, ver, editar, borrar)
- Interfaz responsive que se ve bien en móvil
- Confirmaciones antes de eliminar cosas importantes

## API Endpoints

### Usuarios
```
GET    /api/usuarios           - Todos los usuarios
POST   /api/usuarios           - Crear usuario
GET    /api/usuarios/[id]      - Un usuario específico  
PUT    /api/usuarios/[id]      - Actualizar usuario
DELETE /api/usuarios/[id]      - Eliminar usuario
```

### Contactos
```
GET    /api/usuarios/[id]/contactos              - Contactos del usuario
POST   /api/usuarios/[id]/contactos              - Crear contacto
PUT    /api/usuarios/[id]/contactos/[contactoId] - Actualizar contacto
DELETE /api/usuarios/[id]/contactos/[contactoId] - Eliminar contacto
```

## Cómo correrlo local

1. Clonar el repo:
```bash
git clone https://github.com/[tu-usuario]/sistema-gestion-contactos.git
cd sistema-gestion-contactos
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear `.env.local` con tu MongoDB:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/contactos
```

4. Correr en desarrollo:
```bash
npm run dev
```

5. Abrir http://localhost:3000

## Estructura del proyecto

```
src/
├── app/
│   ├── api/                 # APIs REST
│   │   └── usuarios/        # Endpoints de usuarios y contactos
│   ├── components/          # Componentes React
│   │   ├── ui/             # Componentes base (Modal, etc)
│   │   ├── usuarios/       # Componentes de usuarios
│   │   └── contactos/      # Componentes de contactos
│   ├── hooks/              # Hooks personalizados
│   └── lib/                # Conexión a MongoDB
```

## Cosas técnicas

- Usé hooks personalizados para separar la lógica de negocio
- Los componentes solo se encargan de mostrar la UI
- MongoDB (contactos dentro de usuarios)
- Manejo de errores 

## Deploy

Está con deploy en Vercel porque se conecta súper fácil con GitHub y maneja Next.js automáticamente.

---