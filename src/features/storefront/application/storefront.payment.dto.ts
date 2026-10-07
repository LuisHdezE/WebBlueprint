import type { StorefrontMoneyDto } from './storefront.dto';

export type StorefrontPaymentMethodKind = 'card' | 'cash' | 'mercado-pago';

export interface StorefrontPaymentMethodDto {
  id: string;
  kind: StorefrontPaymentMethodKind;
  title: string;
  description: string;
  statusLabel: string;
  summaryLabel: string;
  enabled: boolean;
  fee: StorefrontMoneyDto;
}

export interface StorefrontPaymentViewDto {
  eyebrow: string;
  title: string;
  description: string;
  stateLabel: string;
  defaultMethodId: string;
  methods: readonly StorefrontPaymentMethodDto[];
  disabledNotice: {
    title: string;
    description: string;
  };
  notices: readonly {
    id: string;
    title: string;
    description: string;
  }[];
}
