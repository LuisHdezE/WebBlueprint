# ADR-0005 · Subdominio independiente de WebBlueprint

Estado: **Aceptado**  
Fecha: **2026-09-21**

## Decisión

WebBlueprint es una aplicación web independiente alojada en:

- `https://webblueprint.eliasworks.uy`

No está montada dentro del espacio de rutas del portafolio Laravel.

La raíz de la aplicación visible para el navegador es `/`, mientras que el hosting FTP actual de EliasWorks mapea el sitio a su propio directorio físico:

- `public_html/webblueprint/`

## Consecuencias

- Vite mantiene la base de producción `/`;
- React Router mantiene la raíz del subdominio como basename;
- la aplicación Laravel raíz en `https://eliasworks.uy` permanece operacionalmente independiente;
- el fallback SPA de Apache mediante `.htaccess` pertenece al directorio de despliegue de WebBlueprint;
- el CD de producción publica únicamente el bundle `dist/` de WebBlueprint dentro de ese directorio;
- los smoke tests de producción apuntan al subdominio y a deep links directos;
- Render no es un destino canónico de despliegue.

## Regla de entrega

Producción debe desplegar el artefacto `dist/` exacto creado por una ejecución exitosa de CI sobre `main`, en lugar de recompilar un segundo bundle no verificado dentro del job de despliegue.
