import { Link, useParams } from 'react-router-dom';
import Card from '../../components/ui/Card.jsx';
import StatusMessage from '../../components/ui/StatusMessage.jsx';
import TicketStatusCards from '../../components/tickets/TicketStatusCards.jsx';
import useTicketStatusFetch from './fetch/useTicketStatusFetch.js';

export default function TicketStatusView() {
  const { id } = useParams();
  const ticketId = parseInt(id, 10);
  const { data, error, loading, invalidId } = useTicketStatusFetch(ticketId);

  if (invalidId) {
    return (
      <Card>
        <StatusMessage variant="error" message="Identifiant de ticket invalide." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <StatusMessage variant="error" message={error} />
        <Link to="/file-attente">Retour à la file d&apos;attente</Link>
      </Card>
    );
  }

  if (loading && !data) {
    return (
      <Card>
        <StatusMessage variant="loading" message="Chargement…" />
      </Card>
    );
  }

  return (
    <Card title="Salle d'attente" className="ticket-status-view">
      <TicketStatusCards data={data} ticketId={ticketId} />
      <p>
        <Link to="/file-attente">Voir la file d&apos;attente</Link>
      </p>
    </Card>
  );
}
