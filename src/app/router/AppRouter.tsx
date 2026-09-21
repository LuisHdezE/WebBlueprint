import { Navigate, Route, Routes } from 'react-router';
import { FoundationPage } from '@/pages/FoundationPage';

export function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <FoundationPage
            eyebrow="U0 · Foundation"
            title="WebBlueprint is being built from the system outward."
            description="React, Tailwind, mobile-first architecture, living documentation, reusable components, an App Composer, and an exportable application pipeline."
          />
        }
      />
      <Route
        path="/docs"
        element={
          <FoundationPage
            eyebrow="Documentation"
            title="Living documentation starts here."
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
      <Route
        path="/composer"
        element={
          <FoundationPage
            eyebrow="App Composer"
            title="The application generator begins with the product."
            description="Project identity, branding, features, navigation, manifest generation, and ZIP export will evolve here from the earliest increments."
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
