# Personas DevOps API

API REST para la gestión de registros de personas, desarrollada como entrega de la **Segunda Evaluación Sumativa** del curso **Introducción a DevOps**.

> Escuela de Ingeniería — Universidad Católica del Norte (Coquimbo)
> Carreras: Ingeniería Civil en Computación e Informática / Ingeniería en Tecnologías de la Información

## Integrantes

- Branco Abalos
- Nicolás Rojas

## Descripción

Aplicación backend que administra registros de personas (nombre, RUT, fecha de nacimiento, ciudad y una lista de gustos). El proyecto fue construido como vehículo para aplicar de punta a punta el ciclo de vida DevOps: control de versiones con ramas protegidas, integración y despliegue continuos (CI/CD), contenedorización y orquestación con Docker, y despliegue en la nube.

Cada registro de persona contiene:

| Campo             | Tipo       | Descripción                              |
| ----------------- | ---------- | ---------------------------------------- |
| `id`              | UUID       | Identificador único generado por la BD   |
| `nombre`          | string     | Nombre de la persona                     |
| `rut`             | string     | RUT de la persona                        |
| `fechaNacimiento` | fecha ISO  | Fecha de nacimiento (`YYYY-MM-DD`)       |
| `ciudad`          | string     | Ciudad donde vive                        |
| `gustos`          | string\[\] | Lista de gustos (comida, libros, juegos) |

## Stack tecnológico

- **Framework:** NestJS 11 (Node.js 22 LTS, TypeScript)
- **Validación:** class-validator / class-transformer
- **ORM y base de datos:** Prisma + PostgreSQL 16
- **Visor de base de datos:** pgAdmin 4
- **Testing:** Jest
- **Contenedores:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Cloud (Parte 1):** Azure App Service (capa gratuita F1)

## Arquitectura

El proyecto es un **monolito**: toda la lógica de negocio vive en un único servicio desplegable. Para la orquestación con contenedores, ese servicio se acompaña de su base de datos y un visor, levantados de forma conjunta con Docker Compose.

```
┌─────────────────────────────────────────────────┐
│                  Docker network                  │
│                                                  │
│   ┌──────────┐     ┌──────────┐    ┌──────────┐  │
│   │   app    │────▶│    db    │◀───│ pgadmin  │  │
│   │ (NestJS) │     │ Postgres │    │  (visor) │  │
│   │  :3000   │     │  :5432   │    │   :80    │  │
│   └──────────┘     └──────────┘    └──────────┘  │
│        │                                │        │
└────────┼────────────────────────────────┼───────┘
         │ localhost:3000                  │ localhost:5050
       cliente                          navegador
```

Los tres servicios se comunican por la red interna de Docker, donde cada contenedor se resuelve por el **nombre de su servicio** (por eso la app conecta a la base usando el host `db` y no `localhost`).

## Requisitos previos

- [Docker](https://docs.docker.com/get-docker/) y Docker Compose
- (Opcional, para desarrollo sin contenedores) Node.js 22 LTS y npm

## Cómo levantar el proyecto

La forma recomendada es mediante Docker Compose, que levanta los tres servicios.

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/Claptzzz/personas-devops.git
   cd personas-devops
   ```

2. Crear el archivo de variables de entorno a partir de la plantilla:

   ```bash
   cp example.env .env
   ```

3. Levantar todo:

   ```bash
   docker compose up --build
   ```

4. Servicios disponibles:

   - **API:** http://localhost:3000/personas
   - **pgAdmin:** http://localhost:5050

Para detener los contenedores:

```bash
docker compose down        # detiene y elimina los contenedores
docker compose down -v     # además elimina el volumen de la base de datos
```

## Variables de entorno

Definidas en `example.env` (plantilla versionada) y `.env` (valores reales, ignorado por Git):

| Variable                  | Descripción                                  |
| ------------------------- | -------------------------------------------- |
| `POSTGRES_USER`           | Usuario de PostgreSQL                        |
| `POSTGRES_PASSWORD`       | Contraseña de PostgreSQL                     |
| `POSTGRES_DB`             | Nombre de la base de datos                   |
| `DATABASE_URL`            | Cadena de conexión que usa Prisma (host `db`)|
| `PGADMIN_DEFAULT_EMAIL`   | Email de acceso a pgAdmin                    |
| `PGADMIN_DEFAULT_PASSWORD`| Contraseña de acceso a pgAdmin               |

## Acceso a pgAdmin

1. Abrir http://localhost:5050 e iniciar sesión con `PGADMIN_DEFAULT_EMAIL` / `PGADMIN_DEFAULT_PASSWORD`.
2. Registrar el servidor: clic derecho en **Servers → Register → Server**.
3. En la pestaña **Connection**:
   - Host: `db`
   - Port: `5432`
   - Maintenance database / Username / Password: los valores de Postgres del `.env`
4. La tabla se encuentra en `personas → Schemas → public → Tables → Persona`.

## API

Base URL local: `http://localhost:3000`

### `POST /personas`

Crea una persona. Cuerpo de ejemplo:

```json
{
  "nombre": "Nicolás Rojas",
  "rut": "11.111.111-1",
  "fechaNacimiento": "2003-05-13",
  "ciudad": "Coquimbo",
  "gustos": ["sushi", "ajedrez", "videojuegos"]
}
```

Respuesta: la persona creada con su `id` generado. El campo `gustos` es opcional; si no se envía, se almacena como lista vacía.

### `GET /personas`

Devuelve el listado completo de personas.

### `DELETE /personas/:id`

Elimina la persona indicada por `id`. Devuelve `404 Not Found` si el `id` no existe.

### Ejemplo de flujo con curl

```bash
URL="http://localhost:3000"

curl -X POST "$URL/personas" -H "Content-Type: application/json" -d '{"nombre":"Nicolás Rojas","rut":"11.111.111-1","fechaNacimiento":"2003-05-13","ciudad":"Coquimbo","gustos":["sushi","ajedrez"]}'
curl "$URL/personas"
curl -X DELETE "$URL/personas/<id>"
curl "$URL/personas"
```

## Tests

Pruebas unitarias con Jest sobre el servicio y el controlador (la base de datos se mockea, por lo que no requieren una instancia real de Postgres):

```bash
npm install
npm test
```

## Prácticas DevOps aplicadas

- **Control de versiones:** repositorio público en GitHub con rama principal `main` protegida mediante un *ruleset* que exige Pull Request y bloquea commits directos.
- **Trunk-Based Development:** cada funcionalidad se desarrolló en una rama de vida corta que se integró a `main` rápidamente vía PR (por ejemplo, la incorporación del campo `gustos`).
- **Integración Continua (CI):** en cada push y PR a `main`, GitHub Actions instala dependencias, ejecuta los tests y compila el proyecto.
- **Despliegue Continuo (CD):** en la Parte 1, la aplicación (versión en memoria) se desplegaba automáticamente a Azure App Service al integrar a `main`.
- **Contenedorización:** `Dockerfile` que construye la imagen de la aplicación y `docker-compose.yaml` que orquesta los tres servicios con límites de CPU y memoria definidos por servicio.

## Estructura del proyecto

```
personas-devops/
├── .github/workflows/      # Pipeline de CI (build + test)
├── prisma/
│   └── schema.prisma       # Modelo de datos
├── src/
│   ├── personas/           # Módulo principal (controller, service, DTO, tests)
│   ├── prisma/             # PrismaService y PrismaModule
│   └── main.ts             # Bootstrap (ValidationPipe + puerto dinámico)
├── test/                   # Pruebas e2e
├── Dockerfile
├── docker-compose.yaml
├── example.env             # Plantilla de variables de entorno
└── README.md
```