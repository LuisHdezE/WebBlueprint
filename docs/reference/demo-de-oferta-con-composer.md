# Demo de oferta con WebBlueprint

El objetivo es mostrar un recorrido funcional que responda al pedido principal de la oferta. El flujo termina con la plantilla disponible en el Composer de EliasWorks, el ZIP verificado y una ficha para retomar el desarrollo si se confirma el proyecto.

## Instrucción para una oferta nueva

Mensaje breve para una conversación donde ya se conoce esta guía.

> Dalila, aplicá el flujo Demo de oferta con WebBlueprint a esta oferta. [ENLACE O TEXTO]

En una conversación nueva, incluí el enlace a esta guía con la oferta. Si el anuncio requiere acceso, pegá la descripción o adjuntá las capturas.

### Qué debe ejecutar el asistente

1. Leer la oferta y elegir el recorrido principal que el cliente pueda evaluar. Revisar el catálogo y las plantillas de `LuisHdezE/WebBlueprint` para aprovechar lo que ya existe.
2. Preparar en una rama una demo navegable con las vistas, la identidad visual, los datos ficticios y los roles de prueba que requiera ese recorrido. Si hay sitio público y panel, conectar ambos mediante una acción verificable. Agregar al catálogo solo las vistas reutilizables necesarias y registrar la selección como una plantilla base versionada del Composer.
3. Comprobar que la plantilla se puede seleccionar, ajustar y previsualizar. Generar el ZIP con el exportador de WebBlueprint, compilarlo y repetir el recorrido en escritorio y móvil.
4. Abrir la PR contra `main`, comprobar el CI del cambio y fusionarla cuando pasen las pruebas. Esperar el despliegue de EliasWorks e ingresar al Composer publicado. Seleccionar la plantilla, abrir la vista previa y exportar el ZIP desde el hosting.
5. Entregar el enlace del Composer, la PR, el ZIP con su manifiesto y la ficha de la oferta. La ficha debe registrar el resultado de las pruebas, qué funcionó con datos simulados y los pendientes de desarrollo con criterios de aceptación.

El pedido de aplicar este flujo incluye integrar y publicar la plantilla en el Composer existente de EliasWorks después de que pasen las pruebas. Ante un fallo, diagnosticá el problema, corregilo y repetí la verificación. Para el caso de que el cliente confirme el proyecto, dejá identificada la primera entrega funcional y las decisiones de arquitectura que corresponde aprobar.

## Armar y verificar la demo

1. Elegí en **Composer → Plantilla base** la plantilla más cercana, o **Aplicación vacía** para armar tu propia selección. En **Vistas**, abrí las familias del catálogo y elegí las pantallas que necesita el recorrido, aunque vengan de proyectos distintos.
2. Ajustá nombre, logo, tema y selección de vistas. Prepará los datos ficticios del recorrido. Para una oferta con sitio público y panel interno, elegí una acción que conecte ambos.
3. Abrí **Vista previa**. Probá la acción principal y el resultado que debe ver el usuario. Comprobá que las vistas y su orden correspondan a la selección del Composer.
4. Usá **Exportar aplicación ZIP**. Descomprimí y ejecutá `npm ci` y `npm run check`. Abrí la compilación en el navegador y repetí el recorrido en escritorio y móvil. Revisá textos, imágenes, controles y desbordes. Guardá el ZIP con su `webblueprint.json` y vinculá la revisión de GitHub que lo identifica. [Arquitectura de exportación](../decisions/0008-contract-first-export-architecture.md)

Registrá cada recorrido como **Verificado**, **Simulado** o **Pendiente** según la evidencia. Una función puede tener un recorrido verificado con datos simulados, como un editor que actualiza una vista pública durante la sesión.

## Qué aporta cada proyecto al catálogo

La plantilla base precarga una selección editable. Cada vista de aplicación tiene su propia entrada en el catálogo que comparten el menú de WebBlueprint y el Composer. Así, una pantalla nueva puede usarse por sí sola o junto con pantallas de otros proyectos.

Cuando falte una pantalla que pueda servir en otras ofertas, incorporala como vista de catálogo y registrá en la ficha qué hace y qué recorrido se verificó. Si una vista del menú está marcada como próxima, o si solo se renderiza una maqueta, anotá su estado y el trabajo que falta antes de mostrarla como funcional. Cuando cierres la demo de un proyecto nuevo, dejá su combinación registrada como plantilla base. En el punto **Plantilla base**, escribí un nombre y pulsá **Guardar selección como plantilla base**. La tarjeta queda disponible en el mismo navegador y recupera las vistas, el orden y el tema. Al seleccionarla, podés seguir adaptando el proyecto como con las demás plantillas.

Para que el equipo pueda elegir la misma base en cualquier equipo, incorporá su definición al catálogo versionado de WebBlueprint. La ficha debe indicar el nombre con el que aparece y la revisión que incluye la plantilla.

**Combinación verificada.** Desde la plantilla de restaurantes, agregamos solo **Catálogo de inmuebles** en la familia **Marketplace inmobiliario**. La vista previa y el ZIP mostraron las seis vistas. En el ZIP compilado, editamos un precio de la carta, filtramos los inmuebles por alquiler y volvimos a la carta para comprobar que el cambio seguía visible durante la sesión.

## Ficha para copiar por oferta

| Campo | Qué anotar |
| --- | --- |
| Fuente | Enlace de la oferta y objetivo principal en una frase. |
| Base | Plantilla, vistas, versión o PR, y referencia al ZIP y su manifiesto. |
| Recorrido | Rol, acción, resultado esperado y datos ficticios usados. |
| Aporte al catálogo | Vistas reutilizadas o añadidas, familia de origen y estado de cada vista nueva. |
| Evidencia | Dispositivo o ancho probado, resultado observado y ZIP o versión verificada. Marcá como pendiente lo que falte ejecutar. |
| Pendientes | Por cada uno, requisito, qué existe hoy, trabajo que falta, dependencia si aplica y criterio de aceptación. |
| Primera entrega | El recorrido más pequeño que debería funcionar de extremo a extremo con datos y permisos reales. |

Si se confirma el proyecto, convertí las filas de pendientes en tareas. Validá con Luis, una por una, las decisiones aplicables de lenguaje, framework, base de datos, API, administración de contenidos, identidad y permisos, frontend, móvil y despliegue. Mantené los contratos y las capas de presentación, aplicación e infraestructura al sustituir los datos de prueba. Usá el flujo de arquitectura, QA y navegador del proyecto para verificar la primera entrega.

## Ejemplo completado · Sitios para restaurantes

**Pedido.** Sitio público por marca con carta, historia, horarios y contacto. El personal debe poder actualizar precios, horarios de feriado y especiales. [Oferta de Freelancer](https://www.freelancer.com/projects/web-development/branded-restaurant-websites-for-multiple)

**Base.** Plantilla **Sitios para restaurantes**. Incluye Inicio, Carta digital, Sobre el restaurante, Ubicación y contacto, y Editor del restaurante. El desarrollo de la plantilla quedó registrado en esta PR. [WebBlueprint PR #111](https://github.com/LuisHdezE/WebBlueprint/pull/111)

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
