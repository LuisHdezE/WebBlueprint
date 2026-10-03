export interface StorefrontNavItemDto {
  id: string;
  label: string;
  href: string;
}

export interface StorefrontMetricDto {
  id: string;
  label: string;
  value: string;
}

export interface StorefrontHeroCtaDto {
  label: string;
  href: string;
  variant: 'primary' | 'secondary';
}

export interface StorefrontHomeViewDto {
  eyebrow: string;
  title: string;
  description: string;
  primarySearchPlaceholder: string;
  ctas: readonly StorefrontHeroCtaDto[];
  trustMetrics: readonly StorefrontMetricDto[];
  featureTiles: readonly {
    id: string;
    title: string;
    description: string;
  }[];
}

export interface StorefrontShellViewDto {
  storeName: string;
  storeTagline: string;
  announcement: string;
  logoText: string;
  searchPlaceholder: string;
  primaryNav: readonly StorefrontNavItemDto[];
  categoryNav: readonly StorefrontNavItemDto[];
  utilityNav: readonly StorefrontNavItemDto[];
  footerColumns: readonly {
    id: string;
    title: string;
    links: readonly StorefrontNavItemDto[];
  }[];
  support: {
    whatsappLabel: string;
    whatsappHref: string;
    serviceArea: string;
  };
}

export interface StorefrontViewDto {
  shell: StorefrontShellViewDto;
  home: StorefrontHomeViewDto;
}
