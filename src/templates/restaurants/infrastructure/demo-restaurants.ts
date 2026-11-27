import type { Restaurant } from '../application/restaurant.types';
import { restaurantImages } from './restaurant-images';

export const demoRestaurants: readonly [Restaurant, ...Restaurant[]] = [
  {
    id: 'forno',
    name: 'Forno de Barrio',
    tagline: 'Pizza al horno y sobremesas largas',
    story: 'Un comedor de barrio dedicado a la masa de fermentación lenta. Preparamos cada pizza al momento y trabajamos con ingredientes de temporada.',
    image: restaurantImages.pizza,
    imageAlt: 'Pizza artesanal de masa dorada con vegetales',
    style: 'rustic',
    address: '120 Example Avenue, Montevideo · Dirección de demostración',
    phone: '+12025550141',
    content: {
      hours: 'Martes a domingo, 18:00–23:00',
      holidayHours: 'Domingo festivo, 18:00–22:00',
      special: 'Pizza de hongos de temporada',
      dishes: [
        { name: 'Margherita', category: 'Pizzas', description: 'Tomate, mozzarella fresca y albahaca.', price: 14 },
        { name: 'Funghi', category: 'Pizzas', description: 'Hongos, provolone y tomillo.', price: 16 },
        { name: 'Tiramisú', category: 'Postres', description: 'Mascarpone, café y cacao amargo.', price: 8 },
      ],
    },
  },
  {
    id: 'marea',
    name: 'Marea Clara',
    tagline: 'Cocina costera y pesca de temporada',
    story: 'Una mesa inspirada en la costa. La carta cambia con el producto de estación y combina la pesca del día con verduras asadas y cítricos.',
    image: restaurantImages.seafood,
    imageAlt: 'Plato de pescado con verduras frescas',
    style: 'coastal',
    address: '47 Example Bay Road, Montevideo · Dirección de demostración',
    phone: '+12025550146',
    content: {
      hours: 'Miércoles a domingo, 12:00–22:00',
      holidayHours: 'Lunes festivo, 12:00–16:00',
      special: 'Pescado a la plancha con vegetales',
      dishes: [
        { name: 'Pesca del día', category: 'Principales', description: 'Pescado a la plancha, verduras y limón.', price: 24 },
        { name: 'Arroz de mar', category: 'Principales', description: 'Arroz cremoso, mejillones y hierbas.', price: 22 },
        { name: 'Ensalada cítrica', category: 'Entradas', description: 'Hojas verdes, cítricos y semillas.', price: 10 },
      ],
    },
  },
];
