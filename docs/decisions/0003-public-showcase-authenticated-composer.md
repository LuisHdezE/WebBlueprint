# ADR-0003 · Frontera entre presentación pública y Compositor autenticado

Estado: **Aceptado**  
Fecha: **2026-09-20**

## Propósito

Definir la frontera de producto entre la experiencia de presentación pública de WebBlueprint y la experiencia autenticada de construcción de aplicaciones.

## Superficies del producto

WebBlueprint no es únicamente un constructor interno de aplicaciones. También debe presentar públicamente sus conceptos de aplicaciones disponibles de forma pulida, informativa y navegable.

Por tanto, el producto tiene dos superficies principales:

1. **Experiencia pública**
2. **Espacio de trabajo autenticado**

## Experiencia pública

El área pública es accesible sin autenticación e incluye:

- una landing de marketing/información;
- un catálogo de conceptos de aplicaciones listas;
- una página de detalle/presentación para cada concepto de aplicación;
- demos públicas interactivas de las páginas incluidas en esos conceptos;
- acceso público al producto/documentación;
- punto de entrada para iniciar sesión.

### Lenguaje del catálogo de aplicaciones

El contenido público debe presentar estos elementos como **aplicaciones/soluciones**, no como templates.

Ejemplos:

- Pet Shop
- Fitness
- E-commerce
- CRM
- Help Desk
- Logistics

Cada tarjeta/detalle público de aplicación debe poder mostrar:

- nombre de la aplicación;
- descripción concisa;
- imagen/visual representativo;
- categoría;
- capacidades clave;
- acción para abrir la demo pública.

### Comportamiento de la demo

Una demo pública permite a los visitantes navegar el conjunto de páginas que componen ese concepto de aplicación.

Ejemplo:

`Pet Shop` puede exponer una demo con panel, productos, categorías, clientes, pedidos y otras páginas seleccionadas por el preset correspondiente.

La demo sirve únicamente para presentación. No debe exponer una acción de exportación ZIP de la aplicación.

### Caso de uso de demo para propuestas comerciales

Las demos públicas también son una capacidad comercial/de propuesta de primera clase de WebBlueprint.

Cuando un cliente potencial solicita una aplicación personalizada mediante un marketplace freelance, contacto directo de ventas u otro canal comercial, WebBlueprint debe permitir ensamblar rápidamente un concepto/demo relevante a partir del catálogo existente de páginas/componentes y publicarlo mediante una URL pública compartible.

Flujo previsto:

```text
Requisito del cliente potencial
        ↓
Elegir/crear concepto de aplicación
        ↓
Seleccionar páginas/funciones relevantes
        ↓
Aplicar marca/tema según corresponda
        ↓
Publicar demo frontend navegable
        ↓
Destacar la aplicación en landing/catálogo cuando se desee
        ↓
Compartir URL directa de demo con el prospecto
```

El cliente potencial puede navegar entonces un frontend simulado realista y responsive, y comprender el producto propuesto antes de que exista implementación de backend/API.

La demo debe comunicar la experiencia de usuario prevista, navegación, arquitectura de información y capacidades visibles de la aplicación propuesta, manteniendo honestidad técnica: en esta etapa los datos de dominio pueden ser simulados y la funcionalidad de backend/API puede no existir todavía.

Una demo creada para una propuesta puede convertirse en una de las aplicaciones promovidas en el catálogo público. Por ello, una demo comercialmente útil no debe tratarse como un mockup desechable; cuando corresponda, debe enriquecer la librería reutilizable de aplicaciones/presets de WebBlueprint.

Los enlaces directos de demo deben ser lo bastante estables y legibles para compartirlos en una propuesta o conversación de una plataforma freelance sin exigir que el destinatario entienda WebBlueprint.

## Documentación pública

La documentación es pública y accesible directamente desde la experiencia de landing/navegación.

El área pública de documentación crece junto con WebBlueprint y puede incluir:

- conceptos del producto;
- documentación de componentes;
- documentación del sistema de diseño;
- ejemplos de uso;
- conceptos de aplicaciones soportadas;
- comportamiento responsive;
- conceptos del Compositor/exportación cuando corresponda.

Los detalles sensibles/internos de implementación no tienen que exponerse únicamente porque la documentación sea pública.

## Espacio de trabajo autenticado

El Compositor de aplicaciones pertenece al espacio de trabajo autenticado.

Los visitantes no autenticados pueden descubrir el producto, explorar conceptos de aplicaciones, ejecutar demos y leer documentación pública, pero no acceden al espacio del Compositor.

La experiencia autenticada incluye progresivamente:

- frontera de usuario/sesión;
- Compositor de aplicaciones;
- configuración de identidad de la aplicación;
- configuración de marca/tema;
- selección de preset;
- selección de funciones/páginas;
- revisión de navegación generada;
- revisión de la aplicación;
- capacidad de exportación/descarga.

## Frontera de exportación

La generación/descarga ZIP de una aplicación se expone únicamente desde el flujo autenticado del Compositor.

La landing pública, el catálogo y las demos no exponen controles de exportación.

### Nota de seguridad

Durante la fase Blueprint actual, únicamente frontend, la autenticación y autorización pueden representarse mediante abstracciones mock/provider reemplazables, de forma que el modelo UX y de routing pueda construirse sin introducir un backend prematuramente.

Un guard de ruta del lado cliente, por sí solo, **no** es una frontera de seguridad capaz de garantizar que los assets de exportación protegidos no puedan ser recuperados por un usuario determinado. Si WebBlueprint requiere posteriormente enforcement real de generación/descarga ZIP autenticada, la autorización debe validarse mediante un servicio/backend autenticado y confiable, o infraestructura protegida equivalente.

Por tanto, la autenticación debe abstraerse detrás de una frontera reemplazable desde el principio en lugar de acoplarse directamente a componentes de página.

## Modelo de rutas propuesto

Dirección inicial:

### Público

- `/` — landing
- `/apps` — catálogo público de aplicaciones
- `/apps/:slug` — presentación/detalle de aplicación
- `/demo/:slug/*` — demo pública navegable / URL compartible de propuesta
- `/docs/*` — documentación pública
- `/login` — entrada de inicio de sesión

### Autenticado

- `/composer/*` — espacio de trabajo del Compositor

Solo se añadirán rutas adicionales de cuenta autenticada cuando sean necesarias.

## Consecuencias arquitectónicas

- los shells/navegaciones público y autenticado deben ser distinguibles;
- el estado de autenticación debe proporcionarse mediante un provider/frontera a nivel de aplicación;
- las páginas no deben implementar comprobaciones de login ad hoc;
- la protección de rutas debe estar centralizada;
- los presets/conceptos de aplicaciones se convierten en metadata reutilizable consumida tanto por la presentación pública como por el Compositor;
- una definición de Pet Shop no debe duplicarse por separado para marketing, demo y selección del Compositor;
- la navegación de demos públicas debe derivarse de la misma dirección de registro de aplicaciones/funciones utilizada por el Compositor;
- las demos deben servir tanto para presentación pública general como para compartir propuestas comerciales directas;
- las demos de propuesta útiles deben poder conservarse/promoverse como aplicaciones reutilizables del catálogo en lugar de convertirse en mockups desechables;
- las acciones de exportación solo existen dentro de la experiencia autenticada del Compositor;
- Style 1 continúa siendo la autoridad visual de la UI del producto, adaptada adecuadamente a landing pública y superficies del workspace;
- todas las superficies permanecen mobile-first y responsive.

## Principio de fuente de verdad

Un concepto/preset de aplicación almacenado debe terminar alimentando todas las superficies relevantes del producto:

```text
Definición de aplicación / Preset
        ↓
Tarjeta del catálogo público
        ↓
Detalle público de aplicación
        ↓
Demo pública navegable / propuesta
        ↓
URL compartible con el cliente
        ↓
Selección de preset en el Compositor
        ↓
Configuración de funciones/páginas/navegación
        ↓
Exportación ZIP autenticada
```

Esto evita mantener representaciones separadas y divergentes del mismo concepto de aplicación.
