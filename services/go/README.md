# Portfolio Analytics API

API REST desarrollada con Go para la consulta de analíticas y reportes de ventas, productos y pedidos. Forma parte del monorepo Fullstack Showcase y es responsable de proporcionar información agregada para el dashboard de analíticas.

## Tecnologías

- Go
- PostgreSQL
- pgx
- Air
- Swagger UI / OpenAPI 3.1

## Arquitectura

Implementada utilizando una arquitectura por capas, con separación de responsabilidades:

- **Analytics:** modelos, reglas de negocio y contratos de los casos de uso.
- **Postgres:** persistencia y acceso a datos mediante pgx.
- **HTTP:** endpoints REST, handlers, middlewares y manejo de errores.
- **Config:** configuración de la aplicación mediante variables de entorno.

## Ejecución local

Desde la raíz del monorepo:

```bash
cd services/go

go mod download
air
```

Para ejecutar sin Air:

```bash
go run ./cmd/api
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `PORT` | Puerto de ejecución de la API. |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL. |
| `APP_ENV` | Entorno de ejecución (`development` o `production`). |

## Documentación

- **Swagger UI:** `/swagger/`.
- **Especificación OpenAPI:** `/openapi.yaml`.

## Health checks

- `/health`
- `/health/ready`

## Despliegue

La API está desplegada en Render.

**Production URL:** https://portfolio-analytics-api-sjw7.onrender.com
