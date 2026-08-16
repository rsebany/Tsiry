import { useEffect, useState } from 'react';
import {
  Users,
  Stethoscope,
  HeartPulse,
  Phone,
  SkipForward,
  Clock3,
  DoorOpen,
  Activity,
  PhoneCall,
  ListOrdered,
} from 'lucide-react';
import useMedecinQueue from '@/features/medecin/hooks/useMedecinQueue';
import Vitals from '@/features/medecin/components/Vitals';
import PageHero from '@/components/PageHero';
import StatTile from '@/components/StatTile';
import DataState from '@/components/DataState';
import PriorityBadge from '@/components/PriorityBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { formatPatientName } from '@/utils/ticketUtils';

const TABS = [
  { key: 'TOUS', label: 'Rehetra' },
  { key: 'PRIORITAIRES', label: 'Manan-danja' },
  { key: 'NORMAUX', label: 'Mahazatra' },
];

function dureeDepuis(dateIso) {
  if (!dateIso) return null;
  const minutes = Math.floor((Date.now() - new Date(dateIso).getTime()) / 60000);
  if (minutes < 1) return "tao anatin'ny indray mandeha";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}min` : `${m} min`;
}

const PRIORITY_BAR = {
  ROUGE: 'border-l-destructive',
  ORANGE: 'border-l-warning',
  JAUNE: 'border-l-warning',
  VERT: 'border-l-success',
};

// ============ OWNER: Clova (UC9+UC10 - console unifiée) ============
// // TODO Clova: permettre de clôturer la consultation depuis cet écran (route AGENT actuellement).
export default function ConsultationPage() {
  const { current, waiting, error, loading, boxByTicket, setBoxByTicket, loadingId, handleTriggerCall } =
    useMedecinQueue();

  const [tab, setTab] = useState('TOUS');
  const [selectedId, setSelectedId] = useState(null);
  const [, forceTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => forceTick((n) => n + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const filtered = waiting.filter((t) => {
    if (tab === 'PRIORITAIRES') return t.niveau_priorite === 'ROUGE' || t.niveau_priorite === 'ORANGE';
    if (tab === 'NORMAUX') return !t.niveau_priorite || t.niveau_priorite === 'VERT';
    return true;
  });

  const selected = filtered.find((t) => t.id_ticket === selectedId) || filtered[0] || null;

  function handlePasser() {
    if (!selected) return;
    const idx = filtered.findIndex((t) => t.id_ticket === selected.id_ticket);
    const next = filtered[idx + 1] || filtered[0];
    setSelectedId(next ? next.id_ticket : null);
  }

  return (
    <div className="space-y-6">
      <PageHero
        icon={PhoneCall}
        title="Konsola fitsaboana"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile
          label="Miandry"
          value={waiting.length}
          icon={Users}
          tone="emerald"
        />
        <StatTile
          label="Eo amin'ny fitsaboana"
          value={current ? `#${current.numero}` : '—'}
          icon={Stethoscope}
          tone="teal"
        />
        <StatTile
          label="Box ankehitriny"
          value={current?.numero_box || '—'}
          icon={DoorOpen}
          tone="sky"
        />
      </div>

      <DataState loading={loading} error={error}>
        <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)_320px]">
          <Card className="order-1 relative overflow-hidden border-0 shadow-md ring-1 ring-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  Androana miandry
                </span>
                <Badge variant="secondary">{waiting.length}</Badge>
              </CardTitle>
              <div className="flex gap-1 rounded-full bg-muted p-1">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTab(t.key)}
                    className={cn(
                      'flex-1 rounded-full px-2.5 py-1 text-xs font-semibold transition',
                      tab === t.key
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="max-h-[560px] space-y-2 overflow-y-auto p-3 pt-0">
              {filtered.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">Tsy misy marary.</p>
              )}
              {filtered.map((t) => {
                const attente = dureeDepuis(t.heure_creation);
                return (
                  <button
                    key={t.id_ticket}
                    type="button"
                    onClick={() => setSelectedId(t.id_ticket)}
                    className={cn(
                      'w-full rounded-xl border bg-card p-3 text-left text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-md',
                      'border-l-4',
                      PRIORITY_BAR[t.niveau_priorite] || 'border-l-transparent',
                      selected?.id_ticket === t.id_ticket && 'ring-2 ring-primary'
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-base font-bold">#{t.numero}</span>
                      {t.niveau_priorite && <PriorityBadge level={t.niveau_priorite} />}
                    </div>
                    <p className="mt-0.5 font-medium text-foreground">{formatPatientName(t)}</p>
                    {attente && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock3 className="h-3.5 w-3.5" />
                        {attente}
                      </p>
                    )}
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card className="order-3 relative overflow-hidden border-0 shadow-md ring-1 ring-border lg:order-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                Marary ao amin'ny fitsaboana
              </CardTitle>
            </CardHeader>
            <CardContent>
              {current ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-gradient-to-br from-muted/70 to-background p-4 ring-1 ring-border">
                    <Badge className="px-3 py-1.5 text-lg">#{current.numero}</Badge>
                    <span className="font-semibold">{formatPatientName(current)}</span>
                    {current.numero_box && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary ring-1 ring-primary/20">
                        <DoorOpen className="h-4 w-4" />
                        Box {current.numero_box}
                      </span>
                    )}
                    {current.niveau_priorite && <PriorityBadge level={current.niveau_priorite} />}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Activity className="h-3.5 w-3.5 text-primary" />
                    {current.heure_appel ? (
                      <span>
                        Eo amin'ny fitsaboana hatramin'ny{' '}
                        <span className="font-semibold text-foreground">
                          {dureeDepuis(current.heure_appel)}
                        </span>
                      </span>
                    ) : (
                      <span>Eo amin'ny antsoina</span>
                    )}
                  </div>

                  <Vitals ticket={current} />
                </div>
              ) : (
                <p className="py-10 text-center text-muted-foreground">
                  Tsy misy marary eo amin'ny fitsaboana ankehitriny.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="order-2 relative overflow-hidden border-0 shadow-md ring-1 ring-border lg:order-3">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Phone className="h-4 w-4 text-primary" />
                Antsoy ny marary manaraka
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selected ? (
                <>
                  <div className="rounded-2xl bg-gradient-to-br from-primary via-emerald-700 to-teal-600 p-5 text-center text-white shadow-lg">
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
                      Laharana manaraka
                    </p>
                    <p className="mt-1 text-5xl font-extrabold drop-shadow">#{selected.numero}</p>
                    <p className="mt-1 text-sm text-white/90">{formatPatientName(selected)}</p>
                    {selected.niveau_priorite && (
                      <div className="mt-2 flex justify-center">
                        <PriorityBadge level={selected.niveau_priorite} className="ring-2 ring-white/40" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="numero-box"
                      className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"
                    >
                      <DoorOpen className="h-3.5 w-3.5" />
                      Laharana box (ohatra: A3)
                    </label>
                    <Input
                      id="numero-box"
                      placeholder="Ohatra: A3"
                      value={boxByTicket[selected.id_ticket] || ''}
                      onChange={(e) =>
                        setBoxByTicket({ ...boxByTicket, [selected.id_ticket]: e.target.value })
                      }
                      disabled={loadingId === selected.id_ticket}
                      className="h-11 text-base"
                    />
                  </div>

                  <Button
                    className="h-11 w-full gap-2 text-base shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
                    onClick={() => handleTriggerCall(selected)}
                    disabled={loadingId === selected.id_ticket}
                  >
                    <Phone className="h-4 w-4" />
                    {loadingId === selected.id_ticket ? 'Eo amin\'ny antsoina…' : 'Antsoy'}
                  </Button>
                  <Button variant="outline" className="h-11 w-full gap-2" onClick={handlePasser}>
                    <SkipForward className="h-4 w-4" />
                    Aleo
                  </Button>
                </>
              ) : (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  Tsy misy marary miandry.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </DataState>
    </div>
  );
}
