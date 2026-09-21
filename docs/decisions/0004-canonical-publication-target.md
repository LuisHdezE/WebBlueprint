# ADR-0004 · Destino canónico de publicación

Estado: **Aceptado · dirección de publicación refinada por ADR-0005**  
Fecha: **2026-09-21**

## Decisión

La familia canónica de publicación pública para WebBlueprint es la infraestructura de EliasWorks bajo:

- `eliasworks.uy`

ADR-0005 fija ahora la propia aplicación de producción en el subdominio independiente `https://webblueprint.eliasworks.uy`.

## Auditoría de hosting registrada durante U0.2

El sitio raíz actual de EliasWorks no es un host estático vacío. Es una aplicación Laravel existente desplegada desde `LuisHdezE/erp_eliasworks`.

El patrón activo de despliegue observado en el repositorio EliasWorks es:

```text
GitHub main
    ↓
GitHub Actions
    ↓
Build PHP / Node
    ↓
FTP
    ↓
public_html/
    ↓
eliasworks.uy
```

La misma cuenta de hosting ya dispone de un patrón probado para bundles Vite/React separados. eFactura compila su WebApp y publica el bundle `dist/` generado en un directorio dedicado bajo `public_html/`.

El stack de hosting también soporta fallback SPA estilo Apache mediante `.htaccess`. eFactura utiliza actualmente:

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

Esto proporcionó la evidencia necesaria para preparar WebBlueprint para deep links antes de seleccionar la integración final de publicación.

## Decisión de portabilidad de U0.2

U0.2 deliberadamente no fijó una ruta de despliegue.

WebBlueprint trata `BASE_URL` de Vite como basename de React Router. Por tanto:

- un build en raíz/subdominio mantiene la base Vite `/`;
- un despliegue bajo ruta podría compilar con una base como `/webblueprint/`;
- las rutas de la aplicación permanecen definidas de forma relativa a la raíz de la aplicación;
- el bundle estático incluye fallback SPA de Apache para que URLs directas de propuesta/demo resuelvan a `index.html`.

U0.6 resolvió la elección de publicación que permanecía abierta a favor del modelo de subdominio independiente registrado en ADR-0005.

## Consecuencias

- Render no es un destino de producción de WebBlueprint.
- El preview temporal de Render creado durante U0.2 permanece únicamente como evidencia visual no canónica.
- WebBlueprint no debe sobrescribir el portafolio existente en la raíz de EliasWorks.
- El despliegue continuo publica las revisiones aceptadas de `main` en la infraestructura del subdominio independiente de WebBlueprint.
- Las URLs públicas de aplicaciones/demos deben ser suficientemente estables para compartirlas en propuestas comerciales.
- Los deep links directos y el comportamiento de recarga del navegador deben funcionar en el stack de hosting de EliasWorks.
- El subdominio final, destino FTP y contrato de despliegue están gobernados por ADR-0005 y U0.6.

## Justificación

WebBlueprint forma parte de la superficie pública de producto de EliasWorks, pero es operacionalmente independiente del portafolio Laravel en el dominio raíz. Su landing, catálogo de aplicaciones, documentación y demos navegables de propuestas utilizan por tanto su propio subdominio, permaneciendo dentro de la familia de dominios EliasWorks.
