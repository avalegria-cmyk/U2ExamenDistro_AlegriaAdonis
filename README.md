# Sistema distribuido Northwind de productos y compras

Adonis Alegría

## Stack tecnológico

Frontend con React, Vite y Nginx.

Backend con Node.js y Express.

Autenticación con Google OAuth 2.0 y manejo de sesión con JWT.

Persistencia con PostgreSQL 18.

Registro de eventos con Winston.

Contenedores administrados con Docker Compose.

## Base de datos seleccionada

El proyecto utiliza Northwind sobre PostgreSQL 18. El archivo `Northwind.backup` ya está incluido en la raíz del repositorio, por lo que no es necesario descargar ni crear manualmente la base de datos.

La tabla `products` se utiliza para listar, buscar, crear, actualizar y eliminar productos. La tabla `product_purchases` registra las compras realizadas y la tabla `revoked_tokens` almacena los identificadores de los JWT cerrados o revocados.

## Script, migraciones e inicialización de la base de datos

El archivo `docker/database/01-restore.sh` ejecuta `pg_restore` y restaura automáticamente `Northwind.backup` dentro de PostgreSQL durante la primera creación del contenedor.

Después de la restauración, el backend verifica la existencia de la tabla `products` y prepara automáticamente los elementos adicionales que necesita la aplicación:

- Secuencia para generar nuevos identificadores de productos.
- Tabla `product_purchases` para registrar las compras.
- Tabla `revoked_tokens` para impedir la reutilización de JWT cerrados.

PostgreSQL guarda la información en el volumen `northwind_data`. Por esta razón, la restauración no se repite cada vez que se reinician los contenedores.

Para eliminar la información almacenada y restaurar nuevamente el respaldo original se ejecuta:

```bash
docker compose down -v
docker compose up --build
```

## Funcionamiento de Docker

Docker Compose ejecuta tres servicios relacionados:

- `database`: inicia PostgreSQL 18 y restaura la base Northwind.
- `backend`: inicia la API de Express en el puerto 3000 y espera hasta que PostgreSQL esté disponible.
- `frontend`: compila React, lo sirve mediante Nginx y publica la interfaz en el puerto 5173.

El volumen `northwind_data` conserva la base de datos y el volumen `backend_logs` conserva el archivo de eventos generado por Winston.

## Instrucciones de ejecución

1. Instalar Docker Desktop y comprobar que esté ejecutándose.

2. Clonar el repositorio e ingresar al proyecto.

```bash
git clone https://github.com/avalegria-cmyk/U2ExamenDistro_AlegriaAdonis.git
cd U2ExamenDistro_AlegriaAdonis
```

3. Crear el archivo local de variables de entorno.

```bash
cp .env.example .env
```

4. Configurar en Google Cloud un cliente OAuth para aplicación web y registrar el siguiente origen autorizado de JavaScript:

```text
http://localhost:5173
```

5. Colocar el ID de Google en `GOOGLE_CLIENT_ID` y reemplazar `JWT_SECRET` y `POSTGRES_PASSWORD` con valores privados dentro de `.env`.

6. Construir e iniciar la aplicación completa.

```bash
docker compose up --build
```

7. Abrir la aplicación en el navegador.

```text
http://localhost:5173
```

8. Verificar el estado de los contenedores.

```bash
docker compose ps
```

9. Verificar que Northwind fue restaurada y contiene productos.

```bash
docker compose exec database sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT COUNT(*) FROM products;"'
```

10. Consultar los logs del sistema.

```bash
docker compose exec backend cat /app/logs/system.log
```

11. Detener los contenedores sin eliminar la base de datos.

```bash
docker compose down
```

## Variables de entorno requeridas

Variables del archivo `.env` utilizado por Docker Compose:

- `GOOGLE_CLIENT_ID`: identificador OAuth creado en Google Cloud.
- `JWT_SECRET`: clave privada utilizada para firmar los JWT.
- `POSTGRES_DB`: nombre de la base de datos PostgreSQL.
- `POSTGRES_USER`: usuario de PostgreSQL.
- `POSTGRES_PASSWORD`: contraseña de PostgreSQL.

Docker Compose también configura internamente las variables `PORT`, `FRONTEND_URL`, `JWT_EXPIRES_IN`, `LOG_LEVEL`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `VITE_API_URL` y `VITE_GOOGLE_CLIENT_ID`.

El archivo `.env` está excluido mediante `.gitignore` y no debe publicarse porque contiene valores privados. El repositorio incluye únicamente `.env.example` con valores de referencia.
