# Roadmap vigente · Composer-first

Estado: **ACTIVO**  
Fecha: **2026-09-22**  
Reemplaza como orden conductor a `0002-general-ui-template-roadmap.md`, que permanece como historial del rebaseline visual.

## Decisión de producto

Tras cerrar el shell G1, WebBlueprint deja de ser solamente un catálogo navegable y empieza a comportarse como generador de aplicaciones. El catálogo maestro sigue mostrando todo lo disponible, pero el trabajo inmediato pasa al Composer para poder seleccionar un subconjunto de vistas, definir identidad y tema, previsualizar exactamente esa selección y exportarla desde el mismo estado.

La regla central es:

> **Selección = Preview = Export.**

No existirán configuraciones paralelas para estas tres superficies. Todas consumen el mismo `BlueprintProjectManifest`.

## G1 · Application Shell

Estado: **CERRADO VISUALMENTE**.

Baseline publicado:

- topbar compacta;
- sidebar ERP compacto;
- 12 familias / 96 rutas;
- grupos desplegables automáticos;
- 9 colores theme-safe;
- responsive desktop/móvil;
- destino canónico `https://webblueprint.eliasworks.uy`.

## G2 · Composer Foundation

### G2.1 Project Manifest + selección

- [~] contrato `BlueprintProjectManifest` v1;
- [~] nombre de aplicación;
- [~] logo;
- [~] favicon / ICO;
- [~] tema de aplicación;
- [~] catálogo completo seleccionable;
- [~] selección por familia;
- [~] orden editable de vistas;
- [~] persistencia local del borrador;
- [~] presets editables;
- [~] detección de preset modificado.

### G2.2 Preview aislada

- [~] abrir en nueva pestaña;
- [~] usar identidad del proyecto;
- [~] aplicar tema elegido;
- [~] mostrar únicamente vistas seleccionadas en sidebar;
- [~] recorrer la secuencia con anterior/siguiente;
- [ ] renderizar las vistas reales a medida que el catálogo deje de ser placeholder.

### G2.3 Exportación

- [~] descargar el Blueprint Manifest desde la misma pantalla de selección;
- [ ] conectar exportación React + TypeScript + Tailwind al manifest v1;
- [ ] incluir logo/favicon seleccionados;
- [ ] generar únicamente rutas y navegación elegidas;
- [ ] ZIP reproducible;
- [ ] smoke del proyecto exportado.

### G2.4 Presets / plantillas

- [~] Aplicación vacía;
- [~] Ecommerce;
- [~] CRM;
- [~] ERP administrativo;
- [~] Contenido / Blog;
- [ ] ampliar presets con nuevas aplicaciones a medida que existan vistas reales.

## Después de G2

Se retoma la construcción visual del catálogo por componentes y vistas, conservando los bloques de `0002-general-ui-template-roadmap.md` como inventario. La numeración posterior se decidirá al cerrar G2 para evitar renumerar documentación histórica sin necesidad.

Cada nueva vista deberá registrarse en el catálogo maestro de forma que el Composer la herede automáticamente como opción seleccionable.
