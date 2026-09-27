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
import { BlankPage, ContactPage, EmptyPage, FaqPage, KnowledgeBasePage, MaintenancePage, NotFoundPage, ServerErrorPage } from '@/features/pages/presentation/PublicSystemPages';
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

const templateFamilies = [
  'applications/*',
  'components/*',
  'elements/*',
  'forms/*',
  'tables/*',
  'charts/*',
  'widgets/*',
  'maps/*',
  'pages/*',
  'user/*',
  'authentication/*',
  'layouts/*',
  'documentation/*',
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
        {componentRoutes.map((component) => <Route key={component.path} path={component.path} element={<ComponentShowcasePage description={component.description} kind={component.kind} title={component.title} />} />)}
        <Route path="pages/contact" element={<ContactPage />} />
        <Route path="pages/faq" element={<FaqPage />} />
        <Route path="pages/knowledge-base" element={<KnowledgeBasePage />} />
        <Route path="pages/maintenance" element={<MaintenancePage />} />
        <Route path="pages/not-found" element={<NotFoundPage />} />
        <Route path="pages/server-error" element={<ServerErrorPage />} />
        <Route path="pages/blank" element={<BlankPage />} />
        <Route path="pages/empty" element={<EmptyPage />} />
        <Route path="user/profile" element={<UserProfilePage />} />
        <Route path="user/account-settings" element={<AccountSettingsPage />} />
        {templateFamilies.map((path) => (
          <Route key={path} path={path} element={<TemplatePlaceholderPage />} />
        ))}
      </Route>

      <Route element={<PublicShell />}>
        <Route path="apps" element={<ApplicationsPage />} />
        <Route path="apps/:slug" element={<ApplicationDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="legacy/docs/*" element={<DocumentationPage />} />
        <Route path="legacy/components" element={<ComponentsPage />} />
      </Route>

      <Route path="preview" element={<ComposerPreviewPage />} />
      <Route path="demo/:slug/*" element={<ApplicationDemoPage />} />
      <Route path="legacy/composer/*" element={<ProtectedRoute><ComposerPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
