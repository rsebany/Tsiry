import { useEffect, useState } from 'react';
import { getActiveQueue } from '@/services/ticketService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export default function MedecinDashboard() {
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getActiveQueue()
      .then((res) => setQueue(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Erreur de chargement'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord Médecin</h1>
        <p className="text-muted-foreground">File d&apos;attente et consultations du jour</p>
      </div>

      {loading && <Skeleton className="h-40 w-full" />}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Patients en attente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">{queue?.waiting?.length ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">En consultation</CardTitle>
              </CardHeader>
              <CardContent>
                {queue?.current ? (
                  <div>
                    <Badge>#{queue.current.numero}</Badge>
                    <span className="ml-2 text-sm">
                      Box {queue.current.numero_box || '—'}
                    </span>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Aucun patient en cours</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Button asChild>
            <Link to="/medecin/appel">Appeler un patient en consultation</Link>
          </Button>
        </>
      )}
    </div>
  );
}
