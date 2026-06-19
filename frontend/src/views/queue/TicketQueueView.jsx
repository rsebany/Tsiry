import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import TicketGenerator from '../../components/queue/TicketGenerator.jsx';
import FileAttentePanel from '../../components/queue/FileAttentePanel.jsx';
import TicketThermique from '../../components/tickets/TicketThermique.jsx';

export default function TicketQueueView() {
  const [dernierTicket, setDernierTicket] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  function handleTicketGenerated(ticket) {
    setDernierTicket(ticket);
    setRefreshTrigger((prev) => prev + 1);
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="ticket-queue-grid">
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
