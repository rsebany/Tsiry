import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Search,
  Navigation,
  MapPin,
  LocateFixed,
  X,
  Building2,
  ListFilter,
} from 'lucide-react';
import useCarteHopitaux from '@/features/carte/hooks/useCarteHopitaux';
import DataState from '@/components/DataState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import './carte.css';

// ============ OWNER: Clova (UC11 - cartographie) ============

const DEFAULT_CENTER = [-18.9136, 47.521];

const TYPE_STYLES = {
  CHU: {
    color: '#2563eb',
    chip: 'bg-blue-500/10 text-blue-600 ring-blue-500/25',
    badge: 'text-blue-700 bg-blue-500/10 ring-blue-500/25',
  },
  Public: {
    color: '#16a34a',
    chip: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/25',
    badge: 'text-emerald-700 bg-emerald-500/10 ring-emerald-500/25',
  },
  'Privé': {
    color: '#7c3aed',
    chip: 'bg-violet-500/10 text-violet-600 ring-violet-500/25',
    badge: 'text-violet-700 bg-violet-500/10 ring-violet-500/25',
  },
  Militaire: {
    color: '#ea580c',
    chip: 'bg-orange-500/10 text-orange-600 ring-orange-500/25',
    badge: 'text-orange-700 bg-orange-500/10 ring-orange-500/25',
  },
};
const DEFAULT_STYLE = {
  color: '#64748b',
  chip: 'bg-slate-500/10 text-slate-600 ring-slate-500/25',
  badge: 'text-slate-600 bg-slate-500/10 ring-slate-500/25',
};

function styleOf(type) {
  return TYPE_STYLES[type] || DEFAULT_STYLE;
}

function TypeBadge({ type, className }) {
  return (
    <Badge
      variant="outline"
      className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1', styleOf(type).badge, className)}
    >
      {type}
    </Badge>
  );
}

function markerIcon(type, { active = false, nearest = false } = {}) {
  const color = styleOf(type).color;
  const size = active ? 38 : 30;
  const tip = size + 10;
  const ring = active ? `<span class="carte-pin-ring"></span>` : '';
  const pulse = nearest ? `<span class="carte-pin-pulse"></span>` : '';

  return L.divIcon({
    className: 'carte-pin',
    html: `<div class="carte-pin-wrap" style="color:${color}">${ring}
      <svg width="${size}" height="${tip}" viewBox="0 0 32 42">
        <path d="M16 1.5C8.8 1.5 3 7.3 3 14.5c0 10.8 13 26 13 26s13-15.2 13-26C29 7.3 23.2 1.5 16 1.5z"
              fill="${color}" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/>
        <circle cx="16" cy="14" r="5.5" fill="#fff"/>
      </svg>${pulse}</div>`,
    iconSize: [size, tip],
    iconAnchor: [size / 2, tip - 1],
    popupAnchor: [0, -(tip + 4)],
  });
}

function RecentrerCarte({ position }) {
  const map = useMap();
  const [lat, lng] = position || [];
  useEffect(() => {
    if (lat == null || lng == null) return;
    map.flyTo([lat, lng], 14, { duration: 0.6 });
  }, [lat, lng, map]);
  return null;
}

function LocateButton({ position }) {
  const map = useMap();
  if (!position) return null;
  return (
    <button
      type="button"
      className="carte-float carte-locate"
      title="Mamerina amin'ny toeranako"
      aria-label="Mamerina amin'ny toeranako"
      onClick={() => map.flyTo([position.lat, position.lng], 14, { duration: 0.8 })}
    >
      <LocateFixed className="h-5 w-5" />
    </button>
  );
}

export default function CarteHopitauxView() {
  const {
    hopitaux,
    plusProche,
    types,
    typeFiltre,
    setTypeFiltre,
    recherche,
    setRecherche,
    position,
    error,
    loading,
  } = useCarteHopitaux();

  const [selection, setSelection] = useState(null);

  const ouvrirItineraire = (h) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${h.latitude},${h.longitude}`,
      '_blank'
    );
  };

  return (
    <div className="min-h-screen space-y-6 bg-background py-6 pl-6 pr-6 sm:pl-12 sm:pr-12 lg:pl-16 lg:pr-16">
      <Card className="relative overflow-hidden border-0 shadow-md ring-1 ring-border">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Maka hotsaka fitondramasana…"
                className="h-11 rounded-xl pl-10"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="hidden items-center gap-1.5 pr-1 text-xs font-semibold text-muted-foreground xl:flex">
                <ListFilter className="h-3.5 w-3.5" />
                Sivana:
              </span>
              <Button
                size="sm"
                className="h-9 rounded-full px-4"
                variant={typeFiltre === 'TOUS' ? 'default' : 'outline'}
                onClick={() => setTypeFiltre('TOUS')}
              >
                Rehetra
              </Button>
              {types.map((type) => {
                const active = typeFiltre === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTypeFiltre(type)}
                    className={cn(
                      'inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition',
                      active
                        ? 'border-transparent bg-primary text-primary-foreground shadow-sm'
                        : 'border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: styleOf(type).color }}
                    />
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="order-2 relative overflow-hidden border-0 shadow-md ring-1 ring-border lg:order-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Fitondramasana
              </span>
              <Badge variant="secondary">{hopitaux.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[420px] space-y-2 overflow-y-auto p-3 pt-0 lg:max-h-[560px]">
            {hopitaux.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-12 text-center">
                <MapPin className="h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm font-medium">Tsy misy fitondramasana hita</p>
                <p className="text-xs text-muted-foreground">Ovao ny fikarohana na ny sivana.</p>
              </div>
            )}
            {hopitaux.map((h) => {
              const isSelected = selection?.id_hopital === h.id_hopital;
              const isNearest = plusProche?.id_hopital === h.id_hopital;
              return (
                <button
                  key={h.id_hopital}
                  type="button"
                  onClick={() => setSelection(h)}
                  className={cn(
                    'group w-full rounded-2xl border p-3.5 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md',
                    isSelected
                      ? 'border-primary/40 bg-gradient-to-br from-primary/5 to-teal-500/5 ring-2 ring-primary/30'
                      : 'border-border bg-card hover:border-primary/30'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1',
                        styleOf(h.type).chip
                      )}
                    >
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold leading-snug">{h.nom}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <TypeBadge type={h.type} />
                        {isNearest && (
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600 ring-1 ring-emerald-500/25">
                            Akaiky indrindra
                          </span>
                        )}
                      </div>
                    </div>
                    {h.distanceKm != null && (
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ring-1',
                          isNearest
                            ? 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/25'
                            : 'bg-muted text-muted-foreground ring-muted'
                        )}
                      >
                        {h.distanceKm.toFixed(1)} km
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="order-1 relative overflow-hidden border-0 shadow-md ring-1 ring-border lg:order-2">
          <CardContent className="p-2">
            <DataState loading={loading} error={error}>
              <div className="relative h-[420px] w-full overflow-hidden rounded-xl lg:h-[560px]">
                <MapContainer
                  center={DEFAULT_CENTER}
                  zoom={13}
                  scrollWheelZoom
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  />
                  {selection && (
                    <RecentrerCarte
                      position={[Number(selection.latitude), Number(selection.longitude)]}
                    />
                  )}
                  {hopitaux.map((h) => (
                    <Marker
                      key={h.id_hopital}
                      position={[Number(h.latitude), Number(h.longitude)]}
                      icon={markerIcon(h.type, {
                        active: selection?.id_hopital === h.id_hopital,
                        nearest: plusProche?.id_hopital === h.id_hopital,
                      })}
                      eventHandlers={{ click: () => setSelection(h) }}
                    >
                      <Popup className="carte-popup">
                        <div className="carte-popup-body">
                          <p className="carte-popup-name">{h.nom}</p>
                          <div className="carte-popup-meta">
                            <TypeBadge type={h.type} className="rounded-full px-2.5 py-0.5 text-[10px] ring-1" />
                            {h.distanceKm != null && (
                              <span className="carte-popup-dist">{h.distanceKm.toFixed(1)} km</span>
                            )}
                          </div>
                          <button
                            type="button"
                            className="carte-popup-btn"
                            onClick={() => ouvrirItineraire(h)}
                          >
                            <Navigation size={14} />
                            Lalana
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  <LocateButton position={position} />
                </MapContainer>

                {plusProche && (
                  <div className="carte-float carte-nearest">
                    <span className="carte-nearest-dot" />
                    <div className="min-w-0">
                      <p className="carte-nearest-title">Akaiky indrindra</p>
                      <p className="carte-nearest-name truncate">{plusProche.nom}</p>
                    </div>
                    <span className="carte-nearest-dist">
                      {plusProche.distanceKm.toFixed(1)} km
                    </span>
                  </div>
                )}

                {types.length > 0 && (
                  <div className="carte-float carte-legend">
                    <span className="carte-legend-title">Légende</span>
                    {types.map((type) => (
                      <div key={type} className="carte-legend-row">
                        <span
                          className="carte-legend-dot"
                          style={{ backgroundColor: styleOf(type).color }}
                        />
                        {type}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </DataState>
          </CardContent>
        </Card>
      </div>

      {selection && (
        <Card className="relative overflow-hidden border-0 shadow-md ring-1 ring-border">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ring-1',
                  styleOf(selection.type).chip
                )}
              >
                <MapPin className="h-7 w-7" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-lg font-bold">{selection.nom}</p>
                  <TypeBadge type={selection.type} />
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {selection.distanceKm != null
                    ? `${selection.distanceKm.toFixed(1)} km avy amin'ny toeranao`
                    : 'Tsy misy lalana (tsy ny toeranao)'}
                  {' · '}
                  {Number(selection.latitude).toFixed(4)}, {Number(selection.longitude).toFixed(4)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="lg" className="h-11 gap-2 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg" onClick={() => ouvrirItineraire(selection)}>
                <Navigation className="h-4 w-4" />
                Jereo ny lalana
              </Button>
              <Button size="lg" variant="outline" className="h-11 w-11 p-0" onClick={() => setSelection(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
