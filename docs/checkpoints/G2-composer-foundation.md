# G2 · Composer Foundation

Estado: **EN PROGRESO**  
Base: `main@0343eeeea99b392104cbe2cf2c10f9bb15a9f42e`  
Rama: `g2/composer-foundation`

## Objetivo

Convertir WebBlueprint de catálogo maestro a generador configurable sin duplicar estado entre selección, preview y exportación.

Regla de arquitectura:

> **Selección = Preview = Export.**

## Alcance del primer incremento

- [x] `BlueprintProjectManifest` v1.
- [x] identidad: nombre, logo y favicon/ICO.
- [x] selección de uno de los 9 temas existentes.
- [x] presets editables: vacía, Ecommerce, CRM, ERP administrativo, Contenido/Blog.
- [x] las 96 vistas del catálogo maestro son seleccionables.
- [x] selección de familia completa.
- [x] secuencia editable de vistas.
- [x] persistencia local del proyecto.
- [x] acceso a Composer desde el topbar del catálogo.
- [x] preview aislada en nueva pestaña.
- [x] preview muestra solo vistas seleccionadas en navegación.
- [x] preview consume nombre, logo, favicon y tema del proyecto.
- [x] recorrido Anterior/Siguiente usa la secuencia seleccionada.
- [x] descarga del mismo Blueprint Manifest desde la pantalla de selección.
- [ ] exportación React ZIP conectada al manifest v1.
- [ ] render de las vistas reales dentro de preview cuando dejen de ser placeholders.

## Preservación de legado

El compositor anterior se conserva temporalmente bajo `/legacy/composer/*`. La nueva experiencia oficial entra por `/composer` y forma parte del shell actual.

## Gate de este incremento

- [ ] typecheck PASS.
- [ ] lint PASS.
- [ ] tests PASS.
- [ ] build PASS.
- [ ] preview artifact PASS.
- [ ] PR Ready for review.
- [ ] aprobación explícita de merge.
- [ ] CI de `main` PASS.
- [ ] deploy canónico SUCCESS.
- [ ] revisión visual/funcional en producción.

No se conecta todavía el ZIP React hasta validar primero el circuito identidad → selección → preview → manifest en producción.
