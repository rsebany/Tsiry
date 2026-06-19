import { useEffect, useState } from 'react';
import { getFileAttente } from '@/services/ticketService';
import { isActiveStatut, isClosedStatut } from '@/utils/ticketUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function AgentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getFileAttente()
      .then((response) => {
        if (response.success) {
          const tickets = response.data.tickets || [];
          setData({
            tickets,
            current: tickets.find((t) => isActiveStatut(t.statut)),
            stats: {
              en_attente: tickets.filter((t) => t.statut === 'EN_ATTENTE').length,
              appeles: tickets.filter((t) => isActiveStatut(t.statut)).length,
              traites: tickets.filter((t) => isClosedStatut(t.statut)).length,
            },
          });
        }
      })
      .catch((err) => setError(err.response?.data?.error || 'Erreur de chargement'))
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord Agent</h1>
        <p className="text-muted-foreground">Vue d&apos;ensemble de la file d&apos;attente du jour</p>
      </div>

      {loading && <Skeleton className="h-40 w-full" />}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">En attente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">{stats.en_attente ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Appelés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.appeles ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Traités</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-emerald-600">{stats.traites ?? 0}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Gérer la file et déclarer des urgences</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button asChild>
            <Link to="/agent/file-attente">Ouvrir la file d&apos;attente</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/agent/urgences">Déclarer une urgence</Link>
          </Button>
        </CardContent>
      </Card>

      {data?.current && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ticket en cours</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge>#{data.current.numero}</Badge>
            <span className="ml-2">{data.current.patient_prenom} {data.current.patient_nom}</span>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
