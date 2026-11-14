# Portfolio Catalog API

API REST desarrollada con ASP.NET Core 10 para la gestión de productos e inventario. Forma parte del monorepo Fullstack Showcase y es responsable de administrar el catálogo de productos.

## Tecnologías

- C# / .NET 10
- Entity Framework Core 10
- Docker

## Arquitectura

Implementada utilizando Clean Architecture, con separación de responsabilidades:

- **Domain:** entidades y reglas de negocio.
- **Application:** casos de uso, DTOs y contratos.
- **Infrastructure:** persistencia y acceso a datos mediante Entity Framework Core.
- **Api:** endpoints REST, configuración y punto de entrada de la aplicación.

## Ejecución local

Desde la raíz del monorepo:

```bash
cd services/dotnet

dotnet restore
dotnet build
dotnet run --project src/Portfolio.Catalog.Api
```

Configura la cadena de conexión mediante la variable de entorno `ConnectionStrings__DefaultConnection`.

## Docker

El proyecto incluye un `Dockerfile` multi-stage para construir y ejecutar la API en contenedores.

Se utiliza para el despliegue del servicio en Render.

## Variables de entorno

| Variable | Descripción |
|---|---|
| `ASPNETCORE_ENVIRONMENT` | Entorno de ejecución (`Development` o `Production`). |
| `ConnectionStrings__DefaultConnection` | Cadena de conexión a la base de datos. |
| `PORT` | Puerto asignado por la plataforma de despliegue. |

## Documentación

- **Swagger UI:** `/swagger/`.
- **Especificación OpenAPI:** `/openapi.yaml`.

## Health checks

- `/health`
- `/health/ready`

## Despliegue

La API está desplegada en Render.

**Production URL:** https://portfolio-catalog-api.onrender.com
