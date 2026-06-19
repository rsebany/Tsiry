import Card from '../ui/Card.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import StatusMessage from '../ui/StatusMessage.jsx';
import PriorityBadge from './PriorityBadge.jsx';
import QueueStats from './QueueStats.jsx';
import QueueWaitingTable from './QueueWaitingTable.jsx';
import useFileAttenteFetch from './fetch/useFileAttenteFetch.js';
import { formatPatientName, isActiveStatut } from '../../utils/ticketUtils.js';

export default function FileAttentePanel({ refreshTrigger }) {
  const { fileAttente, stats, loading, handleAppeler, handleTerminer } =
    useFileAttenteFetch(refreshTrigger);

  if (loading && fileAttente.length === 0) {
    return (
      <Card>
        <StatusMessage variant="loading" message="Chargement de la file d'attente…" />
      </Card>
    );
  }

  return (
    <Card>
      <div className="file-attente-header">
        <h2>File d&apos;attente active</h2>
        <button type="button" className="btn-call" onClick={handleAppeler}>
          Appeler prochain patient
        </button>
      </div>

      <QueueStats {...stats} />

      {fileAttente.length === 0 ? (
        <EmptyState message="Aucun ticket pour le moment" />
      ) : (
        <QueueWaitingTable
          columns={['N°', 'Patient', 'Priorité', 'Heure', 'Statut', 'Box', 'Action']}
        >
          {fileAttente.map((ticket) => (
            <tr key={ticket.id_ticket} data-statut={ticket.statut}>
              <td>#{ticket.numero}</td>
              <td>{formatPatientName(ticket)}</td>
              <td>
                <PriorityBadge level={ticket.niveau_priorite} />
                {!ticket.niveau_priorite && '—'}
              </td>
              <td>{new Date(ticket.heure_creation).toLocaleTimeString('fr-FR')}</td>
              <td>{ticket.statut}</td>
              <td>{ticket.numero_box || '—'}</td>
              <td>
                {isActiveStatut(ticket.statut) && (
                  <button
                    type="button"
                    className="btn-finish"
                    onClick={() => handleTerminer(ticket.id_ticket, ticket.numero)}
                  >
                    Clôturer
                  </button>
                )}
              </td>
            </tr>
          ))}
        </QueueWaitingTable>
      )}
    </Card>
  );
}
