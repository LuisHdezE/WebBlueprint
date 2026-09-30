import { Navigate, Route, Routes } from 'react-router';
import { ProtectedRoute } from '@/auth/ProtectedRoute';
import { JsonPasswordResetContentProvider } from '@/features/authentication/password-reset/infrastructure/JsonPasswordResetContentProvider';
import { MockPasswordResetGateway } from '@/features/authentication/password-reset/infrastructure/MockPasswordResetGateway';
import { PasswordResetPage } from '@/features/authentication/password-reset/presentation/PasswordResetPage';
import { JsonSignInContentProvider } from '@/features/authentication/sign-in/infrastructure/JsonSignInContentProvider';
import { MockSignInGateway } from '@/features/authentication/sign-in/infrastructure/MockSignInGateway';
import { SignInPage } from '@/features/authentication/sign-in/presentation/SignInPage';
import { JsonSignUpContentProvider } from '@/features/authentication/sign-up/infrastructure/JsonSignUpContentProvider';
import { MockSignUpGateway } from '@/features/authentication/sign-up/infrastructure/MockSignUpGateway';
import { SignUpPage } from '@/features/authentication/sign-up/presentation/SignUpPage';
import { JsonTwoFactorContentProvider } from '@/features/authentication/two-factor/infrastructure/JsonTwoFactorContentProvider';
import { MockTwoFactorGateway } from '@/features/authentication/two-factor/infrastructure/MockTwoFactorGateway';
import { TwoFactorPage } from '@/features/authentication/two-factor/presentation/TwoFactorPage';
import { JsonLockScreenContentProvider } from '@/features/authentication/lock-screen/infrastructure/JsonLockScreenContentProvider';
import { MockLockScreenGateway } from '@/features/authentication/lock-screen/infrastructure/MockLockScreenGateway';
import { LockScreenPage } from '@/features/authentication/lock-screen/presentation/LockScreenPage';
import { AccountSettingsPage } from '@/features/user/presentation/AccountSettingsPage';
import { UserProfilePage } from '@/features/user/presentation/UserProfilePage';
import { MapViewPage } from '@/features/maps/presentation/MapViewPage';
import { ComponentShowcasePage, type ComponentShowcaseKind } from '@/features/components/presentation/ComponentShowcasePage';
import { ElementShowcasePage, type ElementShowcaseKind } from '@/features/elements/presentation/ElementShowcasePage';
import { BlankPage, ContactPage, EmptyPage, FaqPage, KnowledgeBasePage, MaintenancePage, NotFoundPage, ServerErrorPage } from '@/features/pages/presentation/PublicSystemPages';
import { JsonBlogContentProvider } from '@/features/applications/blog/infrastructure/JsonBlogContentProvider';
import { JsonCalendarContentProvider } from '@/features/applications/calendar/infrastructure/JsonCalendarContentProvider';
import { CalendarPage } from '@/features/applications/calendar/presentation/CalendarPage';
import { JsonChatContentProvider } from '@/features/applications/chat/infrastructure/JsonChatContentProvider';
import { ChatPage } from '@/features/applications/chat/presentation/ChatPage';
import { JsonContactsContentProvider } from '@/features/applications/contacts/infrastructure/JsonContactsContentProvider';
import { ContactsPage } from '@/features/applications/contacts/presentation/ContactsPage';
import { BlogEditorPage } from '@/features/applications/blog/presentation/BlogEditorPage';
import { BlogGridPage } from '@/features/applications/blog/presentation/BlogGridPage';
import { BlogListPage } from '@/features/applications/blog/presentation/BlogListPage';
import { BlogPostPage } from '@/features/applications/blog/presentation/BlogPostPage';
import { ApplicationDemoPage } from '@/pages/ApplicationDemoPage';
import { ApplicationDetailPage } from '@/pages/ApplicationDetailPage';
import { ApplicationsPage } from '@/pages/ApplicationsPage';
import { ComponentsPage } from '@/pages/ComponentsPage';
import { ComposerPage } from '@/pages/ComposerPage';
import { ComposerPreviewPage } from '@/pages/ComposerPreviewPage';
import { DocumentationPage } from '@/pages/DocumentationPage';
import { LoginPage } from '@/pages/LoginPage';
import { TemplateComposerExportPage } from '@/pages/TemplateComposerExportPage';
import { TemplateOverviewPage } from '@/pages/TemplateOverviewPage';
import { TemplatePlaceholderPage } from '@/pages/TemplatePlaceholderPage';
import { PublicShell } from '@/shell/PublicShell';
import { TemplateShell } from '@/shell/TemplateShell';

const passwordResetContentProvider = new JsonPasswordResetContentProvider();
const passwordResetGateway = new MockPasswordResetGateway();
const signInContentProvider = new JsonSignInContentProvider();
const signInGateway = new MockSignInGateway();
const signUpContentProvider = new JsonSignUpContentProvider();
const signUpGateway = new MockSignUpGateway();
const twoFactorContentProvider = new JsonTwoFactorContentProvider();
const twoFactorGateway = new MockTwoFactorGateway();
const lockScreenContentProvider = new JsonLockScreenContentProvider();
const lockScreenGateway = new MockLockScreenGateway();
const blogContentProvider = new JsonBlogContentProvider();
const calendarContentProvider = new JsonCalendarContentProvider();
const chatContentProvider = new JsonChatContentProvider();
const contactsContentProvider = new JsonContactsContentProvider();

const templateFamilies = [
  'applications/*', 'components/*', 'elements/*', 'forms/*', 'tables/*', 'charts/*', 'widgets/*', 'maps/*', 'pages/*', 'user/*', 'authentication/*', 'layouts/*', 'documentation/*',
] as const;

const componentRoutes: readonly { path: string; kind: ComponentShowcaseKind; title: string; description: string }[] = [
  { path: 'components/accordion', kind: 'accordion', title: 'Accordion', description: 'Contenido expandible para organizar información por secciones.' },
  { path: 'components/cards', kind: 'cards', title: 'Cards', description: 'Superficies compactas para resumir entidades y estados.' },
  { path: 'components/carousel', kind: 'carousel', title: 'Carousel', description: 'Presentación secuencial de contenido destacado.' },
  { path: 'components/drag-drop', kind: 'drag-drop', title: 'Drag & Drop', description: 'Zonas de arrastre y elementos movibles.' },
  { path: 'components/lightbox', kind: 'lightbox', title: 'Lightbox', description: 'Vista enfocada para imágenes o contenido visual.' },
  { path: 'components/lists', kind: 'lists', title: 'Listas', description: 'Colecciones densas y legibles de información.' },
  { path: 'components/modal-dialog', kind: 'modal-dialog', title: 'Modal y Dialog', description: 'Interacciones que requieren atención contextual.' },
  { path: 'components/notifications', kind: 'notifications', title: 'Notificaciones', description: 'Mensajes de resultado, atención y contexto.' },
  { path: 'components/pricing', kind: 'pricing', title: 'Pricing', description: 'Comparación de planes y opciones comerciales.' },
  { path: 'components/tabs', kind: 'tabs', title: 'Tabs', description: 'Alternancia de contenido relacionado sin cambiar de ruta.' },
  { path: 'components/timeline', kind: 'timeline', title: 'Timeline', description: 'Secuencia visual de eventos y progreso.' },
] as const;

const elementRoutes: readonly { path: string; kind: ElementShowcaseKind; title: string; description: string }[] = [
  { path: 'elements/alerts', kind: 'alerts', title: 'Alerts', description: 'Mensajes de información, éxito, aviso y error.' },
  { path: 'elements/avatars', kind: 'avatars', title: 'Avatares', description: 'Identidad visual para personas y equipos.' },
  { path: 'elements/badges', kind: 'badges', title: 'Badges', description: 'Etiquetas compactas para estado y clasificación.' },
  { path: 'elements/breadcrumbs', kind: 'breadcrumbs', title: 'Breadcrumbs', description: 'Orientación jerárquica dentro de la navegación.' },
  { path: 'elements/buttons', kind: 'buttons', title: 'Botones', description: 'Acciones primarias, secundarias, destructivas y deshabilitadas.' },
  { path: 'elements/colors', kind: 'colors', title: 'Colores', description: 'Paleta semántica y tokens activos del tema.' },
  { path: 'elements/dropdowns', kind: 'dropdowns', title: 'Dropdowns', description: 'Menús compactos para acciones relacionadas.' },
  { path: 'elements/info-boxes', kind: 'info-boxes', title: 'Info Boxes', description: 'Bloques breves de contexto y ayuda.' },
  { path: 'elements/loaders', kind: 'loaders', title: 'Loaders', description: 'Indicadores para estados de carga.' },
  { path: 'elements/pagination', kind: 'pagination', title: 'Pagination', description: 'Navegación entre páginas de resultados.' },
  { path: 'elements/popovers', kind: 'popovers', title: 'Popovers', description: 'Contenido contextual asociado a un control.' },
  { path: 'elements/progress', kind: 'progress', title: 'Progress', description: 'Avance cuantificable de tareas y procesos.' },
  { path: 'elements/search', kind: 'search', title: 'Search', description: 'Entrada reutilizable para filtrar contenido.' },
  { path: 'elements/tooltips', kind: 'tooltips', title: 'Tooltips', description: 'Ayuda breve accesible sobre controles.' },
  { path: 'elements/tree-view', kind: 'tree-view', title: 'Tree View', description: 'Estructuras jerárquicas expandibles.' },
  { path: 'elements/typography', kind: 'typography', title: 'Tipografía', description: 'Jerarquía, lectura y estilos de texto.' },
] as const;

export function AppRouter() {
  return (
    <Routes>
      <Route path="authentication/sign-in" element={<SignInPage contentProvider={signInContentProvider} gateway={signInGateway} />} />
      <Route path="authentication/sign-up" element={<SignUpPage contentProvider={signUpContentProvider} gateway={signUpGateway} />} />
      <Route path="authentication/password-reset" element={<PasswordResetPage contentProvider={passwordResetContentProvider} gateway={passwordResetGateway} />} />
      <Route path="authentication/two-factor" element={<TwoFactorPage contentProvider={twoFactorContentProvider} gateway={twoFactorGateway} />} />
      <Route path="authentication/lock-screen" element={<LockScreenPage contentProvider={lockScreenContentProvider} gateway={lockScreenGateway} />} />
      <Route element={<TemplateShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<TemplateOverviewPage />} />
        <Route path="composer" element={<TemplateComposerExportPage />} />
        <Route path="maps" element={<MapViewPage />} />
        <Route path="applications/blog/list" element={<BlogListPage contentProvider={blogContentProvider} />} />
        <Route path="applications/blog/grid" element={<BlogGridPage contentProvider={blogContentProvider} />} />
        <Route path="applications/blog/post" element={<BlogPostPage contentProvider={blogContentProvider} />} />
        <Route path="applications/blog/editor" element={<BlogEditorPage contentProvider={blogContentProvider} />} />
        <Route path="applications/calendar" element={<CalendarPage contentProvider={calendarContentProvider} />} />
        <Route path="applications/chat" element={<ChatPage contentProvider={chatContentProvider} />} />
        <Route path="applications/contacts" element={<ContactsPage contentProvider={contactsContentProvider} />} />
        {componentRoutes.map((component) => <Route key={component.path} path={component.path} element={<ComponentShowcasePage description={component.description} kind={component.kind} title={component.title} />} />)}
        {elementRoutes.map((element) => <Route key={element.path} path={element.path} element={<ElementShowcasePage description={element.description} kind={element.kind} title={element.title} />} />)}
        <Route path="pages/contact" element={<ContactPage />} /><Route path="pages/faq" element={<FaqPage />} /><Route path="pages/knowledge-base" element={<KnowledgeBasePage />} /><Route path="pages/maintenance" element={<MaintenancePage />} /><Route path="pages/not-found" element={<NotFoundPage />} /><Route path="pages/server-error" element={<ServerErrorPage />} /><Route path="pages/blank" element={<BlankPage />} /><Route path="pages/empty" element={<EmptyPage />} />
        <Route path="user/profile" element={<UserProfilePage />} /><Route path="user/account-settings" element={<AccountSettingsPage />} />
        {templateFamilies.map((path) => <Route key={path} path={path} element={<TemplatePlaceholderPage />} />)}
      </Route>
      <Route element={<PublicShell />}>
        <Route path="apps" element={<ApplicationsPage />} /><Route path="apps/:slug" element={<ApplicationDetailPage />} /><Route path="login" element={<LoginPage />} /><Route path="legacy/docs/*" element={<DocumentationPage />} /><Route path="legacy/components" element={<ComponentsPage />} />
      </Route>
      <Route path="preview" element={<ComposerPreviewPage />} /><Route path="demo/:slug/*" element={<ApplicationDemoPage />} /><Route path="legacy/composer/*" element={<ProtectedRoute><ComposerPage /></ProtectedRoute>} /><Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
