import { createContext, useContext } from 'react';
import type { Restaurant, RestaurantContent } from '../application/restaurant.types';
import type { RestaurantViewId } from '../restaurant.views';

type Session = {
  restaurants: readonly Restaurant[];
  active: Restaurant;
  selectRestaurant: (id: string) => void;
  saveContent: (content: RestaurantContent) => void;
  canOpen: (id: RestaurantViewId) => boolean;
  open: (id: RestaurantViewId) => void;
};

export const RestaurantContext = createContext<Session | null>(null);

export function useRestaurantSession() {
  const session = useContext(RestaurantContext);
  if (!session) throw new Error('La vista de restaurante necesita una sesión de demostración.');
  return session;
}
