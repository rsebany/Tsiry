import { Link } from 'react-router-dom';
import { checkIsEmptyState } from '@/services/rendezvousUtils';
import { usePatientAppointments } from '@/hooks/useMesRendezVous';
import AppointmentCard from '@/components/appointments/AppointmentCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function MyAppointmentsPage() {
  const { appointments, isLoading, error } = usePatientAppointments();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Mon Espace Santé</CardTitle>
        <Button asChild size="sm">
          <Link to="/patient/rendez-vous/nouveau">Nouveau RDV</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {checkIsEmptyState(appointments) ? (
          <div className="space-y-4 text-center py-8">
            <p className="text-muted-foreground">Vous n&apos;avez aucun rendez-vous planifié ou passé.</p>
            <Button asChild>
              <Link to="/patient/rendez-vous/nouveau">Prendre un rendez-vous</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((rdv) => (
              <AppointmentCard key={rdv.id_rdv} rdv={rdv} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
