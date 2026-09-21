import type { LeftMenuVariant } from '@/shell/shell.types';

export type ComposerStep =
  | 'application'
  | 'branding'
  | 'preset'
  | 'features'
  | 'pages'
  | 'navigation'
  | 'review';

export type ComposerBranding = {
  logoUrl: string;
  accentColor: string;
};

export type ComposerConfiguration = {
  name: string;
  slug: string;
  description: string;
  branding: ComposerBranding;
  presetId: string | null;
  featureIds: string[];
  pageIds: string[];
  shellVariant: LeftMenuVariant;
};

export type ComposerFeatureOption = {
  id: string;
  label: string;
  sourceApplicationIds: readonly string[];
};

export type ComposerPageOption = {
  id: string;
  pageKey: string;
  label: string;
  path: string;
  iconKey: string;
  group: string;
  description: string;
  sourceApplicationId: string;
};

export type ComposerManifest = {
  schemaVersion: '0.2';
  application: {
    name: string;
    slug: string;
    description: string;
  };
  branding: {
    logoUrl: string | null;
    accentColor: string;
  };
  presetId: string | null;
  features: readonly {
    id: string;
    label: string;
  }[];
  pages: readonly {
    id: string;
    pageKey: string;
    label: string;
    path: string;
    iconKey: string;
    group: string;
    sourceApplicationId: string;
  }[];
  navigation: {
    shellVariant: LeftMenuVariant;
    items: readonly {
      pageId: string;
      pageKey: string;
      label: string;
      path: string;
      iconKey: string;
      group: string;
    }[];
  };
};
