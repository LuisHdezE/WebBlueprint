export type MetricCardTone = 'positive' | 'neutral' | 'warning';

export type MetricCardProps = {
  label: string;
  value: string;
  note?: string;
  tone?: MetricCardTone;
};

const noteClasses: Record<MetricCardTone, string> = {
  positive: 'text-emerald-600',
  neutral: 'text-slate-500',
  warning: 'text-amber-700',
};

export function MetricCard({ label, value, note, tone = 'neutral' }: MetricCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
      {note ? <p className={`mt-1 text-[11px] font-semibold ${noteClasses[tone]}`}>{note}</p> : null}
    </article>
  );
}
