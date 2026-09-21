type FoundationPageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function FoundationPage({ eyebrow, title, description }: FoundationPageProps) {
  return (
    <main className="min-h-dvh bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100dvh-5rem)] max-w-5xl items-center">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{description}</p>
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
            Placeholder de fundación. La interfaz funcional se incorpora de forma incremental mediante componentes y funciones gobernadas.
          </div>
        </div>
      </section>
    </main>
  );
}
