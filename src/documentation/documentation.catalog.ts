import { leftMenuVariants } from '@/shell/shell.types';

export type DocumentationProp = {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description: string;
};

export type ComponentDocumentationEntry = {
  id: string;
  name: string;
  category: 'Application display' | 'Shell';
  maturity: 'stable';
  sourcePath: string;
  summary: string;
  props: readonly DocumentationProp[];
  variants: readonly string[];
  states: readonly string[];
  example: string;
};

export const componentDocumentation: readonly ComponentDocumentationEntry[] = [
  {
    id: 'application-card',
    name: 'ApplicationCard',
    category: 'Application display',
    maturity: 'stable',
    sourcePath: 'src/components/applications/ApplicationCard.tsx',
    summary: 'Public catalog card composed from the application registry and the shared application preview.',
    props: [
      {
        name: 'application',
        type: 'ApplicationDefinition',
        required: true,
        description: 'Registered application used for copy, capabilities, links and the embedded preview.',
      },
    ],
    variants: ['default'],
    states: ['default', 'hover'],
    example: '<ApplicationCard application={application} />',
  },
  {
    id: 'application-preview',
    name: 'ApplicationPreview',
    category: 'Application display',
    maturity: 'stable',
    sourcePath: 'src/components/applications/ApplicationPreview.tsx',
    summary: 'Responsive visual preview that reflects application pages and the configured light or dark shell.',
    props: [
      {
        name: 'application',
        type: 'ApplicationDefinition',
        required: true,
        description: 'Registered application supplying pages, shell variant and display identity.',
      },
      {
        name: 'compact',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Reduces the preview height and number of visible navigation items for card contexts.',
      },
    ],
    variants: ['default', 'compact'],
    states: ['light shell', 'dark shell'],
    example: '<ApplicationPreview application={application} compact />',
  },
  {
    id: 'left-app-shell',
    name: 'LeftAppShell',
    category: 'Shell',
    maturity: 'stable',
    sourcePath: 'src/shell/LeftAppShell.tsx',
    summary: 'Shared mobile-first application shell with governed left navigation, optional collapse and mobile drawer behavior.',
    props: [
      { name: 'brandName', type: 'string', required: true, description: 'Primary product name displayed in the navigation shell.' },
      { name: 'brandSubtitle', type: 'string', required: false, description: 'Optional secondary brand context.' },
      { name: 'brandInitials', type: 'string', required: true, description: 'Compact brand mark used when space is constrained.' },
      { name: 'navItems', type: 'readonly LeftAppShellNavItem[]', required: true, description: 'Navigation model rendered consistently on desktop and mobile.' },
      { name: 'title', type: 'string', required: true, description: 'Topbar title for the current application surface.' },
      { name: 'subtitle', type: 'string', required: false, description: 'Optional supporting topbar text.' },
      { name: 'variant', type: 'LeftMenuVariant', required: false, defaultValue: 'collapsible-menu', description: 'Governed shell presentation variant.' },
      { name: 'footer', type: 'ReactNode', required: false, description: 'Optional sidebar footer content.' },
      { name: 'topbarActions', type: 'ReactNode', required: false, description: 'Optional topbar action content.' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Application content rendered in the shell workspace.' },
    ],
    variants: leftMenuVariants,
    states: ['expanded desktop', 'collapsed desktop', 'mobile drawer open', 'mobile drawer closed'],
    example: '<LeftAppShell brandName="Acme" brandInitials="AC" navItems={items} title="Dashboard">…</LeftAppShell>',
  },
  {
    id: 'workspace-shell',
    name: 'WorkspaceShell',
    category: 'Shell',
    maturity: 'stable',
    sourcePath: 'src/shell/WorkspaceShell.tsx',
    summary: 'Authenticated Composer shell built on LeftAppShell with WebBlueprint navigation and session actions.',
    props: [
      { name: 'title', type: 'string', required: true, description: 'Workspace topbar title.' },
      { name: 'subtitle', type: 'string', required: false, description: 'Optional workspace context.' },
      { name: 'userName', type: 'string', required: false, description: 'Authenticated user label shown in the footer.' },
      { name: 'onSignOut', type: '() => void', required: true, description: 'Session sign-out action.' },
      { name: 'variant', type: 'LeftMenuVariant', required: false, defaultValue: 'collapsible-menu', description: 'Delegated governed left-menu variant.' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Composer workspace content.' },
    ],
    variants: leftMenuVariants,
    states: ['authenticated workspace', 'mobile drawer', 'collapsed navigation'],
    example: '<WorkspaceShell title="App Composer" onSignOut={signOut}>…</WorkspaceShell>',
  },
  {
    id: 'public-shell',
    name: 'PublicShell',
    category: 'Shell',
    maturity: 'stable',
    sourcePath: 'src/shell/PublicShell.tsx',
    summary: 'Public website frame with primary navigation, responsive mobile menu, authentication entry points and footer.',
    props: [],
    variants: ['desktop navigation', 'mobile details menu'],
    states: ['active route', 'mobile menu open', 'mobile menu closed'],
    example: '<Route element={<PublicShell />}>…</Route>',
  },
];

export const livingDocumentationPrinciples = [
  'Document reusable code when it enters the product.',
  'Keep examples connected to real registry data and governed variants.',
  'Describe current contracts before speculative future APIs.',
  'Reconcile documentation at stage closure with the implementation that actually shipped.',
] as const;
