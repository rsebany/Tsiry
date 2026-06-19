import { Link } from 'react-router-dom';
import { CalendarPlus, CalendarDays } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePatientAppointments } from '@/hooks/useMesRendezVous';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export default function PatientDashboard() {
  const { user } = useAuth();
  const { appointments, isLoading, error } = usePatientAppointments();

  const upcoming = appointments
    .filter((a) => a.statut === 'PLANIFIE')
    .sort((a, b) => new Date(a.date_heure) - new Date(b.date_heure))[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bonjour, {user?.prenom}</h1>
        <p className="text-muted-foreground">Bienvenue dans votre espace patient</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prochain rendez-vous</CardTitle>
            <CardDescription>Votre consultation à venir</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && <Skeleton className="h-20 w-full" />}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {!isLoading && !error && upcoming ? (
              <div className="space-y-2">
                <p className="font-medium">
                  {new Date(upcoming.date_heure).toLocaleString('fr-FR')}
                </p>
                <p className="text-sm text-muted-foreground">{upcoming.motif || 'Consultation'}</p>
                <Badge variant="secondary">{upcoming.statut}</Badge>
              </div>
            ) : (
              !isLoading &&
              !error && <p className="text-sm text-muted-foreground">Aucun rendez-vous planifié.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild>
              <Link to="/patient/rendez-vous/nouveau">
                <CalendarPlus className="h-4 w-4" />
                Prendre rendez-vous
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/patient/rendez-vous">
                <CalendarDays className="h-4 w-4" />
                Voir mes rendez-vous
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
