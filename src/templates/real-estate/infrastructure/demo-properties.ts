import type { Property } from '../application/real-estate.types';
import { listingImages } from './listing-images';

export const demoProperties = [
  {
    id: 'cedar-house',
    title: 'Casa Los Cedros',
    location: 'Puerto Norte',
    operation: 'Venta',
    kind: 'Casa',
    price: 485000,
    bedrooms: 4,
    area: 220,
    description: 'Casa contemporánea con cuatro dormitorios, jardín y espacios amplios para disfrutar todo el año.',
    image: listingImages.house,
    imageAlt: 'Casa contemporánea rodeada de vegetación',
  },
  {
    id: 'park-apartment',
    title: 'Apartamento Vista al Parque',
    location: 'Ribera',
    operation: 'Alquiler',
    kind: 'Apartamento',
    price: 1950,
    bedrooms: 2,
    area: 96,
    description: 'Apartamento de dos dormitorios con balcón privado, living luminoso y estacionamiento.',
    image: listingImages.apartment,
    imageAlt: 'Living luminoso con ventanales y vista sobre la ciudad',
  },
  {
    id: 'market-studio',
    title: 'Oficinas Mercado Central',
    location: 'Centro',
    operation: 'Alquiler',
    kind: 'Comercial',
    price: 3200,
    bedrooms: 0,
    area: 144,
    description: 'Espacio de trabajo flexible con salas de reuniones y acceso al transporte del centro.',
    image: listingImages.office,
    imageAlt: 'Oficina moderna con espacio de trabajo abierto',
  },
] as const satisfies readonly [Property, ...Property[]];
