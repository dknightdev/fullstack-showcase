

# Portfolio Orders API

API REST desarrollada con NestJS 11 para la gestión y procesamiento de pedidos e integración con el servicio de catálogo e inventario.

## Tecnologías

- TypeScript
- NestJS 11
- Prisma ORM 6
- PostgreSQL
- Docker

## Arquitectura

Arquitectura modular basada en las convenciones de NestJS, con separación de responsabilidades:

- **Orders:** gestión de pedidos, reglas de negocio y movimientos de inventario.
- **Catalog:** integración HTTP con la API de productos e inventario.
- **Database:** configuración y acceso a PostgreSQL mediante Prisma.
- **Common:** componentes y funcionalidades compartidas, como filtros de excepciones.

## Ejecución local

Desde `services/nestjs`:

```bash
pnpm install
pnpm prisma generate
pnpm prisma migrate dev
pnpm start:dev
```

Configura las variables de entorno `DATABASE_URL`, `CATALOG_API_URL`, `CATALOG_TIMEOUT_MS` y `PORT`.

## Documentación

En entorno de desarrollo, Swagger está disponible en:

`/swagger`
