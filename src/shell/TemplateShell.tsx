import { useState } from 'react';
import { Outlet } from 'react-router';
import { TemplateSidebar } from '@/shell/TemplateSidebar';
import { TemplateTopbar } from '@/shell/TemplateTopbar';

export function TemplateShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-[var(--surface-page)] text-slate-800">
      <TemplateTopbar
        sidebarCollapsed={sidebarCollapsed}
        onOpenMobileMenu={() => setMobileOpen(true)}
        onToggleSidebar={() => setSidebarCollapsed((current) => !current)}
      />
      <TemplateSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <main
        className={`min-h-dvh pt-12 transition-[padding] duration-200 ${
          sidebarCollapsed ? 'md:pl-[68px]' : 'md:pl-[232px]'
        }`}
      >
        <div className="min-h-[calc(100dvh-48px)] bg-[var(--surface-page)] p-4 sm:p-[18px] lg:p-5">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
