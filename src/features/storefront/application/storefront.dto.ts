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

export interface StorefrontCategoryCardDto {
  id: string;
  title: string;
  description: string;
  href: string;
  eyebrow: string;
  itemCountLabel: string;
}

export interface StorefrontProductCardDto {
  id: string;
  title: string;
  subtitle: string;
  priceLabel: string;
  compareLabel?: string;
  badgeLabel: string;
  href: string;
  compatibilityLabel: string;
  stockLabel: string;
}

export interface StorefrontPromoBandDto {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}

export interface StorefrontFilterOptionDto {
  id: string;
  label: string;
  helper?: string;
}

export interface StorefrontProductListingViewDto {
  eyebrow: string;
  title: string;
  description: string;
  resultSummary: string;
  searchPlaceholder: string;
  sortOptions: readonly StorefrontFilterOptionDto[];
  filters: readonly {
    id: string;
    title: string;
    options: readonly StorefrontFilterOptionDto[];
  }[];
  products: readonly StorefrontProductCardDto[];
  emptyState: {
    title: string;
    description: string;
  };
  listingNotice: {
    title: string;
    description: string;
  };
}

export interface StorefrontProductDetailDto {
  slug: string;
  title: string;
  subtitle: string;
  badgeLabel: string;
  priceLabel: string;
  compareLabel?: string;
  stockLabel: string;
  compatibilityLabel: string;
  conditionLabel: string;
  warrantyLabel: string;
  heroLabel: string;
  description: string;
  highlights: readonly string[];
  specs: readonly {
    label: string;
    value: string;
  }[];
  gallery: readonly {
    id: string;
    label: string;
    tone: string;
  }[];
  notices: readonly {
    id: string;
    title: string;
    description: string;
  }[];
  relatedProductSlugs: readonly string[];
}

export interface StorefrontProductDetailViewDto {
  eyebrow: string;
  backLabel: string;
  backHref: string;
  actionNotice: {
    title: string;
    description: string;
  };
  products: readonly StorefrontProductDetailDto[];
  notFound: {
    title: string;
    description: string;
    actionLabel: string;
    actionHref: string;
  };
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
  categorySection: {
    eyebrow: string;
    title: string;
    description: string;
    categories: readonly StorefrontCategoryCardDto[];
  };
  productSection: {
    eyebrow: string;
    title: string;
    description: string;
    products: readonly StorefrontProductCardDto[];
  };
  promoBand: StorefrontPromoBandDto;
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
  productListing: StorefrontProductListingViewDto;
  productDetail: StorefrontProductDetailViewDto;
}
