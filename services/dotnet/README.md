# Portfolio Catalog API

API REST desarrollada con ASP.NET Core 10 para la gestión de productos e inventario.

## Tecnologías

- C# / .NET 10
- Entity Framework Core 10
- PostgreSQL
- Docker

## Arquitectura

Clean Architecture con separación de responsabilidades:

- **Domain:** entidades y reglas de negocio.
- **Application:** casos de uso, DTOs y contratos.
- **Infrastructure:** persistencia y acceso a PostgreSQL.
- **Api:** endpoints REST y configuración de la aplicación.

## Ejecución local

Desde `services/dotnet`:

```bash
docker compose up -d
dotnet restore
dotnet build
dotnet run --project src/Portfolio.Catalog.Api
```

Configura la cadena de conexión mediante la variable de entorno `ConnectionStrings__DefaultConnection`.

## Documentación

En entorno de desarrollo, Swagger está disponible en:

`/swagger`

Health check:

`/health`
