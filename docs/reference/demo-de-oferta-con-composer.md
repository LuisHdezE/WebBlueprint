# Demo de oferta con WebBlueprint

El objetivo es mostrar un recorrido funcional que responda al pedido principal de la oferta. El resultado del ejercicio es el ZIP que genera el Composer y una ficha que permite retomar el trabajo si se confirma el proyecto.

## Armar y verificar la demo

1. Elegí en **Composer → Plantilla base** la plantilla más cercana. Aprovechá las vistas, la navegación, los componentes y el tema disponibles. Incorporá una vista al catálogo cuando haga falta para completar el recorrido y pueda reutilizarse en otras ofertas.
2. Ajustá nombre, logo, tema y selección de vistas. Prepará los datos ficticios del recorrido. Para una oferta con sitio público y panel interno, elegí una acción que conecte ambos.
3. Abrí **Vista previa**. Probá la acción principal y el resultado que debe ver el usuario. Comprobá que las vistas y su orden correspondan a la selección del Composer.
4. Usá **Exportar aplicación ZIP**. Descomprimí y ejecutá `npm ci` y `npm run check`. Abrí la compilación en el navegador y repetí el recorrido en escritorio y móvil. Revisá textos, imágenes, controles y desbordes. Guardá el ZIP con su `webblueprint.json` y vinculá la revisión de GitHub que lo identifica. [Arquitectura de exportación](../decisions/0008-contract-first-export-architecture.md)

Registrá cada recorrido como **Verificado**, **Simulado** o **Pendiente** según la evidencia. Una función puede tener un recorrido verificado con datos simulados, como un editor que actualiza una vista pública durante la sesión.

## Ficha para copiar por oferta

| Campo | Qué anotar |
| --- | --- |
| Fuente | Enlace de la oferta y objetivo principal en una frase. |
| Base | Plantilla, vistas, versión o PR, y referencia al ZIP y su manifiesto. |
| Recorrido | Rol, acción, resultado esperado y datos ficticios usados. |
| Evidencia | Dispositivo o ancho probado, resultado observado y ZIP o versión verificada. Marcá como pendiente lo que falte ejecutar. |
| Pendientes | Por cada uno, requisito, qué existe hoy, trabajo que falta, dependencia si aplica y criterio de aceptación. |
| Primera entrega | El recorrido más pequeño que debería funcionar de extremo a extremo con datos y permisos reales. |

Si se confirma el proyecto, convertí las filas de pendientes en tareas. Validá con Luis, una por una, las decisiones aplicables de lenguaje, framework, base de datos, API, administración de contenidos, identidad y permisos, frontend, móvil y despliegue. Mantené los contratos y las capas de presentación, aplicación e infraestructura al sustituir los datos de prueba. Usá el flujo de arquitectura, QA y navegador del proyecto para verificar la primera entrega.

## Ejemplo completado · Sitios para restaurantes

**Pedido.** Sitio público por marca con carta, historia, horarios y contacto. El personal debe poder actualizar precios, horarios de feriado y especiales. [Oferta de Freelancer](https://www.freelancer.com/projects/web-development/branded-restaurant-websites-for-multiple)

**Base.** Plantilla **Sitios para restaurantes**. Incluye Inicio, Carta digital, Sobre el restaurante, Ubicación y contacto, y Editor del restaurante. La PR está en borrador a la fecha de la prueba. [WebBlueprint PR #111](https://github.com/LuisHdezE/WebBlueprint/pull/111)

**Recorrido verificado.** Editar el precio de la Margherita, el horario de feriado y el especial de Forno de Barrio. Guardar, abrir la carta y la vista de ubicación, y comprobar que se ven los cambios. Cambiar a Marea Clara y confirmar que conserva sus propios datos.

**Evidencia.** Se probó el recorrido en la vista previa del Composer en Chromium. En el ZIP compilado se repitió en una vista de 390 px la edición de un precio de Marea Clara, su reflejo en la carta y el aislamiento al cambiar de marca. Se comprobó el ajuste de las imágenes sin desborde horizontal. Las marcas y los datos son ficticios. El editor se abre desde la navegación de la demo y sus cambios viven en memoria durante la sesión.

### Pendientes para el producto

| Requisito | Qué tenemos | Trabajo pendiente | Criterio de aceptación |
| --- | --- | --- | --- |
| Edición persistente de la carta | Editor con platos, categorías, precios y descripciones ficticios. | Definir el contrato y conectar el editor y la web pública a una fuente de datos aprobada. Validar los cambios al guardar. | Un precio guardado aparece en la carta al abrirla desde otra sesión y sigue disponible tras recargar. |
| Acceso del personal y aislamiento | Selector con dos marcas y estado independiente durante la demo. | Incorporar autenticación y permisos por marca o sede. Aplicar la autorización en la capa que escribe los datos. | Un usuario asignado a una sede puede editar su carta y se rechaza un intento de editar la de otra. |
| Horarios y especiales | El editor muestra sus cambios en las vistas públicas durante la sesión. | Definir reglas para horarios regulares, excepciones de feriados y publicación de especiales. | Una excepción aprobada aparece en el día correcto y un especial puede actualizarse o retirarse. |
| Identidad y acciones públicas | Dos identidades ficticias, imágenes y enlaces de llamada y ubicación de prueba. | Cargar marca, carta, fotos, dirección y teléfono reales de cada sitio. Conectar reservas o pedidos donde corresponda. | En móvil se leen la carta y los horarios, y cada enlace lleva al destino confirmado para ese local. |
| Publicación y entrega | ZIP React compilable y recorrido móvil comprobado. | Preparar los dominios y ambientes definidos para el proyecto. Ejecutar QA con el contenido real y preparar la guía para el personal. | Cada sitio responde en su dominio y un miembro del personal puede completar el recorrido de edición siguiendo la guía. |

**Primera entrega si se confirma.** Un restaurante real, su carta y un usuario autorizado del personal. Al guardar un precio, una persona externa puede abrir la carta desde otra sesión y comprobar el cambio. Ese recorrido permite validar el contrato, los permisos y la publicación antes de incorporar las demás marcas.
