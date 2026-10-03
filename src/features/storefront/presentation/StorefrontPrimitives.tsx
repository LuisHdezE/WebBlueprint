import type { ReactNode } from 'react';

interface StorefrontPageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
  trailing?: ReactNode;
}

export function StorefrontPageIntro({ eyebrow, title, description, trailing }: StorefrontPageIntroProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between" data-storefront-page-intro>
      <div className="max-w-3xl">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}

interface StorefrontSectionIntroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function StorefrontSectionIntro({ eyebrow, title, description }: StorefrontSectionIntroProps) {
  return (
    <div className="max-w-3xl" data-storefront-section-intro>
      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">{eyebrow}</p>
      <h2 className="mt-1.5 text-xl font-black tracking-[-0.025em] text-slate-950 sm:text-2xl">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

export const storefrontSurfaceClass = 'rounded-2xl border border-black/10 bg-white shadow-sm';
