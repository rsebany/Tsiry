import { Search, History } from 'lucide-react';
import useHistoriquePatient from '@/features/medecin/hooks/useHistoriquePatient';
import PageHeader from '@/components/PageHeader';
import DataState from '@/components/DataState';
import PriorityBadge from '@/components/PriorityBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/constants';

// ============ OWNER: Clova (historique des urgences patient) ============
// // TODO Clova: ajouter un sélecteur de patient plutôt qu'une saisie manuelle d'ID.
export default function HistoriquePatientPage() {
  const { patientId, setPatientId, history, loading, error, search } = useHistoriquePatient();

  function handleSubmit(e) {
    e.preventDefault();
    search();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Historique patient"
        description="Consultation des urgences antérieures d'un patient."
      />

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="patient-id">Identifiant patient</Label>
              <Input
                id="patient-id"
                inputMode="numeric"
                placeholder="ex. 1"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading || !patientId}>
              <Search className="h-4 w-4" />
              {loading ? 'Recherche…' : 'Afficher'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5" />
            Historique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataState
            loading={loading}
            error={error}
            empty={!history}
            emptyMessage="Saisissez un identifiant patient pour afficher son historique."
          >
            {history && history.length === 0 && (
              <p className="py-8 text-center text-muted-foreground">
                Aucun cas d'urgence enregistré pour ce patient.
              </p>
            )}
            <div className="space-y-3">
              {history?.map((cas) => (
                <Card key={cas.id_urgence} className="bg-surface-2/60">
                  <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{formatDate(cas.date_declaration)}</p>
                      {cas.nom_medecin && (
                        <p className="text-sm">
                          Dr {cas.prenom_medecin} {cas.nom_medecin}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <PriorityBadge level={cas.niveau_priorite} />
                      <Badge variant="outline">Score {cas.score_gravite}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DataState>
        </CardContent>
      </Card>
    </div>
  );
}
