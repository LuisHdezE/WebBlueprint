import type { AppIconName } from '@/components/AppIcon';
import type { ThemeColorId } from '@/theme/themeContext';

export type BlueprintProjectManifest = {
  schemaVersion: '1.0';
  application: {
    name: string;
    logoDataUrl: string | null;
    faviconDataUrl: string | null;
  };
  presetId: string | null;
  theme: {
    colorId: ThemeColorId;
  };
  views: readonly string[];
};

export type ProjectViewDefinition = {
  id: string;
  path: string;
  label: string;
  section: string;
  icon: AppIconName;
  category: string | null;
  childLabel: string;
};

export type ProjectPresetDefinition = {
  id: string;
  name: string;
  description: string;
  viewPaths: readonly string[];
};
