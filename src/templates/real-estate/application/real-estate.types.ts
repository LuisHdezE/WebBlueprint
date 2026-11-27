export type Property = {
  id: string;
  title: string;
  location: string;
  operation: 'Venta' | 'Alquiler';
  kind: 'Casa' | 'Apartamento' | 'Comercial';
  price: number;
  bedrooms: number;
  area: number;
  description: string;
  image: string;
  imageAlt: string;
};

export type Inquiry = { id: number; propertyId: string; reviewed: boolean };
export type PropertyFilters = {
  location: string;
  operation: '' | Property['operation'];
  kind: '' | Property['kind'];
};

export function filterProperties(properties: readonly Property[], filters: PropertyFilters) {
  const location = filters.location.trim().toLocaleLowerCase('es');
  return properties.filter((property) => (
    property.location.toLocaleLowerCase('es').includes(location) &&
    (!filters.operation || property.operation === filters.operation) &&
    (!filters.kind || property.kind === filters.kind)
  ));
}
