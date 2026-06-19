import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useTicketStatusFetch from '@/views/queue/fetch/useTicketStatusFetch';
import TicketStatusCards from '@/components/tickets/TicketStatusCards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export default function TicketStatusPage() {
  const { id: routeId } = useParams();
  const [ticketInput, setTicketInput] = useState(routeId || '1');
  const [activeId, setActiveId] = useState(routeId ? parseInt(routeId, 10) : 1);
  const ticketId = parseInt(String(activeId), 10);
  const { data, error, loading, invalidId } = useTicketStatusFetch(ticketId);

  function handleSearch(e) {
    e.preventDefault();
    const id = parseInt(ticketInput, 10);
    if (!Number.isNaN(id)) {
      setActiveId(id);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suivi de ticket</CardTitle>
        <CardDescription>Consultez votre position dans la file d&apos;attente</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
          <div className="flex-1 space-y-2">
            <Label htmlFor="ticketId">N° ticket</Label>
            <Input
              id="ticketId"
              type="number"
              min="1"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button type="submit">Consulter</Button>
          </div>
        </form>

        {invalidId && (
          <Alert variant="destructive">
            <AlertDescription>Identifiant de ticket invalide.</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {loading && !data && <Skeleton className="h-32 w-full" />}
        {data && <TicketStatusCards data={data} ticketId={ticketId} />}
      </CardContent>
    </Card>
  );
}
