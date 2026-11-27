import { Outlet, useNavigate } from 'react-router';
import { demoRestaurants } from '../infrastructure/demo-restaurants';
import { restaurantViews } from '../restaurant.views';
import { RestaurantProvider } from './RestaurantProvider';

const viewPaths = restaurantViews.map(({ path }) => path);

export function RestaurantRoute() {
  return (
    <RestaurantProvider restaurants={demoRestaurants} viewPaths={viewPaths} onNavigate={useNavigate()}>
      <Outlet />
    </RestaurantProvider>
  );
}
