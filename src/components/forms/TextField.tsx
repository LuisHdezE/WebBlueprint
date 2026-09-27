interface TextFieldProps {
  label: string;
  defaultValue?: string;
  placeholder?: string;
  type?: 'text' | 'email';
}

export function TextField({ label, defaultValue, placeholder, type = 'text' }: TextFieldProps) {
  return (
    <label className="grid gap-1.5 text-[11px] font-semibold text-slate-700">
      {label}
      <input className="h-10 rounded-md border border-slate-200 bg-white px-3 text-[12px] font-normal text-slate-800 outline-none transition focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-primary-soft)]" defaultValue={defaultValue} placeholder={placeholder} type={type} />
    </label>
  );
}
