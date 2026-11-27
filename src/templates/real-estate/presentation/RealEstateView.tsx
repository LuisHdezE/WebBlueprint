import { useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { filterProperties } from '../application/real-estate.types';
import type { Property, PropertyFilters } from '../application/real-estate.types';
import { useRealEstateSession } from './real-estate.context';
import type { RealEstateViewId } from '../real-estate.views';
import './real-estate.css';

const currency = new Intl.NumberFormat('es-UY', {
  style: 'currency', currency: 'USD', currencyDisplay: 'code', maximumFractionDigits: 0,
});

function priceLabel(property: Property) {
  const amount = currency.format(property.price);
  return property.operation === 'Alquiler' ? `${amount} / mes` : amount;
}

function Catalog() {
  const { properties, canOpen, openProperty } = useRealEstateSession();
  const [filters, setFilters] = useState<PropertyFilters>({ location: '', operation: '', kind: '' });
  const results = filterProperties(properties, filters);
  const showDetails = canOpen('property');

  return (
    <>
      <header className="estate-hero" style={{ '--estate-image': `url("${properties[0]?.image ?? ''}")` } as CSSProperties}>
        <h2>Encontrá tu próximo lugar</h2>
        <p>Casas, apartamentos y espacios comerciales para comprar o alquilar.</p>
      </header>
      <div className="estate-filters">
        <label>
          Ubicación
          <input onChange={(event) => setFilters({ ...filters, location: event.target.value })} placeholder="Buscar por zona" value={filters.location} />
        </label>
        <label>
          Operación
          <select onChange={(event) => setFilters({ ...filters, operation: event.target.value as PropertyFilters['operation'] })} value={filters.operation}>
            <option value="">Venta y alquiler</option><option>Venta</option><option>Alquiler</option>
          </select>
        </label>
        <label>
          Tipo de inmueble
          <select onChange={(event) => setFilters({ ...filters, kind: event.target.value as PropertyFilters['kind'] })} value={filters.kind}>
            <option value="">Todos los tipos</option><option>Casa</option><option>Apartamento</option><option>Comercial</option>
          </select>
        </label>
      </div>
      <p aria-live="polite">{results.length} {results.length === 1 ? 'inmueble' : 'inmuebles'}</p>
      <div className="estate-grid">
        {results.map((property) => (
          <article className="estate-card" key={property.id}>
            <img alt={property.imageAlt} src={property.image} />
            <div>
              <p>{property.operation} · {property.location}</p>
              <h3>{property.title}</h3>
              <strong>{priceLabel(property)}</strong>
              {showDetails ? (
                <button aria-label={`Ver ficha de ${property.title}`} onClick={() => openProperty(property.id)} type="button">Ver ficha</button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function PropertyDetail() {
  const { selected, inquiries, sendInquiry, canOpen, open } = useRealEstateSession();
  const inquirySent = inquiries.some((item) => item.propertyId === selected.id);

  return (
    <div className="estate-detail">
      <img alt={selected.imageAlt} src={selected.image} />
      <div className="estate-box">
        <p>{selected.operation} · {selected.location}</p>
        <h2>{selected.title}</h2>
        <strong>{priceLabel(selected)}</strong>
        <p>{selected.area} m²{selected.bedrooms ? ` · ${selected.bedrooms} dormitorios` : ''}</p>
        <p>{selected.description}</p>
        {inquirySent ? (
          <p className="estate-status" role="status">Consulta de prueba registrada.</p>
        ) : (
          <button onClick={sendInquiry} type="button">Enviar consulta de prueba</button>
        )}
        {inquirySent && canOpen('lister') ? (
          <button className="estate-secondary" onClick={() => open('lister')} type="button">Ver en panel del anunciante</button>
        ) : null}
      </div>
    </div>
  );
}

const demoAccounts = [
  { destination: 'catalog', label: 'Interesado' },
  { destination: 'lister', label: 'Anunciante' },
  { destination: 'admin', label: 'Administrador' },
] as const;

function DemoAccess() {
  const { canOpen, open } = useRealEstateSession();
  const accounts = demoAccounts.filter(({ destination }) => canOpen(destination));

  function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selected = new FormData(event.currentTarget).get('account');
    const account = accounts.find(({ destination }) => destination === selected);
    if (account) open(account.destination);
  }

  return (
    <div className="estate-box">
      <h2>Elegí una cuenta de demostración</h2>
      {accounts.length ? (
        <>
          <p>Los roles sirven para explorar el recorrido con datos ficticios.</p>
          <form onSubmit={signIn}>
            <div className="estate-filters">
              <label>
                Rol de demostración
                <select name="account" required defaultValue="">
                  <option value="" disabled>Elegí un rol</option>
                  {accounts.map(({ destination, label }) => (
                    <option key={destination} value={destination}>{label}</option>
                  ))}
                </select>
              </label>
            </div>
            <button type="submit">Iniciar sesión</button>
          </form>
        </>
      ) : <p>La selección del proyecto no incluye vistas de destino para las cuentas de demostración.</p>}
    </div>
  );
}

function InquiryPanel() {
  const { properties, inquiries, reviewInquiry } = useRealEstateSession();
  return (
    <div className="estate-box">
      <h2>Consultas recibidas</h2>
      <p>Alex Morgan · Cuenta de anunciante de demostración</p>
      {inquiries.length === 0 ? <p>Las consultas de prueba del catálogo aparecen aquí.</p> : (
        <ul className="estate-list">
          {inquiries.map((inquiry) => (
            <li key={inquiry.id}>
              <strong>{properties.find((property) => property.id === inquiry.propertyId)?.title}</strong>
              <span className="estate-status">{inquiry.reviewed ? 'Revisada' : 'Nueva'}</span>
              {inquiry.reviewed ? null : (
                <button onClick={() => reviewInquiry(inquiry.id)} type="button">Marcar revisada</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AdminPanel() {
  const { properties, inquiries } = useRealEstateSession();
  return (
    <div className="estate-box">
      <h2>Administración de inmuebles</h2>
      <p>Sam Rivera · Cuenta de administración de demostración</p>
      <p>{properties.length} inmuebles publicados · {inquiries.length} consultas de prueba</p>
      <ul className="estate-list">
        {properties.map((property) => (
          <li key={property.id}><strong>{property.title}</strong><span>{property.operation} · {property.location}</span></li>
        ))}
      </ul>
    </div>
  );
}

const surfaces = {
  catalog: Catalog,
  property: PropertyDetail,
  access: DemoAccess,
  lister: InquiryPanel,
  admin: AdminPanel,
} satisfies Record<RealEstateViewId, () => React.JSX.Element>;

export function RealEstateView({ view }: { view: RealEstateViewId }) {
  const Surface = surfaces[view];
  return <section className="real-estate-view"><Surface /></section>;
}
