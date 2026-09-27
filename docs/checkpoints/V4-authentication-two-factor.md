# V4 · Authentication · Verificación 2FA

Estado: IMPLEMENTED · FINAL ACCEPTED

QA status: PASS

## Alcance

Sustituye únicamente `/authentication/two-factor` por una vista real independiente del shell, siguiendo Style 1 y las vistas Auth aceptadas. La referencia CORK `auth-boxed-2-step-verification.html` se clasifica como ADAPT. V3 fue aceptada por Luis y su cierre documental se integró mediante PR #32.

## Contratos y arquitectura

- Feature `src/features/authentication/two-factor/` con Application, Infrastructure y Presentation.
- DTO de contenido, solicitud, comando, resultado, validación y causas de fallo.
- Puertos `TwoFactorContentProvider` y `TwoFactorGateway`; composición en `AppRouter`.
- Contenido visible en `two-factor.view.json`, validado por un mapper que rechaza contenido incompleto.
- Campo único `type=text`, teclado numérico y `autocomplete=one-time-code`; admite pegado, conserva ceros iniciales y elimina solo espacios exteriores.
- Longitud configurada mediante DTO: seis dígitos en esta vista. El caso de uso valida antes de cruzar el puerto.
- El gateway recibe únicamente `{ code }`. Su implementación mock tiene modos explícitos success, invalid-code, expired-code y unavailable, independientes del código introducido.
- La demostración canónica acepta cualquier código de seis dígitos; lo declara antes de enviar. No hay TOTP real, envío SMS/email, sesión, persistencia ni secretos compartidos.
- No se ofrece reenvío: la referencia funcional es una aplicación de autenticación.
- Presentation no importa Infrastructure, JSON, fetch ni almacenamiento de navegador.

## Interacción y accesibilidad

- Validación requerida, longitud y caracteres numéricos ASCII con error asociado y foco en el campo.
- Estado de envío con aria-busy, campo de solo lectura y botón bloqueado; guarda síncrona contra envíos duplicados.
- Éxito semántico con foco en el resultado, limpieza del código y envío deshabilitado.
- Fallos de código inválido/caducado o indisponibilidad permiten corregir y reintentar; excepciones del proveedor se convierten en indisponibilidad.
- Navegación a Sign In y contratos de enlaces legales.
- Escritorio: dos paneles y estados inicial/success completos en 1365×611 sin scroll.
- Móvil: hero oculto, formulario prioritario, controles accesibles y sin overflow horizontal.

## QA y evidencia

CI #185 sobre el HEAD de implementación `00c6159d2859f3d3cfaa62a23bfaf037776f5ac6`: PASS.

- Typecheck, lint, 24 archivos de tests / 86 tests y build: PASS.
- La integración de exportación se omite en la suite normal y se ejecutó aparte mediante export smoke: PASS.
- Gate de arquitectura/datos: PASS con 4 vistas registradas.
- Navegador: Sign In 27/27, Password Reset 23/23, Sign Up 28/28 y Two Factor 29/29.
- Navegación y fallback SPA: PASS.
- Revisión visual técnica de capturas CI: escritorio inicial/success en 1365×611 y móvil inicial/success en 390×844: PASS.
- Evidencia: https://github.com/LuisHdezE/WebBlueprint/actions/runs/36283476463.
- CI se ejecuta de nuevo sobre el commit documental final; su resultado se registra en la PR #33 antes de solicitar merge.

Las pruebas de casos de uso cubren validación antes del gateway, ceros iniciales, configuración inválida, resultados y excepciones. Las pruebas de adaptadores cubren mapper y los cuatro modos deterministas. El escenario de navegador registrado cubre validación, envío, éxito, teclado, navegación, escritorio, móvil y errores de runtime. Los modos de fallo del gateway se prueban de forma automatizada fuera de la ruta canónica de éxito.

## Evidencia de integración y producción

- PR de implementación: [#33](https://github.com/LuisHdezE/WebBlueprint/pull/33).
- HEAD aprobado: `f33a6582e596c355f4927d25ddd5eef96b6707da`.
- Merge commit en `main`: `befd00f7df2360e253549e8d14758f81623f421a`.
- CI post-merge #187: PASS sobre el merge commit.
- Despliegue #114 a EliasWorks: PASS sobre el mismo commit.
- Ruta canónica: https://webblueprint.eliasworks.uy/authentication/two-factor.
- Smoke HTTP de las cuatro rutas Auth: PASS.
- QA de navegador en producción: Sign In 27/27, Password Reset 23/23, Sign Up 28/28 y Two Factor 29/29.
- Capturas de preview revisadas: escritorio inicial/success a 1365×611 y móvil inicial/success a 390×844, sin scroll ni overflow horizontal.
- Aceptación visual y funcional del propietario: APROBADA por Luis el 2026-09-26.

### Aceptación final

`APPROVED`

V4 queda aceptada y cerrada como vista Auth implementada. El flujo sigue siendo una demostración sin TOTP real, sesión, persistencia ni envío de códigos.

Lock Screen y selección/exportación final permanecen fuera de este incremento.

Lock Screen y selección/exportación final permanecen fuera de este incremento.
