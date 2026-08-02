import { Link } from 'react-router-dom';
import { CalendarPlus, CalendarDays, Ticket } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import useApi from '@/hooks/useApi';
import { fetchPatientAppointments } from '@/services/rendezvousService';
import PageHeader from '@/components/PageHeader';
import DataState from '@/components/DataState';
import AppointmentCard from '@/features/patient/components/AppointmentCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ============ OWNER: Nathan (patient) ============
// // TODO Nathan: ajouter le "prochain RDV" en évidence et le statut du ticket courant.
export default function PatientDashboard() {
  const { user } = useAuth();

  const { data, loading, error } = useApi(
    async () => {
      const res = await fetchPatientAppointments(user.id, 'upcoming');
      return res.data || [];
    },
    [user?.id]
  );

  const next = data?.[0] || null;

  const actions = [
    { to: '/patient/rendez-vous/nouveau', label: 'Prendre un RDV', icon: CalendarPlus },
    { to: '/patient/rendez-vous', label: 'Mes rendez-vous', icon: CalendarDays },
    { to: '/patient/ticket', label: 'Suivre mon ticket', icon: Ticket },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Bonjour, ${user?.prenom}`}
        description="Gérez vos rendez-vous et suivez votre ticket en temps réel."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {actions.map(({ to, label, icon: Icon }) => (
          <Button key={to} asChild variant="outline" className="h-28 flex-col gap-2 text-base">
            <Link to={to}>
              <Icon className="h-6 w-6 text-primary" />
              {label}
            </Link>
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Prochain rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <DataState
            loading={loading}
            error={error}
            empty={!next}
            emptyMessage="Aucun rendez-vous à venir. Prenez-en un dès maintenant !"
          >
            {next && <AppointmentCard rdv={next} />}
          </DataState>
        </CardContent>
      </Card>
    </div>
  );
}
