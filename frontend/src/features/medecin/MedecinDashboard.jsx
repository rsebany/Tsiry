import { Link } from 'react-router-dom';
import {
  Users,
  Stethoscope,
  ListOrdered,
  History,
  HeartPulse,
  ArrowRight,
  DoorOpen,
  Clock3,
  LayoutDashboard,
} from 'lucide-react';
import useMedecinQueue from '@/features/medecin/hooks/useMedecinQueue';
import Vitals from '@/features/medecin/components/Vitals';
import StatTile from '@/components/StatTile';
import DataState from '@/components/DataState';
import PriorityBadge from '@/components/PriorityBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatPatientName } from '@/utils/ticketUtils';

const PRIORITY_BAR = {
  ROUGE: 'border-l-destructive',
  ORANGE: 'border-l-warning',
  JAUNE: 'border-l-warning',
  VERT: 'border-l-success',
};

export default function MedecinDashboard() {
  const { current, waiting, error, loading } = useMedecinQueue();
  const apercu = waiting.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <LayoutDashboard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tabilao dokotera</h1>
          </div>
        </div>
        <Button asChild variant="secondary" className="bg-white/90 text-primary hover:bg-white">
          <Link to="/medecin/consultation">
            Konsola
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

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

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card className="relative overflow-hidden border-0 shadow-md ring-1 ring-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              Marary ao amin'ny fitsaboana
              {current && <Badge className="ml-auto">#{current.numero}</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataState loading={loading} error={error}>
              {current ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-2xl font-extrabold text-primary">
                      {formatPatientName(current)}
                    </span>
                    {current.numero_box && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary ring-1 ring-primary/20">
                        <DoorOpen className="h-4 w-4" />
                        Box {current.numero_box}
                      </span>
                    )}
                    {current.niveau_priorite && <PriorityBadge level={current.niveau_priorite} />}
                  </div>

                  {current.heure_appel && (
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock3 className="h-3.5 w-3.5 text-primary" />
                      Eo amin'ny fitsaboana hatramin'ny{' '}
                      {new Date(current.heure_appel).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}

                  <Vitals ticket={current} />
                </div>
              ) : (
                <p className="py-8 text-center text-muted-foreground">
                  Tsy misy marary eo amin'ny fitsaboana ankehitriny.
                </p>
              )}
            </DataState>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-md ring-1 ring-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                Fintinina ny androana
              </span>
              <Badge variant="secondary">{waiting.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {apercu.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">Tsy misy marary miandry.</p>
            ) : (
              <div className="space-y-2.5">
                {apercu.map((t, i) => (
                  <div
                    key={t.id_ticket}
                    className={cn(
                      'flex items-center justify-between gap-3 rounded-xl border border-l-4 bg-muted/30 p-3',
                      PRIORITY_BAR[t.niveau_priorite] || 'border-l-transparent'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-bold">#{t.numero}</p>
                        <p className="text-xs text-muted-foreground">{formatPatientName(t)}</p>
                      </div>
                    </div>
                    {t.niveau_priorite && <PriorityBadge level={t.niveau_priorite} />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="group border-0 shadow-md ring-1 ring-border transition hover:-translate-y-0.5 hover:shadow-lg">
          <CardContent className="flex items-center justify-between gap-3 p-5">
            <div className="flex items-center gap-4">
              <div>
                <p className="font-semibold">Konsola fitsaboana</p>
              </div>
            </div>
            <Button asChild size="sm" className="shrink-0">
              <Link to="/medecin/consultation">
                Sokafy
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group border-0 shadow-md ring-1 ring-border transition hover:-translate-y-0.5 hover:shadow-lg">
          <CardContent className="flex items-center justify-between gap-3 p-5">
            <div className="flex items-center gap-4">
              <div>
                <p className="font-semibold">Tantaran'ny marary</p>
              </div>
            </div>
            <Button asChild size="sm" variant="outline" className="shrink-0">
              <Link to="/medecin/historique">
                Sokafy
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
