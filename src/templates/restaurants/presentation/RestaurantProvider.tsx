import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Restaurant, RestaurantContent } from '../application/restaurant.types';
import { restaurantViews } from '../restaurant.views';
import type { RestaurantViewId } from '../restaurant.views';
import { RestaurantContext } from './restaurant.context';

type Props = {
  children: ReactNode;
  restaurants: readonly [Restaurant, ...Restaurant[]];
  viewPaths: readonly string[];
  onNavigate: (path: string) => void;
};

export function RestaurantProvider({ children, restaurants, viewPaths, onNavigate }: Props) {
  const [selectedId, selectRestaurant] = useState(restaurants[0].id);
  const [edits, setEdits] = useState<Record<string, RestaurantContent>>({});
  const selected = restaurants.find((restaurant) => restaurant.id === selectedId) ?? restaurants[0];
  const active = { ...selected, content: edits[selected.id] ?? selected.content };

  function availablePath(id: RestaurantViewId) {
    return restaurantViews.find((view) => view.id === id && viewPaths.includes(view.path))?.path;
  }

  function open(id: RestaurantViewId) {
    const path = availablePath(id);
    if (path) onNavigate(path);
  }

  function saveContent(content: RestaurantContent) {
    setEdits((previous) => ({ ...previous, [selected.id]: content }));
  }

  return (
    <RestaurantContext.Provider value={{ restaurants, active, selectRestaurant, saveContent, canOpen: (id) => Boolean(availablePath(id)), open }}>
      {children}
    </RestaurantContext.Provider>
  );
}
