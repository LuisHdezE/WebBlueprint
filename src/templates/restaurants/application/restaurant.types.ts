export type Dish = {
  name: string;
  category: string;
  description: string;
  price: number;
};

export type RestaurantContent = {
  dishes: Dish[];
  hours: string;
  holidayHours: string;
  special: string;
};

export type Restaurant = {
  id: string;
  name: string;
  tagline: string;
  story: string;
  image: string;
  imageAlt: string;
  style: 'rustic' | 'coastal';
  address: string;
  phone: string;
  service?: { label: string; url: string };
  content: RestaurantContent;
};

export function groupDishes(dishes: readonly Dish[]) {
  const groups = new Map<string, Dish[]>();
  for (const dish of dishes) {
    const group = groups.get(dish.category) ?? [];
    group.push(dish);
    groups.set(dish.category, group);
  }
  return [...groups];
}
