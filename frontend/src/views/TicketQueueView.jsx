import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import TicketGenerator from './TicketGenerator.jsx';
import FileAttente from './FileAttente.jsx';
import TicketThermique from '../components/TicketThermique.jsx';

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
        <FileAttente refreshTrigger={refreshTrigger} />
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
