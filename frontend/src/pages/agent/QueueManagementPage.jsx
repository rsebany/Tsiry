import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import TicketGenerator from '@/components/queue/TicketGenerator';
import FileAttentePanel from '@/components/queue/FileAttentePanel';
import TicketThermique from '@/components/tickets/TicketThermique';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function QueueManagementPage() {
  const [dernierTicket, setDernierTicket] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  function handleTicketGenerated(ticket) {
    setDernierTicket(ticket);
    setRefreshTrigger((prev) => prev + 1);
  }

  return (
    <>
      <Toaster position="top-right" />
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>File d&apos;attente</CardTitle>
          <CardDescription>Génération de tickets et gestion des appels (UC4 / UC5)</CardDescription>
        </CardHeader>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <TicketGenerator onTicketGenerated={handleTicketGenerated} />
        <FileAttentePanel refreshTrigger={refreshTrigger} />
      </div>
      {dernierTicket && (
        <TicketThermique
          ticket={dernierTicket}
          onClose={() => setDernierTicket(null)}
          serviceName="Hôpital Central - Service Urgences"
        />
      )}
    </>
  );
}
