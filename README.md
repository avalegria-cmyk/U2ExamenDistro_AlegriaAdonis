# Nombre del estudiante

Adonis Alegría

# Nombre del proyecto

Sistema distribuido Northwind de productos y compras

# Stack tecnológico

Frontend con React, Vite y Nginx.

Backend con Node.js y Express.

Autenticación con Google OAuth 2.0 y manejo de sesión con JWT.

Persistencia con PostgreSQL 18 ejecutado con Docker.

Registro de eventos con Winston.

# Base de datos seleccionada

Northwind. Utilizo el respaldo Northwind.backup, la tabla products y la tabla product_purchases para gestionar productos y simular compras.

# Instrucciones básicas de ejecución

Creo el archivo de variables para Docker.

```bash
cp .env.example .env
```

Configuro en Google Cloud un cliente OAuth para aplicación web con http://localhost:5173 como origen autorizado de JavaScript. Coloco el ID de cliente en GOOGLE_CLIENT_ID y cambio JWT_SECRET por una clave privada.

Construyo e inicio toda la aplicación.

```bash
docker compose up --build
```

Abro http://localhost:5173 en el navegador.

Para detener la aplicación ejecuto:

```bash
docker compose down
```

Para borrar el volumen y volver a restaurar Northwind.backup ejecuto:

```bash
docker compose down -v
docker compose up --build
```

# Variables de entorno requeridas

Archivo .env de Docker:

GOOGLE_CLIENT_ID

JWT_SECRET

POSTGRES_DB

POSTGRES_USER

POSTGRES_PASSWORD

Variables internas del backend:

PORT

FRONTEND_URL

JWT_EXPIRES_IN

LOG_LEVEL

DB_HOST

DB_PORT

DB_NAME

DB_USER

DB_PASSWORD

Variables internas del frontend:

VITE_API_URL

VITE_GOOGLE_CLIENT_ID
