import { AppIcon } from '@/components/AppIcon';
import { ThemeColorPicker } from '@/theme/ThemeColorPicker';

interface TemplateTopbarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobileMenu: () => void;
}

export function TemplateTopbar({ sidebarCollapsed, onToggleSidebar, onOpenMobileMenu }: TemplateTopbarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-12 items-center bg-[var(--theme-primary)] text-[var(--theme-on-primary)] shadow-sm">
      <div className="flex h-full w-[232px] shrink-0 items-center gap-2 px-3 max-md:w-auto">
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-md text-white/85 transition hover:bg-white/10 hover:text-white md:hidden"
          onClick={onOpenMobileMenu}
          aria-label="Abrir navegación"
        >
          <AppIcon className="size-[18px]" name="menu" />
        </button>
        <button
          type="button"
          className="hidden size-8 items-center justify-center rounded-md text-white/85 transition hover:bg-white/10 hover:text-white md:flex"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? 'Expandir navegación' : 'Colapsar navegación'}
        >
          <AppIcon className="size-[18px]" name="menu" />
        </button>
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid size-7 shrink-0 place-items-center rounded bg-white/14 text-[10px] font-bold tracking-wide">WB</span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[13px] font-semibold">WebBlueprint</p>
            <p className="truncate text-[10px] text-white/65 max-lg:hidden">General UI Template</p>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-3 sm:px-4">
        <div className="hidden w-full max-w-[420px] items-center gap-2 rounded-md bg-white/10 px-2.5 py-1.5 md:flex">
          <AppIcon className="size-4 shrink-0 text-white/70" name="search" />
          <input
            aria-label="Buscar en el Blueprint"
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-xs text-white outline-none placeholder:text-white/55 focus:ring-0"
            placeholder="Buscar vistas y componentes..."
            type="search"
          />
        </div>

        <div className="ml-auto flex items-center gap-0.5">
          <ThemeColorPicker />
          <button
            aria-label="Notificaciones"
            className="flex size-8 items-center justify-center rounded-md text-white/80 transition hover:bg-white/10 hover:text-white"
            type="button"
          >
            <AppIcon className="size-[18px]" name="bell" />
          </button>
          <button
            aria-label="Ayuda"
            className="hidden size-8 items-center justify-center rounded-md text-white/80 transition hover:bg-white/10 hover:text-white sm:flex"
            type="button"
          >
            <AppIcon className="size-[18px]" name="help" />
          </button>
          <div className="ml-1 hidden items-center gap-2 border-l border-white/15 pl-2 sm:flex">
            <div className="text-right leading-tight max-lg:hidden">
              <p className="text-[11px] font-semibold">Administrador</p>
              <p className="text-[9px] text-white/60">Blueprint</p>
            </div>
            <div className="grid size-7 place-items-center rounded-full bg-white/18 text-[10px] font-bold">LH</div>
          </div>
        </div>
      </div>
    </header>
  );
}
