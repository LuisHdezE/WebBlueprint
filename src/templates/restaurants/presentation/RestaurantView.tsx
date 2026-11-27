import { useState } from 'react';
import type { FormEvent } from 'react';
import { groupDishes } from '../application/restaurant.types';
import type { RestaurantContent } from '../application/restaurant.types';
import type { RestaurantViewId } from '../restaurant.views';
import { useRestaurantSession } from './restaurant.context';
import './restaurant.css';

const currency = new Intl.NumberFormat('es-UY', { style: 'currency', currency: 'USD', currencyDisplay: 'code' });

function Home() {
  const { active, canOpen, open } = useRestaurantSession();
  return (
    <>
      <div className="restaurant-hero">
        <div>
          <h2>{active.name}</h2>
          <p>{active.tagline}</p>
          {canOpen('menu') ? <button onClick={() => open('menu')} type="button">Ver la carta</button> : null}
        </div>
        <img alt={active.imageAlt} src={active.image} width="1150" height="767" />
      </div>
      {active.content.special ? <p className="restaurant-special"><strong>Especial de la casa</strong> {active.content.special}</p> : null}
    </>
  );
}

function Menu() {
  const { active } = useRestaurantSession();
  return (
    <div className="restaurant-content">
      <h2>Carta de {active.name}</h2>
      {groupDishes(active.content.dishes).map(([category, dishes]) => (
        <section className="restaurant-category" key={category}>
          <h3>{category}</h3>
          <ul>
            {dishes.map((dish, index) => (
              <li key={index}>
                <div><strong>{dish.name}</strong><p>{dish.description}</p></div>
                <span>{currency.format(dish.price)}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {active.content.special ? <p className="restaurant-special"><strong>Especial de la casa</strong> {active.content.special}</p> : null}
    </div>
  );
}

function About() {
  const { active } = useRestaurantSession();
  return (
    <div className="restaurant-content">
      <h2>La historia de {active.name}</h2>
      <p>{active.story}</p>
    </div>
  );
}

function Location() {
  const { active } = useRestaurantSession();
  const directions = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(active.address.split(' · ')[0] ?? active.address);
  return (
    <div className="restaurant-content">
      <h2>Visitá {active.name}</h2>
      <p>{active.address}</p>
      <dl>
        <dt>Horario habitual</dt><dd>{active.content.hours}</dd>
        {active.content.holidayHours ? <><dt>Horario de feriados</dt><dd>{active.content.holidayHours}</dd></> : null}
      </dl>
      <div className="restaurant-actions">
        <a href={`tel:${active.phone}`}>Llamar</a>
        <a href={directions} rel="noreferrer" target="_blank">Cómo llegar</a>
        {active.service ? <a href={active.service.url} rel="noreferrer" target="_blank">{active.service.label}</a> : null}
      </div>
    </div>
  );
}

function readField(data: FormData, name: string) {
  return String(data.get(name) ?? '').trim();
}

function RestaurantEditor() {
  const { active } = useRestaurantSession();
  return <EditorForm key={active.id} />;
}

function EditorForm() {
  const { active, saveContent } = useRestaurantSession();
  const [rows, setRows] = useState(active.content.dishes.length);
  const [status, setStatus] = useState('');

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const content: RestaurantContent = {
      dishes: Array.from({ length: rows }, (_, index) => ({
        name: readField(data, `name-${index}`),
        category: readField(data, `category-${index}`),
        description: readField(data, `description-${index}`),
        price: Number(readField(data, `price-${index}`)),
      })),
      hours: readField(data, 'hours'),
      holidayHours: readField(data, 'holidayHours'),
      special: readField(data, 'special'),
    };
    if (!content.hours || content.dishes.some((dish) => !dish.name || !dish.category || !Number.isFinite(dish.price) || dish.price < 0)) {
      setStatus('Revisá el horario, la categoría, el nombre y el precio de cada plato.');
      return;
    }
    saveContent(content);
    setStatus(`Cambios guardados para ${active.name} en esta sesión.`);
  }

  return (
    <form className="restaurant-content restaurant-editor" onChange={() => setStatus('')} onSubmit={save}>
      <h2>Editar {active.name}</h2>
      <p>Modo de demostración. Los cambios se reflejan en las vistas públicas durante la sesión.</p>
      <label>Horario habitual<input defaultValue={active.content.hours} name="hours" required /></label>
      <label>Horario de feriados<input defaultValue={active.content.holidayHours} name="holidayHours" /></label>
      <label>Especial de la casa<input defaultValue={active.content.special} name="special" /></label>
      {Array.from({ length: rows }, (_, index) => {
        const dish = active.content.dishes[index];
        return (
          <fieldset key={index}>
            <legend>{dish?.name ?? 'Nuevo plato'}</legend>
            <label>Categoría<input defaultValue={dish?.category} name={`category-${index}`} required /></label>
            <label>Plato<input defaultValue={dish?.name} name={`name-${index}`} required /></label>
            <label>Descripción<input defaultValue={dish?.description} name={`description-${index}`} /></label>
            <label>Precio USD<input defaultValue={dish?.price} min="0" name={`price-${index}`} required step="0.01" type="number" /></label>
          </fieldset>
        );
      })}
      <div className="restaurant-actions">
        <button onClick={() => setRows((count) => count + 1)} type="button">Agregar plato</button>
        <button type="submit">Guardar cambios</button>
      </div>
      <p aria-live="polite" role="status">{status}</p>
    </form>
  );
}

const surfaces = { home: Home, menu: Menu, about: About, location: Location, editor: RestaurantEditor } satisfies Record<RestaurantViewId, () => React.JSX.Element>;

export function RestaurantView({ view }: { view: RestaurantViewId }) {
  const { restaurants, active, selectRestaurant } = useRestaurantSession();
  const Surface = surfaces[view];
  return (
    <section className={`restaurant-view restaurant-${active.style}`}>
      <div className="restaurant-brand">
        <span>{active.name}</span>
        <label>
          Restaurante de prueba
          <select onChange={(event) => selectRestaurant(event.target.value)} value={active.id}>
            {restaurants.map((restaurant) => <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>)}
          </select>
        </label>
      </div>
      <Surface />
    </section>
  );
}
