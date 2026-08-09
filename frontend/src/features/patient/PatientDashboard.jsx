import { Link } from 'react-router-dom';
import { ArrowRight, CalendarClock, ClipboardList, Plus, Stethoscope } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import useApi from '@/hooks/useApi';
import { fetchPatientAppointments } from '@/services/rendezvousService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Status } from '@/components/ui/status';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import DataState from '@/components/DataState';
import { formatDate, RDV_STATUTS } from '@/lib/constants';

// ============ Tsiry DS — Dashboard patient (données réelles) ============
// KPIs et historique construits uniquement depuis les API existantes.
const STATUT_TONE = { PLANIFIE: 'info', PRESENT: 'success', ANNULE: 'danger' };

function initials(nom, prenom) {
  return `${prenom?.[0] ?? ''}${nom?.[0] ?? ''}`.toUpperCase() || '?';
}

function MonthDay({ iso }) {
  const d = new Date(iso);
  const month = d
    .toLocaleString('fr-FR', { month: 'short' })
    .replace('.', '')
    .toUpperCase();
  return (
    <div className="flex h-[52px] w-[52px] shrink-0 flex-col items-center justify-center rounded-lg border border-border bg-surface-2">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-primary">{month}</span>
      <span className="text-lg font-bold leading-none text-foreground">{d.getDate()}</span>
    </div>
  );
}

function KpiCard({ icon: Icon, label, children, tileClass }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tileClass}`}>
            <Icon className="h-5 w-5" />
          </span>
          <p className="text-[13px] font-medium text-text-2">{label}</p>
        </div>
        <div className="mt-4">{children}</div>
      </CardContent>
    </Card>
  );
}

export default function PatientDashboard() {
  const { user } = useAuth();

  const upcoming = useApi(
    async () => {
      const res = await fetchPatientAppointments(user.id, 'upcoming');
      return res.data || [];
    },
    [user?.id]
  );
  const past = useApi(
    async () => {
      const res = await fetchPatientAppointments(user.id, 'past');
      return res.data || [];
    },
    [user?.id]
  );

  const upcomingList = upcoming.data ?? [];
  const pastList = past.data ?? [];
  const nextRdv = upcomingList[0] || null;
  const lastDoctor = pastList[0] || null;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-foreground md:text-[28px]">
            Bonjour, {user?.prenom}
          </h1>
          <p className="mt-0.5 text-[13.5px] text-text-muted">
            Voici un aperçu de votre activité et de vos prochains rendez-vous.
          </p>
        </div>
        <Button asChild>
          <Link to="/patient/rendez-vous/nouveau">
            <Plus className="h-4 w-4" />
            Nouveau rendez-vous
          </Link>
        </Button>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={CalendarClock} label="RDV à venir" tileClass="bg-green-soft text-primary">
          <p className="text-3xl font-bold leading-none text-foreground">
            {upcoming.loading ? '…' : upcomingList.length}
          </p>
        </KpiCard>

        <KpiCard icon={Stethoscope} label="Dernier médecin" tileClass="bg-info-soft text-info">
          {past.loading ? (
            <p className="text-3xl font-bold leading-none text-foreground">…</p>
          ) : lastDoctor ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-[11px]">
                  {initials(lastDoctor.medecin_nom, lastDoctor.medecin_prenom)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  Dr {lastDoctor.medecin_prenom} {lastDoctor.medecin_nom}
                </p>
                <p className="text-xs text-text-muted">{lastDoctor.specialite || 'Général'}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-text-muted">Aucun rendez-vous passé</p>
          )}
        </KpiCard>

        <KpiCard icon={ClipboardList} label="Consultations" tileClass="bg-red-soft text-red">
          <p className="text-3xl font-bold leading-none text-foreground">
            {past.loading ? '…' : pastList.length}
          </p>
        </KpiCard>

        <KpiCard icon={CalendarClock} label="Prochain RDV" tileClass="bg-amber-soft text-amber">
          {upcoming.loading ? (
            <p className="text-3xl font-bold leading-none text-foreground">…</p>
          ) : nextRdv ? (
            <div className="space-y-0.5">
              <p className="truncate text-sm font-semibold text-foreground">
                Dr {nextRdv.medecin_prenom} {nextRdv.medecin_nom}
              </p>
              <p className="text-xs text-text-muted">{formatDate(nextRdv.date_heure)}</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              <p className="text-sm text-text-muted">Aucun rendez-vous à venir</p>
              <Link
                to="/patient/rendez-vous/nouveau"
                className="text-[13px] font-semibold text-primary hover:underline"
              >
                En prendre un
              </Link>
            </div>
          )}
        </KpiCard>
      </section>

      <section>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Historique récent</CardTitle>
              <CardDescription>Vos dernières consultations passées.</CardDescription>
            </div>
            <Link to="/patient/rendez-vous" className="text-[13px] font-semibold text-primary hover:underline">
              Voir tout
            </Link>
          </CardHeader>
          <CardContent>
            <DataState
              loading={past.loading}
              error={past.error}
              empty={pastList.length === 0}
              emptyMessage="Aucune consultation passée."
            >
              <div className="divide-y divide-border-soft">
                {pastList.slice(0, 5).map((rdv) => (
                  <Link
                    key={rdv.id_rdv}
                    to="/patient/rendez-vous"
                    className="group flex items-center gap-4 py-3 transition-colors duration-150 ease-soft hover:bg-surface-2"
                  >
                    <MonthDay iso={rdv.date_heure} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        Dr {rdv.medecin_prenom} {rdv.medecin_nom}
                        <span className="ml-2 font-normal text-text-muted">{rdv.specialite}</span>
                      </p>
                      {rdv.motif && <p className="truncate text-[13px] text-text-muted">{rdv.motif}</p>}
                    </div>
                    <Status tone={STATUT_TONE[rdv.statut] || 'neutral'}>
                      {RDV_STATUTS[rdv.statut] || rdv.statut}
                    </Status>
                    <ArrowRight className="h-4 w-4 shrink-0 text-text-faint opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </DataState>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}