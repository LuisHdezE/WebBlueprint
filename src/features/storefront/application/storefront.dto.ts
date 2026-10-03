export interface StorefrontNavItemDto {
  id: string;
  label: string;
  href: string;
}

export interface StorefrontThemeDto {
  primary: string;
  primaryStrong: string;
  primarySoft: string;
  onPrimary: string;
}

export interface StorefrontMediaDto {
  src: string;
  alt: string;
  objectPosition?: string;
}

export interface StorefrontHeroBannerDto {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  image: StorefrontMediaDto;
}

export interface StorefrontFloatingActionDto {
  id: string;
  label: string;
  ariaLabel: string;
  href: string;
  icon: 'whatsapp';
  backgroundColor: string;
  foregroundColor: string;
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
  theme: StorefrontThemeDto;
  floatingAction: StorefrontFloatingActionDto;
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

export interface StorefrontCartLineDto {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  badgeLabel: string;
  quantityLabel: string;
  unitPriceLabel: string;
  lineTotalLabel: string;
  stockLabel: string;
  compatibilityLabel: string;
}

export interface StorefrontCartSummaryItemDto {
  id: string;
  label: string;
  value: string;
  tone?: 'default' | 'muted' | 'strong';
}

export interface StorefrontCartViewDto {
  eyebrow: string;
  title: string;
  description: string;
  cartStateLabel: string;
  emptyState: {
    title: string;
    description: string;
    actionLabel: string;
    actionHref: string;
  };
  lines: readonly StorefrontCartLineDto[];
  summary: {
    title: string;
    items: readonly StorefrontCartSummaryItemDto[];
    totalLabel: string;
    totalValue: string;
    checkoutLabel: string;
    checkoutDisabledLabel: string;
    checkoutPreviewLabel: string;
    checkoutPreviewHref: string;
  };
  notices: readonly {
    id: string;
    title: string;
    description: string;
  }[];
}

export interface StorefrontCheckoutViewDto {
  eyebrow: string;
  title: string;
  description: string;
  stateLabel: string;
  authGate: {
    eyebrow: string;
    title: string;
    description: string;
    requiredLabel: string;
    signInLabel: string;
    signInHref: string;
    signUpLabel: string;
    signUpHref: string;
  };
  orderSummary: {
    title: string;
    lines: readonly {
      id: string;
      label: string;
      value: string;
    }[];
    totalLabel: string;
    totalValue: string;
  };
  shipping: {
    title: string;
    description: string;
    statusLabel: string;
    fields: readonly {
      id: string;
      label: string;
      value: string;
      helper: string;
    }[];
  };
  payment: {
    title: string;
    description: string;
    options: readonly {
      id: string;
      title: string;
      description: string;
      statusLabel: string;
    }[];
  };
  notices: readonly {
    id: string;
    title: string;
    description: string;
  }[];
}

export interface StorefrontCustomerIdentityFieldDto {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'tel';
  placeholder: string;
  helper: string;
}

export interface StorefrontCustomerIdentityPanelDto {
  title: string;
  description: string;
  alternateLabel: string;
  alternateHref: string;
  submitLabel: string;
  fields: readonly StorefrontCustomerIdentityFieldDto[];
}

export interface StorefrontCustomerIdentityViewDto {
  eyebrow: string;
  description: string;
  returnToCheckoutLabel: string;
  returnToCheckoutHref: string;
  signIn: StorefrontCustomerIdentityPanelDto;
  register: StorefrontCustomerIdentityPanelDto;
  notices: readonly {
    id: string;
    title: string;
    description: string;
  }[];
}

export interface StorefrontHomeViewDto {
  eyebrow: string;
  title: string;
  description: string;
  primarySearchPlaceholder: string;
  heroBanners: readonly StorefrontHeroBannerDto[];
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
  cart: StorefrontCartViewDto;
  checkout: StorefrontCheckoutViewDto;
  customerIdentity: StorefrontCustomerIdentityViewDto;
}
