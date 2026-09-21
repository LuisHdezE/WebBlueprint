import { Link, NavLink, Outlet } from 'react-router';

const navItems = [
  { to: '/apps', label: 'Applications' },
  { to: '/docs', label: 'Documentation' },
  { to: '/components', label: 'Components' },
] as const;

function navClassName({ isActive }: { isActive: boolean }) {
  return `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
  }`;
}

export function PublicShell() {
  return (
    <div className="min-h-dvh bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link className="flex min-w-0 items-center gap-3" to="/" aria-label="WebBlueprint home">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-950 text-sm font-bold text-white shadow-sm">
              WB
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold tracking-tight">WebBlueprint</span>
              <span className="block truncate text-xs text-slate-500">Applications before infrastructure</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink key={item.to} className={navClassName} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100" to="/login">
              Sign in
            </Link>
            <Link className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800" to="/login">
              App Composer
            </Link>
          </div>

          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
              Menu
            </summary>
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              <nav className="grid gap-1" aria-label="Mobile navigation">
                {navItems.map((item) => (
                  <NavLink key={item.to} className={navClassName} to={item.to}>
                    {item.label}
                  </NavLink>
                ))}
                <div className="my-1 border-t border-slate-100" />
                <Link className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100" to="/login">
                  Sign in
                </Link>
                <Link className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white" to="/login">
                  App Composer
                </Link>
              </nav>
            </div>
          </details>
        </div>
      </header>

      <Outlet />

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="font-semibold text-slate-800">WebBlueprint</p>
            <p className="mt-1">Reusable frontend systems, navigable proposals and application composition.</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link className="hover:text-slate-950" to="/apps">Applications</Link>
            <Link className="hover:text-slate-950" to="/docs">Documentation</Link>
            <Link className="hover:text-slate-950" to="/login">Composer access</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
