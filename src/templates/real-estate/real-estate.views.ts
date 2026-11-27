export const realEstatePresetId = 'real-estate';
export const realEstateName = 'Marketplace inmobiliario';

export const realEstateViews = [
  { id: 'catalog', path: '/real-estate/catalog', label: 'Catálogo de inmuebles', section: 'Sitio público', icon: 'apps' },
  { id: 'property', path: '/real-estate/property', label: 'Ficha de inmueble', section: 'Sitio público', icon: 'document' },
  { id: 'access', path: '/real-estate/access', label: 'Acceso de demostración', section: 'Acceso', icon: 'lock' },
  { id: 'lister', path: '/real-estate/lister', label: 'Panel del anunciante', section: 'Paneles', icon: 'dashboard' },
  { id: 'admin', path: '/real-estate/admin', label: 'Administración', section: 'Paneles', icon: 'settings' },
] as const;

export type RealEstateViewId = (typeof realEstateViews)[number]['id'];

export function findRealEstateView(path: string) {
  return realEstateViews.find((view) => view.path === path);
}

export const realEstateSignInPath = '/authentication/sign-in';

export function hasRealEstateViews(paths: readonly string[]) {
  return realEstateViews.some((view) => paths.includes(view.path));
}
