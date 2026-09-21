import { useRef } from 'react';
import { Link, NavLink, Outlet } from 'react-router';

const navItems = [
  { to: '/apps', label: 'Aplicaciones' },
  { to: '/docs', label: 'Documentación' },
  { to: '/components', label: 'Componentes' },
] as const;

function navClassName({ isActive }: { isActive: boolean }) {
  return `rounded-lg px-2.5 py-1.5 text-sm font-medium transition ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;
}

export function PublicShell() {
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

  function closeMobileMenu() {
    mobileMenuRef.current?.removeAttribute('open');
  }

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-2 sm:px-5 lg:px-6">
          <Link className="flex min-w-0 items-center gap-2.5" to="/" aria-label="Inicio de WebBlueprint">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-600 text-[11px] font-bold text-white shadow-sm">
              WB
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold tracking-tight text-slate-900">WebBlueprint</span>
              <span className="hidden truncate text-[11px] text-slate-500 sm:block">Aplicaciones antes de la infraestructura</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Navegación principal">
            {navItems.map((item) => (
              <NavLink key={item.to} className={navClassName} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-1.5 md:flex">
            <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100" to="/login">
              Iniciar sesión
            </Link>
            <Link className="rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700" to="/login">
              Compositor
            </Link>
          </div>

          <details ref={mobileMenuRef} className="relative md:hidden">
            <summary className="cursor-pointer list-none rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm">
              Menú
            </summary>
            <div className="absolute right-0 mt-2 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              <nav className="grid gap-1" aria-label="Navegación móvil">
                {navItems.map((item) => (
                  <NavLink key={item.to} className={navClassName} to={item.to} onClick={closeMobileMenu}>
                    {item.label}
                  </NavLink>
                ))}
                <div className="my-1 border-t border-slate-100" />
                <Link className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100" to="/login" onClick={closeMobileMenu}>
                  Iniciar sesión
                </Link>
                <Link className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white" to="/login" onClick={closeMobileMenu}>
                  Compositor
                </Link>
              </nav>
            </div>
          </details>
        </div>
      </header>

      <Outlet />

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-5 text-sm text-slate-500 sm:px-5 md:flex-row md:items-center md:justify-between lg:px-6">
          <div>
            <p className="font-semibold text-slate-800">WebBlueprint</p>
            <p className="mt-0.5 text-xs">Frontends reutilizables, propuestas navegables y composición de aplicaciones.</p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs sm:text-sm">
            <Link className="hover:text-brand-700" to="/apps">Aplicaciones</Link>
            <Link className="hover:text-brand-700" to="/docs">Documentación</Link>
            <Link className="hover:text-brand-700" to="/login">Acceso al Compositor</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
