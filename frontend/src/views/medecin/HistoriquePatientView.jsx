import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export default function HistoriquePatientView() {
  const { token: contextToken } = useAuth() || {};
  const [patientId, setPatientId] = useState('');
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!patientId.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const token =
        contextToken ||
        localStorage.getItem('token') ||
        localStorage.getItem('access_token') ||
        localStorage.getItem('jwt');

      if (!token) {
        throw new Error('Session expirée ou non autorisée.');
      }

      const response = await fetch(`/api/urgences/patient/${patientId}/historique`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Impossible de récupérer l'historique du patient.");
      }

      const data = await response.json();
      console.log('📦 Réponse brute de l\'API historique :', data);

      // Extraction flexible selon le format renvoyé par le backend
      const list = Array.isArray(data)
        ? data
        : data.data || data.historique || data.urgences || data.rows || [];

      setHistorique(list);
    } catch (err) {
      setError(err.message);
      setHistorique([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Historique Patient</h1>
        <p className="text-muted-foreground">
          Consulter le passage et l&apos;historique des urgences d&apos;un patient
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recherche de dossier</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-3">
            <Input
              type="number"
              placeholder="Identifiant du patient (ex: 2)"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Recherche...' : 'Rechercher'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {searched && !loading && historique.length === 0 && !error && (
        <p className="text-muted-foreground italic text-center py-4">
          Aucun historique d&apos;urgence trouvé pour ce patient.
        </p>
      )}

      {historique.length > 0 && (
        <div className="space-y-4">
          {historique.map((item, index) => {
            const isRouge = item.niveau_priorite === 'ROUGE';
            const isOrange = item.niveau_priorite === 'ORANGE';

            return (
              <Card key={item.id_urgence || index}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-semibold text-muted-foreground">
                      📅 {new Date(item.date_declaration).toLocaleString('fr-FR')}
                    </span>
                    <div className="flex gap-2">
                      <Badge variant="outline">Score: {item.score_gravite}</Badge>
                      <Badge className={isRouge ? 'bg-red-600' : isOrange ? 'bg-orange-500' : 'bg-green-600'}>
                        {item.niveau_priorite}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 bg-slate-50 p-3 rounded-lg text-sm text-center border">
                    <div>
                      <span className="block text-xs text-muted-foreground">Pouls</span>
                      <strong>{item.pouls ? `${item.pouls} bpm` : '--'}</strong>
                    </div>
                    <div className="border-x">
                      <span className="block text-xs text-muted-foreground">Tension Systolique</span>
                      <strong>{item.tension_systolique ? `${item.tension_systolique} mmHg` : '--'}</strong>
                    </div>
                    <div>
                      <span className="block text-xs text-muted-foreground">SpO₂</span>
                      <strong className={item.saturation_o2 < 90 ? 'text-red-600 font-bold' : ''}>
                        {item.saturation_o2 ? `${item.saturation_o2}%` : '--'}
                      </strong>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}