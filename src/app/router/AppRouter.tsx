import { Navigate, Route, Routes } from 'react-router';
import { ProtectedRoute } from '@/auth/ProtectedRoute';
import { ApplicationDemoPage } from '@/pages/ApplicationDemoPage';
import { ApplicationDetailPage } from '@/pages/ApplicationDetailPage';
import { ApplicationsPage } from '@/pages/ApplicationsPage';
import { ComponentsPage } from '@/pages/ComponentsPage';
import { ComposerPage } from '@/pages/ComposerPage';
import { DocumentationPage } from '@/pages/DocumentationPage';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { PublicShell } from '@/shell/PublicShell';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicShell />}>
        <Route index element={<LandingPage />} />
        <Route path="apps" element={<ApplicationsPage />} />
        <Route path="apps/:slug" element={<ApplicationDetailPage />} />
        <Route path="docs/*" element={<DocumentationPage />} />
        <Route path="components" element={<ComponentsPage />} />
        <Route path="login" element={<LoginPage />} />
      </Route>

      <Route path="demo/:slug/*" element={<ApplicationDemoPage />} />
      <Route
        path="composer/*"
        element={
          <ProtectedRoute>
            <ComposerPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
