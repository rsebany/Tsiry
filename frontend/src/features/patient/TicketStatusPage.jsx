import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import useTicketStatus from '@/features/patient/hooks/useTicketStatus';
import TicketStatusCards from '@/features/patient/components/TicketStatusCards';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

// ============ OWNER: Nathan (UC6 - suivi temps réel) ============
// // TODO Nathan: ouvrir automatiquement le suivi si le ticket est lié au patient connecté.
export default function TicketStatusPage() {
  const { id } = useParams();
  const [draft, setDraft] = useState('');
  const { ticketId, setTicketId, lookedUp, lookup, status, sseError, connected, lookupError } =
    useTicketStatus(id);

  function handleSubmit(e) {
    e.preventDefault();
    lookup(draft);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suivre mon ticket"
        description="Saisissez votre numéro de ticket pour voir votre position dans la file."
      />

      <Card>
        <CardHeader>
          <CardTitle>Rechercher un ticket</CardTitle>
          <CardDescription>
            Le suivi se met à jour automatiquement (connexion directe avec la file d'attente).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="ticket-id">Numéro de ticket</Label>
              <Input
                id="ticket-id"
                placeholder="ex. 7"
                inputMode="numeric"
                value={draft || ticketId}
                onChange={(e) => {
                  setDraft(e.target.value);
                  setTicketId(e.target.value);
                }}
              />
            </div>
            <Button type="submit">
              <Search className="h-4 w-4" />
              Suivre
            </Button>
          </form>

          {lookupError && (
            <div className="mt-4">
              <Alert variant="destructive">
                <AlertDescription>{lookupError}</AlertDescription>
              </Alert>
            </div>
          )}

          {lookedUp && !lookupError && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                Suivi en direct :
                <Badge variant={connected ? 'success' : 'destructive'}>
                  {connected ? 'Connecté' : 'Déconnecté'}
                </Badge>
              </div>
              {sseError && !connected && (
                <Alert variant="destructive">
                  <AlertDescription>{sseError}</AlertDescription>
                </Alert>
              )}
              <TicketStatusCards status={status} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
