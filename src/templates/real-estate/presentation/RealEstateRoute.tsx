import { Outlet, useNavigate } from 'react-router';
import { demoProperties } from '../infrastructure/demo-properties';
import { RealEstateProvider } from './RealEstateProvider';
import { realEstateViews } from '../real-estate.views';

const viewPaths = realEstateViews.map((view) => view.path);

export function RealEstateRoute() {
  const navigate = useNavigate();
  return (
    <RealEstateProvider properties={demoProperties} viewPaths={viewPaths} onNavigate={navigate}>
      <Outlet />
    </RealEstateProvider>
  );
}
