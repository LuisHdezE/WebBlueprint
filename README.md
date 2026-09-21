# WebBlueprint

WebBlueprint es una plataforma frontend mobile-first, basada en componentes y construida con React.js + Tailwind CSS para crear, demostrar y exportar interfaces reutilizables de aplicaciones web.

## Estado

**U0 · Fundación completada**

La fundación del producto ya incluye shell público, catálogo de aplicaciones, demos navegables, Compositor autenticado, motor de exportación React/Vite, documentación viva, galería de componentes y despliegue continuo al subdominio independiente de EliasWorks.

Producción canónica:

- `https://webblueprint.eliasworks.uy`

El siguiente bloque funcional es U1, dedicado a la clasificación de la referencia CORK y a la extracción gobernada de patrones reutilizables.

## Principios centrales

- Frontend únicamente: React.js + Tailwind CSS.
- Mobile-first y responsive son criterios obligatorios de aceptación.
- Navegación lateral izquierda en escritorio y tablet.
- Variantes de shell soportadas: `collapsible-menu`, `vertical-dark-menu` y `vertical-light-menu`.
- La línea visual oficial es **Style 1**: clara, limpia, profesional, con sombras discretas, superficies suavemente redondeadas, jerarquía tipográfica fuerte y espaciado consistente.
- La marca de cada aplicación puede modificar nombre, logo y tokens de color, pero no el lenguaje visual fundamental.
- Las páginas componen componentes reutilizables; no recrean UI compartida.
- Los componentes se incorporan de forma incremental cuando una necesidad real del producto los exige.
- Elementos compartidos del shell, como Sidebar, Topbar y BottomBar, existen una sola vez y se reutilizan.
- Los datos simulados se mantienen detrás de una frontera de acceso reemplazable; las páginas no deben incrustar datos de dominio de forma rígida.
- La documentación es una superficie de primera clase del producto y crece junto con la librería de componentes.
- Los cambios se gobiernan mediante GitHub, PR incrementales, CI y despliegue continuo.

## Convención de idioma

- Código, identificadores técnicos, tipos, clases, funciones y estructuras internas: **inglés**.
- Interfaz visible para el usuario: **español**.
- README, ADR, checkpoints, roadmap, guías y documentación mantenida por el proyecto: **español**.
- Rutas, comandos, nombres de tecnologías, IDs estables y otros literales técnicos pueden conservar su forma original cuando sea necesario para mantener precisión y trazabilidad.

## Referencia inicial

La primera referencia de trabajo es **CORK Responsive Admin Dashboard Template v4.0.0**. Se utiliza como catálogo funcional y visual, no como implementación técnica para copiar.

La fase U1 inventariará la referencia, clasificará cada vista como **KEEP / ADAPT / MERGE / DISCARD**, extraerá patrones reutilizables y solo después reconstruirá en WebBlueprint las vistas aprobadas.

## Regla de desarrollo

Ninguna página de referencia entra automáticamente en alcance solo por existir en CORK. Del mismo modo, CORK no define el límite final de WebBlueprint: después de reconstruir el catálogo inicial, la investigación continuará para identificar vistas, patrones y presets de aplicaciones que falten.
