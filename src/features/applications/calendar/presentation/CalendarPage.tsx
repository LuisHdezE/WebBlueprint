import { useMemo, useState } from 'react';
import { SelectField } from '@/components/forms/SelectField';
import { SurfaceCard } from '@/components/layout/SurfaceCard';
import { PageShell } from '@/shell/PageShell';
import type { CalendarContentProvider } from '../application/calendar.contracts';
import type { CalendarEventDto, CalendarEventTone } from '../application/calendar.dto';

const toneClass: Record<CalendarEventTone,string> = {
  primary:'border-[var(--theme-primary-border)] bg-[var(--theme-primary-soft)] text-[var(--theme-primary)]',
  success:'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning:'border-amber-200 bg-amber-50 text-amber-700',
  neutral:'border-slate-200 bg-slate-50 text-slate-600',
};

function CalendarEvent({ event }: { event: CalendarEventDto }) {
  return <article className={`rounded-md border px-2 py-1.5 ${toneClass[event.tone]}`} data-calendar-event={event.id}><p className="truncate text-[10px] font-semibold">{event.title}</p><p className="mt-0.5 text-[9px] opacity-75">{event.time} · {event.category}</p></article>;
}

export function CalendarPage({ contentProvider }: { contentProvider: CalendarContentProvider }) {
  const view=contentProvider.getView();
  const categories=useMemo(()=>[view.allCategoriesLabel,...new Set(view.events.map(event=>event.category))],[view]);
  const [category,setCategory]=useState(view.allCategoriesLabel);
  const events=useMemo(()=>view.events.filter(event=>category===view.allCategoriesLabel||event.category===category),[category,view]);
  const eventsByDate=useMemo(()=>new Map(view.days.map(day=>[day.date,events.filter(event=>event.date===day.date)])),[events,view.days]);

  return <PageShell breadcrumbs={view.breadcrumbs.map(label=>({label}))} description={view.description} title={view.title}>
    <SurfaceCard className="p-0 overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">{view.todayLabel}</p><h2 className="mt-1 text-lg font-semibold text-slate-900">{view.monthLabel}</h2></div>
        <div className="w-full sm:w-52"><SelectField id="calendar-category" label={view.categoryLabel} value={category} options={categories.map(value=>({value,label:value}))} onChange={setCategory}/></div>
      </div>
      <div className="hidden grid-cols-7 border-b border-slate-200 bg-slate-50 md:grid">{view.weekdays.map(day=><div className="px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500" key={day}>{day}</div>)}</div>
      <div className="hidden grid-cols-7 md:grid" data-calendar-grid>{view.days.map(day=><div className={`min-h-28 border-b border-r border-slate-100 p-2 last:border-r-0 ${day.inCurrentMonth?'bg-white':'bg-slate-50/70'}`} data-calendar-day={day.date} key={day.date}><div className={`grid size-6 place-items-center rounded-full text-[10px] font-semibold ${day.isToday?'bg-[var(--theme-primary)] text-white':day.inCurrentMonth?'text-slate-700':'text-slate-300'}`}>{day.dayNumber}</div><div className="mt-2 space-y-1">{eventsByDate.get(day.date)?.map(event=><CalendarEvent event={event} key={event.id}/>)}</div></div>)}</div>
      <div className="divide-y divide-slate-100 md:hidden" data-calendar-mobile>{view.days.filter(day=>day.inCurrentMonth&&(eventsByDate.get(day.date)?.length||day.isToday)).map(day=><section className="grid grid-cols-[3rem_1fr] gap-3 p-4" data-calendar-day={day.date} key={day.date}><div><p className={`grid size-9 place-items-center rounded-full text-xs font-semibold ${day.isToday?'bg-[var(--theme-primary)] text-white':'bg-slate-100 text-slate-700'}`}>{day.dayNumber}</p></div><div className="space-y-2">{eventsByDate.get(day.date)?.map(event=><CalendarEvent event={event} key={event.id}/>)}</div></section>)}</div>
    </SurfaceCard>
  </PageShell>;
}
