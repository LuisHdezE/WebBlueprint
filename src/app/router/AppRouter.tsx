import { Navigate, Route, Routes } from 'react-router';
import { ProtectedRoute } from '@/auth/ProtectedRoute';
import { JsonPasswordResetContentProvider } from '@/features/authentication/password-reset/infrastructure/JsonPasswordResetContentProvider';
import { MockPasswordResetGateway } from '@/features/authentication/password-reset/infrastructure/MockPasswordResetGateway';
import { PasswordResetPage } from '@/features/authentication/password-reset/presentation/PasswordResetPage';
import { JsonSignInContentProvider } from '@/features/authentication/sign-in/infrastructure/JsonSignInContentProvider';
import { MockSignInGateway } from '@/features/authentication/sign-in/infrastructure/MockSignInGateway';
import { SignInPage } from '@/features/authentication/sign-in/presentation/SignInPage';
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

export function AppRouter() {
  return (
    <Routes>
      <Route
        path="authentication/sign-in"
        element={<SignInPage contentProvider={signInContentProvider} gateway={signInGateway} />}
      />
      <Route
        path="authentication/password-reset"
        element={
          <PasswordResetPage
            contentProvider={passwordResetContentProvider}
            gateway={passwordResetGateway}
          />
        }
      />

      <Route element={<TemplateShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<TemplateOverviewPage />} />
        <Route path="composer" element={<TemplateComposerExportPage />} />
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
      <Route
        path="legacy/composer/*"
        element={
          <ProtectedRoute>
            <ComposerPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
