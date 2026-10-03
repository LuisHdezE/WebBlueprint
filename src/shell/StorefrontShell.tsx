import { useRef } from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import type { StorefrontProvider } from '@/features/storefront/application/storefront.contracts';

function navClassName({ isActive }: { isActive: boolean }) {
  return `rounded-full px-3 py-2 text-sm font-semibold transition ${
    isActive ? 'bg-slate-950 text-white' : 'text-slate-700 hover:bg-white hover:text-slate-950'
  }`;
}

export function StorefrontShell({ provider }: { provider: StorefrontProvider }) {
  const shell = provider.getShellView();
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

  function closeMobileMenu() {
    mobileMenuRef.current?.removeAttribute('open');
  }

  return (
    <div className="min-h-dvh bg-[#f7f2ea] text-slate-900" data-storefront-shell>
      <div className="bg-slate-950 px-4 py-2 text-center text-xs font-semibold text-white sm:text-sm" data-storefront-announcement>
        {shell.announcement}
      </div>

      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f7f2ea]/95 backdrop-blur">
        <div className="mx-auto grid max-w-[1440px] gap-3 px-4 py-3 sm:px-5 lg:px-6">
          <div className="grid gap-3 lg:grid-cols-[auto_minmax(18rem,1fr)_auto] lg:items-center">
            <div className="flex items-center justify-between gap-3">
              <Link className="flex min-w-0 items-center gap-3" to="/store" aria-label={`Inicio de ${shell.storeName}`}>
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white shadow-sm">
                  {shell.logoText}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-base font-black tracking-tight text-slate-950">{shell.storeName}</span>
                  <span className="hidden truncate text-xs text-slate-600 sm:block">{shell.storeTagline}</span>
                </span>
              </Link>

              <details ref={mobileMenuRef} className="relative lg:hidden">
                <summary className="cursor-pointer list-none rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm">
                  Menú
                </summary>
                <div className="absolute right-0 mt-2 w-72 rounded-3xl border border-black/10 bg-white p-3 shadow-2xl">
                  <nav className="grid gap-1" aria-label="Navegación móvil de tienda">
                    {[...shell.primaryNav, ...shell.utilityNav].map((item) => (
                      <NavLink key={item.id} className={navClassName} to={item.href} onClick={closeMobileMenu}>
                        {item.label}
                      </NavLink>
                    ))}
                  </nav>
                </div>
              </details>
            </div>

            <label className="relative block" aria-label="Buscar en la tienda">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">⌕</span>
              <input
                className="h-11 w-full rounded-full border border-black/10 bg-white px-10 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-950/10"
                placeholder={shell.searchPlaceholder}
                type="search"
              />
            </label>

            <nav className="hidden items-center justify-end gap-2 lg:flex" aria-label="Acciones de tienda">
              {shell.utilityNav.map((item) => (
                <Link key={item.id} className="rounded-full border border-black/10 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-900 hover:text-slate-950" to={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden items-center justify-between gap-3 lg:flex">
            <nav className="flex flex-wrap items-center gap-1" aria-label="Navegación principal de tienda">
              {shell.primaryNav.map((item) => (
                <NavLink key={item.id} className={navClassName} end={item.href === '/store'} to={item.href}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <nav className="flex flex-wrap items-center justify-end gap-2" aria-label="Categorías destacadas">
              {shell.categoryNav.map((item) => (
                <Link key={item.id} className="rounded-full bg-white/70 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-white hover:text-slate-950" to={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="min-h-[60dvh]">
        <Outlet />
      </main>

      <footer className="border-t border-black/10 bg-slate-950 text-white" data-storefront-footer>
        <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-10 sm:px-5 md:grid-cols-[minmax(0,1fr)_auto] lg:px-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-white text-sm font-black text-slate-950">{shell.logoText}</span>
              <div>
                <p className="font-black">{shell.storeName}</p>
                <p className="text-sm text-white/70">{shell.support.serviceArea}</p>
              </div>
            </div>
            <Link className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-slate-200" to={shell.support.whatsappHref}>
              {shell.support.whatsappLabel}
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {shell.footerColumns.map((column) => (
              <div key={column.id}>
                <p className="text-sm font-black uppercase tracking-[0.08em] text-white/70">{column.title}</p>
                <div className="mt-3 grid gap-2">
                  {column.links.map((link) => (
                    <Link key={link.id} className="text-sm text-white/70 transition hover:text-white" to={link.href}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
