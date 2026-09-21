export const leftMenuVariants = [
  'collapsible-menu',
  'vertical-dark-menu',
  'vertical-light-menu',
] as const;

export type LeftMenuVariant = (typeof leftMenuVariants)[number];
