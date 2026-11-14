# Portfolio Orders API

API REST desarrollada con NestJS 11 para la gestión y procesamiento de pedidos e integración con el servicio de catálogo e inventario. Forma parte del monorepo Fullstack Showcase y es responsable de administrar las operaciones relacionadas con pedidos.

## Tecnologías

- TypeScript
- NestJS 11
- Prisma ORM 6

## Arquitectura

Arquitectura modular basada en las convenciones de NestJS, con separación de responsabilidades:

- **Orders:** gestión de pedidos, reglas de negocio y movimientos de inventario.
- **Catalog:** integración HTTP con la API de productos e inventario.
- **Database:** configuración y acceso a datos mediante Prisma.
- **Common:** componentes y funcionalidades compartidas, como filtros de excepciones.

## Ejecución local

Desde la raíz del monorepo:

```bash
pnpm install
pnpm --filter portfolio-orders-api prisma:generate
pnpm --filter portfolio-orders-api exec prisma migrate dev
pnpm --filter portfolio-orders-api dev
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Cadena de conexión a la base de datos. |
| `CATALOG_API_URL` | URL base del servicio de catálogo. |
| `CATALOG_TIMEOUT_MS` | Tiempo máximo de espera para las solicitudes al servicio de catálogo (milisegundos). |
| `PORT` | Puerto de ejecución de la API. |

## Documentación

- **Swagger UI:** `/swagger/`.
- **Especificación OpenAPI:** `/openapi.yaml`.

## Health checks

- `/health`
- `/health/ready`

## Despliegue

La API está desplegada en Render.

**Production URL:** https://portfolio-orders-api.onrender.com
