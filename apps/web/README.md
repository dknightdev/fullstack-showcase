# Portfolio Web

Aplicación frontend desarrollada con React 19 y TypeScript para el portafolio personal de desarrollo de software. Forma parte del monorepo Fullstack Showcase y permite presentar proyectos, experiencia profesional y demostraciones técnicas mediante la integración con los servicios backend.

## Tecnologías

- React 19
- TypeScript
- Vite 8
- React Router DOM 7
- Zustand
- i18next
- Motion
- Lenis
- Recharts
- React Icons

## Características

- Portafolio con secciones de presentación, experiencia, habilidades, proyectos y contacto.
- Playground interactivo para explorar las funcionalidades de las APIs.
- Personalización de tema, color principal e idioma.
- Internacionalización mediante i18next.
- Animaciones y transiciones utilizando Motion.
- Desplazamiento suave mediante Lenis.
- Visualización de datos mediante Recharts.

## Ejecución local

Desde la raíz del monorepo:

```bash
pnpm install
pnpm --filter web dev
```

Para generar la compilación de producción:

```bash
pnpm --filter web build
```

Los archivos generados se encuentran en `apps/web/dist`.

## Variables de entorno

La aplicación utiliza variables de entorno para configurar las URLs de las APIs.

| Variable | Descripción |
|---|---|
| `VITE_CATALOG_API_URL` | URL base de Catalog API. |
| `VITE_ORDERS_API_URL` | URL base de Orders API. |
| `VITE_ANALYTICS_API_URL` | URL base de Analytics API. |

Se utilizan archivos `.env.development` y `.env.production` para separar las configuraciones de cada entorno.

## Integración con APIs

El frontend consume las tres APIs del monorepo:

- **Catalog API:** productos e inventario.
- **Orders API:** gestión de pedidos.
- **Analytics API:** consultas y reportes.

Durante el desarrollo local se utiliza el proxy de Vite para redirigir las solicitudes a los servicios correspondientes.

## Despliegue

**Production URL:** https://dubancaballero.dev
