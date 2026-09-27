import { useCallback, useState } from 'react';
import { AppIcon } from '@/components/AppIcon';
import { PageShell } from '@/shell/PageShell';
import { LeafletMap, type MapLocation } from '../leaflet/LeafletMap';

const locations: readonly MapLocation[] = [
  { id: 'centro', name: 'Centro', description: 'Punto operativo · 18 registros', coordinates: [-34.9011, -56.1645], tone: 'primary' },
  { id: 'pocitos', name: 'Pocitos', description: 'Punto operativo · 11 registros', coordinates: [-34.9135, -56.1534], tone: 'warning' },
  { id: 'carrasco', name: 'Carrasco', description: 'Punto operativo · 7 registros', coordinates: [-34.885, -56.073], tone: 'neutral' },
];

export function MapViewPage() {
  const [selectedLocationId, setSelectedLocationId] = useState(locations[0]!.id);
  const selectLocation = useCallback((locationId: string) => setSelectedLocationId(locationId), []);
  const selected = locations.find((location) => location.id === selectedLocationId) ?? locations[0]!;

  return (
    <PageShell
      breadcrumbs={[{ label: 'Visualización' }, { label: 'Maps' }]}
      description="Explora ubicaciones y puntos operativos sobre una superficie cartográfica interactiva basada en Leaflet."
      title="Map View"
    >
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.55fr)_minmax(270px,0.45fr)]">
        <section className="overflow-hidden rounded-md border border-slate-200 bg-white">
          <div className="flex flex-col gap-2 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--theme-primary)]">Leaflet + OpenStreetMap</p>
              <h2 className="mt-1 text-[13px] font-semibold text-slate-900">Ubicaciones operativas</h2>
            </div>
            <span className="rounded-full bg-[var(--theme-primary-soft)] px-2.5 py-1 text-[10px] font-semibold text-[var(--theme-primary)]">{locations.length} puntos</span>
          </div>
          <LeafletMap locations={locations} onSelectLocation={selectLocation} selectedLocationId={selectedLocationId} />
        </section>

        <aside className="rounded-md border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-md bg-[var(--theme-primary-soft)] text-[var(--theme-primary)]"><AppIcon className="size-4" name="map" /></div>
            <div>
              <h2 className="text-[13px] font-semibold text-slate-900">Puntos del mapa</h2>
              <p className="mt-0.5 text-[11px] text-slate-500">Selecciona una ubicación.</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {locations.map((location) => (
              <button
                key={location.id}
                className={`flex w-full items-start gap-3 rounded-md border p-3 text-left transition ${location.id === selectedLocationId ? 'border-[var(--theme-primary-border)] bg-[var(--theme-primary-soft)]' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                onClick={() => selectLocation(location.id)}
                type="button"
              >
                <span className={`mt-0.5 size-2.5 shrink-0 rounded-full ${location.tone === 'primary' ? 'bg-[var(--theme-primary)]' : location.tone === 'warning' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                <span>
                  <span className="block text-[11px] font-semibold text-slate-800">{location.name}</span>
                  <span className="mt-1 block text-[10px] leading-4 text-slate-500">{location.description}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-400">Ubicación seleccionada</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{selected.name}</p>
            <p className="mt-1 text-[11px] leading-4 text-slate-500">{selected.description}</p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
