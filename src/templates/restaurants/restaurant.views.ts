export const restaurantPresetId = 'restaurants';
export const restaurantName = 'Sitios para restaurantes';

export const restaurantViews = [
  { id: 'home', path: '/restaurants/home', label: 'Inicio del restaurante', section: 'Sitio público', icon: 'apps' },
  { id: 'menu', path: '/restaurants/menu', label: 'Carta digital', section: 'Sitio público', icon: 'book' },
  { id: 'about', path: '/restaurants/about', label: 'Sobre el restaurante', section: 'Sitio público', icon: 'document' },
  { id: 'location', path: '/restaurants/location', label: 'Ubicación y contacto', section: 'Sitio público', icon: 'map' },
  { id: 'editor', path: '/restaurants/editor', label: 'Editor del restaurante', section: 'Administración', icon: 'settings' },
] as const;

export type RestaurantViewId = (typeof restaurantViews)[number]['id'];

export function findRestaurantView(path: string) {
  return restaurantViews.find((view) => view.path === path);
}
