import { Navigate, Route, Routes } from 'react-router';
import { ProtectedRoute } from '@/auth/ProtectedRoute';
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
