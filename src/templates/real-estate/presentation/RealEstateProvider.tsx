import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Inquiry, Property } from '../application/real-estate.types';
import { RealEstateContext } from './real-estate.context';
import { realEstateViews } from '../real-estate.views';
import type { RealEstateViewId } from '../real-estate.views';

type Props = {
  children: ReactNode;
  properties: readonly [Property, ...Property[]];
  viewPaths: readonly string[];
  onNavigate: (path: string) => void;
};

export function RealEstateProvider({ children, properties, viewPaths, onNavigate }: Props) {
  const [selectedId, setSelectedId] = useState(properties[0].id);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const selected = properties.find((property) => property.id === selectedId) ?? properties[0];

  function canOpen(id: RealEstateViewId) {
    return realEstateViews.some((view) => view.id === id && viewPaths.includes(view.path));
  }

  function open(id: RealEstateViewId) {
    const view = realEstateViews.find((candidate) => candidate.id === id);
    if (view && viewPaths.includes(view.path)) onNavigate(view.path);
  }

  function openProperty(id: string) {
    setSelectedId(id);
    open('property');
  }

  function sendInquiry() {
    setInquiries((current) => (
      current.some((item) => item.propertyId === selected.id)
        ? current
        : [...current, { id: current.length + 1, propertyId: selected.id, reviewed: false }]
    ));
  }

  function reviewInquiry(id: number) {
    setInquiries((current) => current.map((item) => item.id === id ? { ...item, reviewed: true } : item));
  }

  return (
    <RealEstateContext.Provider value={{ properties, selected, inquiries, canOpen, open, openProperty, sendInquiry, reviewInquiry }}>
      {children}
    </RealEstateContext.Provider>
  );
}
