import { Navigate, Route, Routes } from 'react-router';
import { ProtectedRoute } from '@/auth/ProtectedRoute';
import { ApplicationDemoPage } from '@/pages/ApplicationDemoPage';
import { ApplicationDetailPage } from '@/pages/ApplicationDetailPage';
import { ApplicationsPage } from '@/pages/ApplicationsPage';
import { ComposerPage } from '@/pages/ComposerPage';
import { FoundationPage } from '@/pages/FoundationPage';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/apps" element={<ApplicationsPage />} />
      <Route path="/apps/:slug" element={<ApplicationDetailPage />} />
      <Route path="/demo/:slug/*" element={<ApplicationDemoPage />} />
      <Route
        path="/docs/*"
        element={
          <FoundationPage
            eyebrow="Documentation"
            title="Living public documentation starts here."
            description="Every reusable component and governed pattern will be documented as it enters the library."
          />
        }
      />
      <Route
        path="/components"
        element={
          <FoundationPage
            eyebrow="Component Library"
            title="Components will be added from real page needs."
            description="The gallery grows incrementally. Pages compose shared primitives instead of reimplementing them."
          />
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/composer/*"
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
