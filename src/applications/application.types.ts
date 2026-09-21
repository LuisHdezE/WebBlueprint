import type { PageKey } from '@/applications/pageRegistry';
import type { LeftMenuVariant } from '@/shell/shell.types';

export type DemoPageDefinition = {
  id: string;
  pageKey: PageKey;
  label: string;
  path: string;
  description: string;
  iconKey: string;
  group: string;
};

export type ApplicationDefinition = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  category: string;
  promoted: boolean;
  shellVariant: LeftMenuVariant;
  capabilities: readonly string[];
  demoPages: readonly DemoPageDefinition[];
};
