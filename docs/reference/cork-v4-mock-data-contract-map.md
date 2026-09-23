# U1.4 · Mapa de contratos mock orientados a UI

Estado: **BORRADOR GOBERNADO**  
Ratificado por: `docs/decisions/0008-contract-first-export-architecture.md`

## Principio

Las vistas no deben importar fixtures de dominio directamente.

Cada familia impulsada por datos consume una frontera pequeña de provider/repository/service/use-case/hook. La implementación inicial puede ser mock, pero la página depende del contrato y no del archivo fixture.

Los datos mock locales deben respetar la misma forma contractual que se espera que entregue la futura API. El contrato se define desde la necesidad de la aplicación y se valida primero contra JSON local; posteriormente el backend deberá cumplirlo o versionar explícitamente cualquier cambio.

La diferencia entre la fase mock y la fase integrada debe ser la fuente de la información, no la forma consumida por la vista.

## Contratos por familia

| Familia / vistas | Modelo UI mínimo | Frontera candidata | Fuente mock inicial |
|---|---|---|---|
| Dashboard | `DashboardMetric`, `DashboardActivityItem`, `DashboardSeries` | `DashboardDataProvider` | JSON + `mockDashboardDataProvider` |
| Calendario | `CalendarEvent`, `CalendarResource`, `CalendarRange` | `CalendarRepository` | JSON + `mockCalendarRepository` |
| Chat | `ConversationSummary`, `Message`, `Participant` | `MessagingRepository` | JSON + `mockMessagingRepository` |
| Contactos | `ContactSummary`, `ContactDetail`, `ContactChannel` | `ContactsRepository` | JSON + `mockContactsRepository` |
| Productos admin | `ProductSummary`, `ProductFilter`, `ProductStockState` | `ProductsRepository` | JSON + `mockProductsRepository` |
| Tienda pública | `CatalogProductCard`, `CatalogFilter`, `CatalogCategory` | `CatalogProvider` | JSON + `mockCatalogProvider` |
| Detalle de producto | `ProductDetail`, `ProductVariant`, `ProductMedia` | `ProductsRepository` | comparte `mockProductsRepository` |
| Facturas | `InvoiceSummary`, `InvoiceLine`, `InvoiceDocument`, `InvoiceTotals` | `InvoicesRepository` | JSON + `mockInvoicesRepository` |
| Correo | `MailboxFolder`, `MailThread`, `MailMessage` | `MailboxRepository` | JSON + `mockMailboxRepository` |
| Notas | `NoteSummary`, `Note`, `NoteTag` | `NotesRepository` | JSON + `mockNotesRepository` |
| Kanban | `BoardColumn`, `BoardCard`, `BoardCardMeta` | `BoardRepository` | JSON + `mockBoardRepository` |
| Tareas | `Task`, `TaskFilter`, `TaskStatus` | `TasksRepository` | JSON + `mockTasksRepository` |
| Contenido/blog | `ArticleSummary`, `ArticleDetail`, `ContentAuthor` | `ContentRepository` | JSON + `mockContentRepository` |
| Mapa | `MapMarker`, `MapViewport`, `MapCluster` | `MapDataProvider` | JSON + `mockMapDataProvider` |
| Perfil | `UserProfileView`, `ProfileActivity` | `ProfileRepository` | JSON + `mockProfileRepository` |
| Configuración de cuenta | `AccountPreference`, `SecurityPreference`, `SessionSummary` | `AccountSettingsRepository` | JSON + `mockAccountSettingsRepository` |
| Base de conocimiento | `KnowledgeCategory`, `KnowledgeArticleSummary`, `KnowledgeArticle` | `KnowledgeRepository` | JSON + `mockKnowledgeRepository` |

## Flujo contract-first

```text
Vista
  ↓
Application / Use Case
  ↓
Contrato de Repository/Provider
  ├── implementación JSON local
  └── implementación API futura
```

La vista no debe conocer cuál de las implementaciones está activa.

Cuando la API exista:

```text
JSON DTO ─┐
          ├─→ mapper → modelo de aplicación/dominio → caso de uso → vista
API DTO ──┘
```

Si el DTO de transporte y el modelo interno son equivalentes, el mapper puede ser trivial. Si no lo son, la traducción debe permanecer en infraestructura.

## Superficies con datos estáticos/configurables

Estas vistas pueden comenzar desde configuración local tipada sin un repository de dominio completo:

- FAQ;
- Contacto público;
- Mantenimiento;
- NotFound.

Aun así, el contenido debe estar centralizado en una definición/configuración y no incrustado de forma divergente en múltiples componentes.

## Auth

Los flujos de registro, recuperación, 2FA y bloqueo deben depender del mismo límite reemplazable de sesión/autenticación ya establecido conceptualmente en U0.2.

Contratos candidatos:

```text
AuthProvider
  signIn
  signUp
  requestPasswordReset
  verifyTwoFactor
  lockSession
  unlockSession
  signOut
```

La capa de presentación no implementa estos comportamientos ni conoce si la implementación es mock o backend real.

## Forma de resultado para páginas

Las fronteras deben permitir representar al menos:

```text
idle
loading
success(data)
empty
error
```

Cuando una vista necesite mutaciones, el contrato debe separar claramente acciones y lectura. No se simularán reglas de negocio complejas dentro del componente React.

Cuando aplique, los contratos también deben contemplar desde el inicio la estructura necesaria para paginación, filtros y ordenamiento.

## Reglas de mocks

1. Fixtures, JSON y generadores viven fuera de `pages/` y de los componentes de presentación.
2. La página consume contratos/casos de uso/hooks, no arrays ni JSON importados directamente.
3. Los IDs mock deben ser estables para tests y navegación.
4. Los mocks deben ser deterministas salvo que un test solicite aleatoriedad explícita.
5. Las imágenes mock son metadata visual y no una capacidad de negocio inventada.
6. Los estados vacío/error/loading deben poder activarse de forma controlada.
7. El JSON mock debe respetar la forma contractual esperada de la futura API.
8. La presentación no realiza `fetch()` directamente ni cambia cuando la fuente pasa de JSON a HTTP.
9. El acceso a archivos JSON, HTTP, `localStorage` u otra fuente concreta pertenece a infraestructura/adapters.
10. Si la futura API necesita alterar un contrato ya consumido, el cambio debe ser explícito y versionado, no una ruptura silenciosa del frontend.

## Relación con ApiBlueprint

Los contratos ratificados en WebBlueprint se consideran input para el diseño posterior de la API. Cuando el backend se construya, OpenAPI/Swagger y los contract tests deberán demostrar que las respuestas reales satisfacen la forma consumida por el frontend.

Los proyectos exportados podrán incluir progresivamente artefactos en `contracts/` u `openapi/` para facilitar esa continuidad.

## Prioridad para las vistas reales

Cada nueva vista impulsada por datos debe registrar simultáneamente:

- su modelo/DTO contractual;
- su frontera de acceso a datos;
- uno o más JSON de ejemplo;
- estados relevantes de UI;
- tests de conformidad del mock contra el contrato.

La fuente API se incorporará después sin cambiar la capa de presentación.
