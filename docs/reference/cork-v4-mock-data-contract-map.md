# U1.4 · Mapa de contratos mock orientados a UI

Estado: **BORRADOR GOBERNADO**

## Principio

Las vistas de U2 no deben importar fixtures de dominio directamente.

Cada familia impulsada por datos consume una frontera pequeña de provider/repository/service/hook. La implementación inicial puede ser mock, pero la página depende del contrato y no del archivo fixture.

Los nombres siguientes son contratos candidatos. U1 define la forma y la responsabilidad; U2 decidirá el archivo/API exacto al implementar el primer consumidor.

## Contratos por familia

| Familia / vistas | Modelo UI mínimo | Frontera candidata | Fuente mock inicial |
|---|---|---|---|
| Dashboard | `DashboardMetric`, `DashboardActivityItem`, `DashboardSeries` | `DashboardDataProvider` | `mockDashboardDataProvider` |
| Calendario | `CalendarEvent`, `CalendarResource`, `CalendarRange` | `CalendarRepository` | `mockCalendarRepository` |
| Chat | `ConversationSummary`, `Message`, `Participant` | `MessagingRepository` | `mockMessagingRepository` |
| Contactos | `ContactSummary`, `ContactDetail`, `ContactChannel` | `ContactsRepository` | `mockContactsRepository` |
| Productos admin | `ProductSummary`, `ProductFilter`, `ProductStockState` | `ProductsRepository` | `mockProductsRepository` |
| Tienda pública | `CatalogProductCard`, `CatalogFilter`, `CatalogCategory` | `CatalogProvider` | `mockCatalogProvider` |
| Detalle de producto | `ProductDetail`, `ProductVariant`, `ProductMedia` | `ProductsRepository` | comparte `mockProductsRepository` |
| Facturas | `InvoiceSummary`, `InvoiceLine`, `InvoiceDocument`, `InvoiceTotals` | `InvoicesRepository` | `mockInvoicesRepository` |
| Correo | `MailboxFolder`, `MailThread`, `MailMessage` | `MailboxRepository` | `mockMailboxRepository` |
| Notas | `NoteSummary`, `Note`, `NoteTag` | `NotesRepository` | `mockNotesRepository` |
| Kanban | `BoardColumn`, `BoardCard`, `BoardCardMeta` | `BoardRepository` | `mockBoardRepository` |
| Tareas | `Task`, `TaskFilter`, `TaskStatus` | `TasksRepository` | `mockTasksRepository` |
| Contenido/blog | `ArticleSummary`, `ArticleDetail`, `ContentAuthor` | `ContentRepository` | `mockContentRepository` |
| Mapa | `MapMarker`, `MapViewport`, `MapCluster` | `MapDataProvider` | `mockMapDataProvider` |
| Perfil | `UserProfileView`, `ProfileActivity` | `ProfileRepository` | `mockProfileRepository` |
| Configuración de cuenta | `AccountPreference`, `SecurityPreference`, `SessionSummary` | `AccountSettingsRepository` | `mockAccountSettingsRepository` |
| Base de conocimiento | `KnowledgeCategory`, `KnowledgeArticleSummary`, `KnowledgeArticle` | `KnowledgeRepository` | `mockKnowledgeRepository` |

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

U1 no amplía el mock actual ni implementa estos métodos. Solo prohíbe que futuras páginas CORK creen lógica de autenticación aislada.

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

## Reglas de mocks

1. Fixtures y generadores viven fuera de `pages/`.
2. La página consume contratos/hooks, no arrays importados directamente.
3. Los IDs mock deben ser estables para tests y navegación.
4. Los mocks deben ser deterministas salvo que un test solicite aleatoriedad explícita.
5. Las imágenes mock son metadata visual y no una capacidad de negocio inventada.
6. Los estados vacío/error/loading deben poder activarse de forma controlada.
7. El contrato UI no intenta copiar anticipadamente una API backend que todavía no existe.

## Prioridad para U2

El primer incremento de U2 debe elegir una familia que fuerce la creación de primitivas de alto retorno y un límite de datos útil. Dashboard + DataTable/List + feedback o una familia de comercio son candidatos naturales, pero la selección se decide al abrir U2 y no queda autorizada por este documento.
