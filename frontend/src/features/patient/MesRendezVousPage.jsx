import { Link } from 'react-router-dom';
import { CalendarCheck, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import useMesRendezVous from '@/features/patient/hooks/useMesRendezVous';
import AppointmentCard from '@/features/patient/components/AppointmentCard';
import PageHeader from '@/components/PageHeader';
import DataState from '@/components/DataState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FILTER_RDV } from '@/lib/constants';

// ============ OWNER: Nathan (UC2 - consulter rendez-vous) ============
// // TODO Nathan: remplacer les onglets par une pagination si le volume grandit.
const FILTERS = [
  { value: FILTER_RDV.ALL, label: 'Tous' },
  { value: FILTER_RDV.UPCOMING, label: 'À venir' },
  { value: FILTER_RDV.PAST, label: 'Passés' },
];

function isToday(iso) {
  if (!iso) return false;
  const date = new Date(iso);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export default function MesRendezVousPage() {
  const { user } = useAuth();
  const { filter, setFilter, appointments, loading, error, exportPDF, exporting } =
    useMesRendezVous(user?.id);

  const todayRdv = appointments.find((rdv) => isToday(rdv.date_heure) && rdv.statut === 'PLANIFIE');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mes rendez-vous"
        description="Historique et prochains rendez-vous."
        actions={
          <Button variant="outline" onClick={exportPDF} disabled={exporting || loading}>
            <Download className="h-4 w-4" />
            {exporting ? 'Export…' : 'Exporter PDF'}
          </Button>
        }
      />

      {todayRdv && (
        <Card className="border-green-border bg-green-soft">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-[17px]">
                <CalendarCheck className="h-5 w-5 text-primary" />
                Rendez-vous du jour
              </CardTitle>
              <CardDescription className="text-green-deep">
                Vous avez un rendez-vous aujourd&apos;hui. Enregistrez votre présence au kiosk.
              </CardDescription>
            </div>
            <Button asChild>
              <Link to="/kiosque">Aller au kiosk</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <AppointmentCard rdv={todayRdv} />
          </CardContent>
        </Card>
      )}

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          {FILTERS.map((f) => (
            <TabsTrigger key={f.value} value={f.value}>
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <DataState
        loading={loading}
        error={error}
        empty={appointments.length === 0}
        emptyMessage="Aucun rendez-vous dans cette catégorie."
      >
        <div className="space-y-3">
          {appointments.map((rdv) => (
            <AppointmentCard key={rdv.id_rdv} rdv={rdv} />
          ))}
        </div>
      </DataState>
    </div>
  );
}
