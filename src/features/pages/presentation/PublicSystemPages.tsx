import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { AppIcon } from '@/components/AppIcon';
import { PageShell } from '@/shell/PageShell';

function PageCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-md border border-slate-200 bg-white p-5 ${className}`}>{children}</section>;
}

export function ContactPage() {
  return (
    <PageShell breadcrumbs={[{ label: 'Páginas' }, { label: 'Contacto' }]} description="Encuentra al equipo correcto y envía una solicitud con el contexto necesario." title="Contacto">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.7fr)]">
        <PageCard>
          <h2 className="text-[13px] font-semibold text-slate-900">Envíanos un mensaje</h2>
          <p className="mt-1 text-[11px] text-slate-500">Normalmente respondemos en menos de un día hábil.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-[11px] font-semibold text-slate-700">Nombre<input className="h-10 rounded-md border border-slate-200 px-3 text-[12px] font-normal outline-none focus:border-[var(--theme-primary)]" placeholder="Tu nombre" /></label>
            <label className="grid gap-1.5 text-[11px] font-semibold text-slate-700">Correo<input className="h-10 rounded-md border border-slate-200 px-3 text-[12px] font-normal outline-none focus:border-[var(--theme-primary)]" placeholder="tu@correo.com" type="email" /></label>
          </div>
          <label className="mt-4 grid gap-1.5 text-[11px] font-semibold text-slate-700">Mensaje<textarea className="min-h-28 rounded-md border border-slate-200 px-3 py-2 text-[12px] font-normal outline-none focus:border-[var(--theme-primary)]" placeholder="¿En qué podemos ayudarte?" /></label>
          <button className="mt-4 rounded-md bg-[var(--theme-primary)] px-3 py-2 text-[11px] font-semibold text-white hover:bg-[var(--theme-primary-hover)]" type="button">Enviar mensaje</button>
        </PageCard>
        <PageCard>
          <h2 className="text-[13px] font-semibold text-slate-900">Canales de atención</h2>
          <div className="mt-4 space-y-3">
            {[['Soporte', 'soporte@webblueprint.dev', 'help'], ['Ventas', 'ventas@webblueprint.dev', 'apps'], ['Horario', 'Lun–Vie · 09:00–18:00', 'dashboard']].map(([label, value, icon]) => (
              <div key={label} className="flex items-center gap-3 rounded-md border border-slate-100 bg-slate-50/60 p-3"><div className="grid size-8 place-items-center rounded-md bg-[var(--theme-primary-soft)] text-[var(--theme-primary)]"><AppIcon className="size-4" name={icon as 'help'} /></div><div><p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-400">{label}</p><p className="mt-1 text-[11px] font-medium text-slate-700">{value}</p></div></div>
            ))}
          </div>
        </PageCard>
      </div>
    </PageShell>
  );
}

const faqs = [
  ['¿Qué es WebBlueprint?', 'Una base visual y navegable para construir vistas consistentes sobre un mismo shell y sistema de tema.'],
  ['¿Puedo reutilizar los componentes?', 'Sí. Las primitivas están diseñadas para mantenerse independientes de una pantalla concreta.'],
  ['¿Cómo solicito ayuda?', 'Usa la vista de Contacto o consulta primero la Base de conocimiento.'],
];

export function FaqPage() {
  return (
    <PageShell breadcrumbs={[{ label: 'Páginas' }, { label: 'FAQ' }]} description="Respuestas rápidas para las preguntas más frecuentes del equipo." title="Preguntas frecuentes">
      <PageCard className="max-w-4xl">
        <div className="space-y-2">
          {faqs.map(([question, answer]) => <details key={question} className="rounded-md border border-slate-100 bg-slate-50/60 p-4" open><summary className="cursor-pointer text-[12px] font-semibold text-slate-800">{question}</summary><p className="mt-2 max-w-2xl text-[11px] leading-5 text-slate-500">{answer}</p></details>)}
        </div>
      </PageCard>
    </PageShell>
  );
}

const articles = [
  ['Primeros pasos', 'Configura tu espacio y entiende la navegación principal.', '5 min'],
  ['Sistema visual', 'Usa tokens, estados y componentes sin romper el tema activo.', '8 min'],
  ['Accesibilidad', 'Revisa contraste, foco, etiquetas y navegación por teclado.', '6 min'],
];

export function KnowledgeBasePage() {
  return (
    <PageShell breadcrumbs={[{ label: 'Páginas' }, { label: 'Base de conocimiento' }]} description="Artículos prácticos para usar y extender el WebBlueprint." title="Base de conocimiento">
      <PageCard>
        <label className="relative block"><span className="sr-only">Buscar artículos</span><input className="h-11 w-full rounded-md border border-slate-200 bg-slate-50/60 px-4 text-[12px] outline-none focus:border-[var(--theme-primary)]" placeholder="Buscar en la base de conocimiento" /></label>
        <div className="mt-4 grid gap-2 md:grid-cols-3">{articles.map(([title, description, time]) => <Link key={title} className="rounded-md border border-slate-100 p-4 transition hover:border-[var(--theme-primary-border)] hover:bg-[var(--theme-primary-soft)]" to="/documentation/introduction"><p className="text-[12px] font-semibold text-slate-800">{title}</p><p className="mt-2 text-[11px] leading-4 text-slate-500">{description}</p><p className="mt-3 text-[10px] font-semibold text-[var(--theme-primary)]">{time} de lectura</p></Link>)}</div>
      </PageCard>
    </PageShell>
  );
}

export function MaintenancePage() {
  return (
    <PageShell breadcrumbs={[{ label: 'Páginas' }, { label: 'Mantenimiento' }]} description="Estado operativo del servicio y próximos pasos durante una ventana de mantenimiento." title="Mantenimiento">
      <div className="mx-auto max-w-2xl rounded-md border border-amber-200 bg-amber-50/70 p-6 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-amber-100 text-amber-700"><AppIcon className="size-6" name="settings" /></div>
        <h2 className="mt-4 text-lg font-semibold text-slate-900">Estamos realizando mejoras</h2>
        <p className="mx-auto mt-2 max-w-md text-[12px] leading-5 text-slate-600">El servicio volverá a estar disponible en breve. Tus datos permanecen protegidos durante la intervención.</p>
        <span className="mt-4 inline-flex rounded-full bg-amber-100 px-3 py-1 text-[10px] font-semibold text-amber-800">Actualización en progreso</span>
      </div>
    </PageShell>
  );
}

function StatusPage({ code, title, description }: { code: string; title: string; description: string }) {
  return (
    <PageShell breadcrumbs={[{ label: 'Páginas' }, { label: code }]} description={description} title={title}>
      <div className="mx-auto max-w-2xl rounded-md border border-slate-200 bg-white p-8 text-center">
        <p className="text-6xl font-semibold tracking-[-0.06em] text-[var(--theme-primary)]">{code}</p>
        <h2 className="mt-3 text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-[12px] leading-5 text-slate-500">{description}</p>
        <Link className="mt-5 inline-flex rounded-md bg-[var(--theme-primary)] px-3 py-2 text-[11px] font-semibold text-white hover:bg-[var(--theme-primary-hover)]" to="/dashboard">Volver al dashboard</Link>
      </div>
    </PageShell>
  );
}

export function NotFoundPage() {
  return <StatusPage code="404" description="La dirección solicitada no existe o ya no está disponible." title="Página no encontrada" />;
}

export function ServerErrorPage() {
  return <StatusPage code="500" description="Algo no salió como esperábamos. El equipo ya puede investigar este incidente." title="Error interno del servidor" />;
}

export function BlankPage() {
  return <PageShell breadcrumbs={[{ label: 'Páginas' }, { label: 'Blank Page' }]} description="Superficie vacía preparada para una composición específica." title="Blank Page"><PageCard className="min-h-64"><div className="grid min-h-52 place-items-center text-center"><div><div className="mx-auto grid size-10 place-items-center rounded-md bg-[var(--theme-primary-soft)] text-[var(--theme-primary)]"><AppIcon className="size-5" name="pages" /></div><p className="mt-3 text-[12px] font-semibold text-slate-700">Lienzo disponible</p><p className="mt-1 text-[11px] text-slate-500">Esta vista no impone contenido ni estructura adicional.</p></div></div></PageCard></PageShell>;
}

export function EmptyPage() {
  return <PageShell breadcrumbs={[{ label: 'Páginas' }, { label: 'Empty Page' }]} description="Estado vacío reutilizable para colecciones que todavía no tienen registros." title="Empty Page"><PageCard className="min-h-64"><div className="grid min-h-52 place-items-center text-center"><div><div className="mx-auto grid size-10 place-items-center rounded-md bg-slate-100 text-slate-500"><AppIcon className="size-5" name="layers" /></div><p className="mt-3 text-[12px] font-semibold text-slate-700">Todavía no hay elementos</p><p className="mt-1 text-[11px] text-slate-500">Cuando agregues contenido, aparecerá aquí.</p><button className="mt-4 rounded-md border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50" type="button">Crear primer elemento</button></div></div></PageCard></PageShell>;
}
