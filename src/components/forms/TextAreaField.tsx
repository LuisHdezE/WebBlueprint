interface TextAreaFieldProps {
  label: string;
  placeholder?: string;
}

export function TextAreaField({ label, placeholder }: TextAreaFieldProps) {
  return (
    <label className="grid gap-1.5 text-[11px] font-semibold text-slate-700">
      {label}
      <textarea className="min-h-28 rounded-md border border-slate-200 px-3 py-2 text-[12px] font-normal text-slate-800 outline-none transition focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-primary-soft)]" placeholder={placeholder} />
    </label>
  );
}
