import type { LeftMenuVariant } from '@/shell/shell.types';

export type DemoPageDefinition = {
  id: string;
  label: string;
  path: string;
  description: string;
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
