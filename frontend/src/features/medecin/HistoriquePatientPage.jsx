import { Search, History, CalendarDays, UserCheck, Gauge, FileSearch } from 'lucide-react';
import useHistoriquePatient from '@/features/medecin/hooks/useHistoriquePatient';
import StatTile from '@/components/StatTile';
import Vitals from '@/features/medecin/components/Vitals';
import DataState from '@/components/DataState';
import PriorityBadge from '@/components/PriorityBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/constants';

const DOT_PRIORITY = {
  ROUGE: 'bg-destructive',
  ORANGE: 'bg-warning',
  JAUNE: 'bg-warning',
  VERT: 'bg-success',
};

function scoreTone(score) {
  if (score >= 4) return 'bg-destructive/10 text-destructive ring-destructive/25';
  if (score === 3) return 'bg-warning/10 text-warning ring-warning/25';
  if (score === 2) return 'bg-amber-500/10 text-amber-600 ring-amber-500/25';
  return 'bg-success/10 text-success ring-success/25';
}

export default function HistoriquePatientPage() {
  const { patientId, setPatientId, history, loading, error, search } = useHistoriquePatient();

  const lastCase = history?.[0] || null;

  function handleSubmit(e) {
    e.preventDefault();
    search();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <History className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tantaran'ny marary</h1>
        </div>
      </div>

      <Card className="relative overflow-hidden border-0 shadow-md ring-1 ring-border">
        <CardContent className="p-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="patient-id" className="text-sm font-semibold">
                Laharana marary
              </Label>
              <Input
                id="patient-id"
                inputMode="numeric"
                placeholder="ohatra: 1"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="h-11 text-base"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={loading || !patientId}
              className="h-11 gap-2 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Search className="h-4 w-4" />
              {loading ? 'Mikaroka…' : 'Asio tantara'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <DataState
        loading={loading}
        error={error}
        empty={!history}
        emptyMessage="Ampidiro ny laharana marary mba hitazonana ny tantarany."
      >
        {history && history.length === 0 && (
          <Card className="border-0 shadow-md ring-1 ring-border">
            <CardContent className="flex flex-col items-center gap-2 py-14 text-center">
              <FileSearch className="h-12 w-12 text-muted-foreground/40" />
              <p className="font-medium">Tsy misy olana voaray</p>
              <p className="text-sm text-muted-foreground">
                Tsy misy tantara fandraisana amin'ny marary ity mandra-pitany.
              </p>
            </CardContent>
          </Card>
        )}

        {history && history.length > 0 && (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatTile
                label="Tontolo samy paritra"
                value={history.length}
                icon={CalendarDays}
                tone="emerald"
                sub="fandraisana voatery"
              />
              <StatTile
                label="Fandraisana farany"
                value={formatDate(lastCase?.date_declaration).split(' ')[0]}
                icon={UserCheck}
                tone="teal"
                sub={lastCase ? `par ${lastCase.prenom_medecin || ''} ${lastCase.nom_medecin || ''}`.trim() : '—'}
              />
              <div className="rounded-2xl border bg-card p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-muted-foreground">Ambaratonga vao haingana</p>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 ring-1 ring-violet-500/25">
                    <Gauge className="h-5 w-5" />
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  {lastCase?.niveau_priorite && <PriorityBadge level={lastCase.niveau_priorite} />}
                  <Badge
                    variant="outline"
                    className={cn(
                      'rounded-full px-2.5 py-1 text-xs font-bold ring-1',
                      scoreTone(lastCase?.score_gravite)
                    )}
                  >
                    Score {lastCase?.score_gravite}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="relative space-y-4 pl-6 before:absolute before:inset-y-1 before:left-[11px] before:w-px before:bg-border">
              {history.map((cas) => (
                <div key={cas.id_urgence} className="relative">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute -left-[23px] top-5 h-3.5 w-3.5 rounded-full ring-4 ring-background',
                      DOT_PRIORITY[cas.niveau_priorite] || 'bg-muted-foreground'
                    )}
                  />
                  <Card className="overflow-hidden border-0 shadow-md ring-1 ring-border transition hover:-translate-y-0.5 hover:shadow-lg">
                    <div
                      className={cn(
                        'flex flex-wrap items-center justify-between gap-3 border-b bg-muted/30 p-4',
                        cas.niveau_priorite === 'ROUGE' && 'bg-destructive/5'
                      )}
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="outline" className="gap-1.5 font-semibold">
                          <CalendarDays className="h-3.5 w-3.5 text-primary" />
                          {formatDate(cas.date_declaration)}
                        </Badge>
                        {cas.nom_medecin && (
                          <span className="text-sm text-muted-foreground">
                            Dr {cas.prenom_medecin} {cas.nom_medecin}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {cas.niveau_priorite && <PriorityBadge level={cas.niveau_priorite} />}
                        <Badge
                          variant="outline"
                          className={cn(
                            'rounded-full px-2.5 py-1 text-xs font-bold ring-1',
                            scoreTone(cas.score_gravite)
                          )}
                        >
                          Score {cas.score_gravite}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <Vitals ticket={cas} />
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </>
        )}
      </DataState>
    </div>
  );
}
