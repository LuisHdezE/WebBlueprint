import { createContext, useContext } from 'react';
import type { Inquiry, Property } from '../application/real-estate.types';
import type { RealEstateViewId } from '../real-estate.views';

type RealEstateSession = {
  properties: readonly Property[];
  selected: Property;
  inquiries: readonly Inquiry[];
  canOpen: (view: RealEstateViewId) => boolean;
  open: (view: RealEstateViewId) => void;
  openProperty: (id: string) => void;
  sendInquiry: () => void;
  reviewInquiry: (id: number) => void;
};

export const RealEstateContext = createContext<RealEstateSession | null>(null);

export function useRealEstateSession() {
  const session = useContext(RealEstateContext);
  if (!session) throw new Error('La vista inmobiliaria necesita una sesión de demostración.');
  return session;
}
