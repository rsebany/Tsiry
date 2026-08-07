import { Link } from 'react-router-dom';
import { ArrowRight, CalendarClock, ClipboardList, Plus, Stethoscope } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import useApi from '@/hooks/useApi';
import { fetchPatientAppointments } from '@/services/rendezvousService';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/medisaas';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import DataState from '@/components/DataState';
import { formatDate, RDV_STATUTS } from '@/lib/constants';

// ============ Medisaas — Dashboard patient (données réelles) ============
// KPIs et historique construits uniquement depuis les API existantes
// (fetchPatientAppointments upcoming/past). Aucune donnée fictive.

const DEFAULT_BADGE = { PLANIFIE: 'default', PRESENT: 'success', ANNULE: 'neutral' };

function statusVariant(statut) {
  return DEFAULT_BADGE[statut] || 'neutral';
}

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
    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-emerald-50">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">{month}</span>
      <span className="text-xl font-extrabold leading-none text-slate-800">{d.getDate()}</span>
    </div>
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
  const lastDoctor = pastList[0] || null; // RDV passé le plus récent (tri DESC backend)

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Bonjour, {user?.prenom}
          </h1>
          <p className="text-sm text-slate-500">
            Voici un aperçu de votre activité et de vos prochains rendez-vous.
          </p>
        </div>
        <Button size="lg" asChild>
          <Link to="/patient/rendez-vous/nouveau">
            <Plus className="h-5 w-5" />
            Nouveau rendez-vous
          </Link>
        </Button>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-start gap-4 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
              <CalendarClock className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                RDV à venir
                <Badge variant="success">Prochainement</Badge>
              </div>
              <p className="mt-1 text-3xl font-extrabold leading-none text-slate-900">
                {upcoming.loading ? '…' : upcomingList.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-start gap-4 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
              <Stethoscope className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Dernier médecin</p>
              {past.loading ? (
                <p className="mt-1 text-2xl font-extrabold text-slate-900">…</p>
              ) : lastDoctor ? (
                <div className="mt-1 flex items-center gap-2">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                      {initials(lastDoctor.medecin_nom, lastDoctor.medecin_prenom)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-slate-900">
                      Dr {lastDoctor.medecin_prenom} {lastDoctor.medecin_nom}
                    </p>
                    <p className="text-xs text-slate-400">{lastDoctor.specialite || 'Général'}</p>
                  </div>
                </div>
              ) : (
                <p className="mt-1 text-sm text-slate-400">Aucun rendez-vous passé</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-start gap-4 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10">
              <ClipboardList className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Consultations</p>
              <p className="mt-1 text-3xl font-extrabold leading-none text-slate-900">
                {past.loading ? '…' : pastList.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-start gap-4 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
              <CalendarClock className="h-5 w-5 text-amber-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Prochain RDV</p>
              {upcoming.loading ? (
                <p className="mt-1 text-2xl font-extrabold text-slate-900">…</p>
              ) : nextRdv ? (
                <div className="mt-1 space-y-0.5">
                  <p className="truncate text-sm font-extrabold text-slate-900">
                    Dr {nextRdv.medecin_prenom} {nextRdv.medecin_nom}
                  </p>
                  <p className="text-xs text-slate-400">{formatDate(nextRdv.date_heure)}</p>
                </div>
              ) : (
                <div className="mt-1 space-y-0.5">
                  <p className="text-sm text-slate-400">Aucun rendez-vous à venir</p>
                  <Link to="/patient/rendez-vous/nouveau" className="text-xs font-bold text-emerald-600 hover:underline">
                    En prendre un
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
            <div className="space-y-0.5">
              <CardTitle>Historique récent</CardTitle>
              <CardDescription>Vos dernières consultations passées.</CardDescription>
            </div>
            <Link
              to="/patient/rendez-vous"
              className="text-sm font-bold text-emerald-600 hover:text-emerald-700"
            >
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
              <div className="divide-y divide-slate-100">
                {pastList.slice(0, 5).map((rdv) => (
                  <Link
                    key={rdv.id_rdv}
                    to="/patient/rendez-vous"
                    className="group flex items-center gap-4 rounded-xl px-2 py-3 transition-colors hover:bg-slate-50"
                  >
                    <MonthDay iso={rdv.date_heure} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-800">
                        Dr {rdv.medecin_prenom} {rdv.medecin_nom}
                        <span className="ml-2 font-medium text-slate-400">{rdv.specialite}</span>
                      </p>
                      {rdv.motif && <p className="truncate text-xs text-slate-400">{rdv.motif}</p>}
                    </div>
                    <Badge variant={statusVariant(rdv.statut)}>
                      {RDV_STATUTS[rdv.statut] || rdv.statut}
                    </Badge>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100" />
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