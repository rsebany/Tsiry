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
      {/* En-tête avec bouton d'accès à l'Historique Patient */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord Médecin</h1>
          <p className="text-muted-foreground">File d&apos;attente et consultations du jour</p>
        </div>
        
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link to="/medecin/historique">📋 Historique Patient</Link>
          </Button>
          <Button asChild>
            <Link to="/medecin/appel">📢 Appeler un patient</Link>
          </Button>
        </div>
      </div>

      {loading && <Skeleton className="h-40 w-full" />}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && (
        <>
          {/* Cartes résumé */}
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
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="text-base px-3 py-1">#{queue.current.numero}</Badge>
                      <span className="text-sm font-medium">
                        Box {queue.current.numero_box || '—'}
                      </span>
                    </div>

                    {/* Affichage des constantes vitales du patient en cours s'il y en a */}
                    {(queue.current.pouls || queue.current.saturation_o2) && (
                      <div className="text-xs bg-slate-50 p-2 rounded border grid grid-cols-3 gap-1 text-center mt-2">
                        <div><span className="text-gray-400">Pouls:</span> <strong>{queue.current.pouls} bpm</strong></div>
                        <div><span className="text-gray-400">Tension:</span> <strong>{queue.current.tension_systolique} mmHg</strong></div>
                        <div>
                          <span className="text-gray-400">SpO₂:</span>{' '}
                          <strong className={queue.current.saturation_o2 < 90 ? 'text-red-600 font-bold' : ''}>
                            {queue.current.saturation_o2}%
                          </strong>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Aucun patient en cours</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Liste détaillée des patients en attente avec Score & Constantes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Liste de Triage & Constantes Vitales</CardTitle>
            </CardHeader>
            <CardContent>
              {!queue?.waiting || queue.waiting.length === 0 ? (
                <p className="text-muted-foreground italic text-center py-4">
                  Aucun patient en attente pour le moment.
                </p>
              ) : (
                <div className="space-y-3">
                  {queue.waiting.map((patient) => {
                    const isRouge = patient.niveau_priorite === 'ROUGE';
                    const isOrange = patient.niveau_priorite === 'ORANGE';

                    return (
                      <div
                        key={patient.id_ticket}
                        className={`p-4 rounded-lg border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                          isRouge ? 'bg-red-50/60 border-red-300' : isOrange ? 'bg-orange-50/60 border-orange-300' : 'bg-white'
                        }`}
                      >
                        {/* Numéro & Badges */}
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold">#{patient.numero}</span>

                          {patient.niveau_priorite && (
                            <Badge className={isRouge ? 'bg-red-600' : isOrange ? 'bg-orange-500' : 'bg-green-600'}>
                              {patient.niveau_priorite}
                            </Badge>
                          )}

                          {patient.score_gravite !== undefined && patient.score_gravite !== null && (
                            <Badge variant="outline" className="border-slate-400 bg-white">
                              Score: {patient.score_gravite}
                            </Badge>
                          )}
                        </div>

                        {/* Constantes vitales */}
                        <div className="flex gap-4 text-xs bg-white px-3 py-2 rounded border shadow-sm">
                          <div>
                            <span className="text-gray-500">Pouls:</span>{' '}
                            <strong>{patient.pouls ? `${patient.pouls} bpm` : '--'}</strong>
                          </div>
                          <div className="border-x px-3">
                            <span className="text-gray-500">Tension:</span>{' '}
                            <strong>{patient.tension_systolique ? `${patient.tension_systolique} mmHg` : '--'}</strong>
                          </div>
                          <div>
                            <span className="text-gray-500">SpO₂:</span>{' '}
                            <strong className={patient.saturation_o2 < 90 ? 'text-red-600 font-bold' : ''}>
                              {patient.saturation_o2 ? `${patient.saturation_o2}%` : '--'}
                            </strong>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}