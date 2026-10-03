import { Link, useParams } from 'react-router';
import type { StorefrontProvider } from '../application/storefront.contracts';

function galleryClassName(tone: string) {
  if (tone === 'dark') return 'bg-slate-950 text-white';
  if (tone === 'warm') return 'bg-[#f7f2ea] text-slate-950';
  return 'bg-white text-slate-950';
}

export function StorefrontProductDetailPage({ provider }: { provider: StorefrontProvider }) {
  const { slug = '' } = useParams();
  const detail = provider.getProductDetailView();
  const product = provider.getProductDetailBySlug(slug);

  if (!product) {
    return (
      <main className="mx-auto grid max-w-[960px] gap-6 px-4 py-10 sm:px-5 lg:px-6" data-storefront-product-detail-not-found>
        <Link className="text-sm font-black text-slate-600 hover:text-slate-950" to={detail.notFound.actionHref}>← {detail.notFound.actionLabel}</Link>
        <section className="rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.1em] text-slate-500">{detail.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-slate-950">{detail.notFound.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{detail.notFound.description}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-[1440px] gap-8 px-4 py-8 sm:px-5 lg:px-6 lg:py-12" data-storefront-product-detail>
      <Link className="text-sm font-black text-slate-600 hover:text-slate-950" to={detail.backHref}>← {detail.backLabel}</Link>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_28rem]">
        <div className="grid gap-4">
          <div className="grid min-h-[28rem] place-items-center rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm">
            <div className="grid aspect-square w-full max-w-[30rem] place-items-center rounded-[2rem] bg-[#f7f2ea] p-8 text-center">
              <p className="text-sm font-black uppercase tracking-[0.1em] text-slate-500">{product.heroLabel}</p>
              <p className="mt-4 text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-5xl">{product.badgeLabel}</p>
              <p className="mt-3 max-w-xs text-sm leading-6 text-slate-600">Imagen demo preparada para galería comercial futura</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3" aria-label="Galería demo del producto">
            {product.gallery.map((item) => (
              <div key={item.id} className={`rounded-3xl border border-black/10 p-4 text-sm font-black shadow-sm ${galleryClassName(item.tone)}`}>
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm lg:sticky lg:top-32 lg:self-start" data-storefront-product-buy-box>
          <p className="text-sm font-black uppercase tracking-[0.1em] text-slate-500">{detail.eyebrow}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">{product.badgeLabel}</span>
            <span className="rounded-full bg-[#f7f2ea] px-3 py-1 text-xs font-black text-slate-700">{product.stockLabel}</span>
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-slate-950">{product.title}</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">{product.subtitle}</p>

          <div className="mt-6 rounded-3xl bg-[#f7f2ea] p-5">
            <p className="text-4xl font-black tracking-[-0.04em] text-slate-950">{product.priceLabel}</p>
            {product.compareLabel ? <p className="mt-2 text-sm font-black text-slate-600">{product.compareLabel}</p> : null}
          </div>

          <div className="mt-5 grid gap-3 text-sm font-bold text-slate-700">
            <p>{product.compatibilityLabel}</p>
            <p>{product.conditionLabel}</p>
            <p>{product.warrantyLabel}</p>
          </div>

          <div className="mt-6 grid gap-3" data-storefront-product-actions>
            <Link className="rounded-full bg-slate-950 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-slate-800" to="/store/contact">
              Consultar disponibilidad
            </Link>
            <button className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black text-slate-400" disabled type="button">
              Carrito pendiente
            </button>
          </div>

          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-4" data-storefront-product-action-notice>
            <p className="text-sm font-black text-amber-950">{detail.actionNotice.title}</p>
            <p className="mt-1 text-sm leading-6 text-amber-900">{detail.actionNotice.description}</p>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <article className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-950">Descripción comercial</h2>
          <p className="mt-4 text-base leading-8 text-slate-600">{product.description}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {product.highlights.map((highlight) => (
              <div key={highlight} className="rounded-3xl bg-[#f7f2ea] p-4 text-sm font-bold leading-6 text-slate-700">
                {highlight}
              </div>
            ))}
          </div>
        </article>

        <aside className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Ficha técnica demo</h2>
          <dl className="mt-5 grid gap-3">
            {product.specs.map((spec) => (
              <div key={spec.label} className="flex items-start justify-between gap-4 rounded-2xl bg-[#f7f2ea] p-3">
                <dt className="text-sm font-bold text-slate-500">{spec.label}</dt>
                <dd className="text-right text-sm font-black text-slate-950">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </section>

      <section className="grid gap-4 md:grid-cols-2" aria-label="Avisos del producto">
        {product.notices.map((notice) => (
          <article key={notice.id} className="rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-lg font-black text-slate-950">{notice.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{notice.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
