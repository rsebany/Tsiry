import LegacyCard from '../ui/LegacyCard.jsx';
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
      <LegacyCard>
        <StatusMessage variant="loading" message="Chargement de la file d'attente…" />
      </LegacyCard>
    );
  }

  return (
    <LegacyCard>
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
          {fileAttente.map((ticket) => {
            const isUrgent =
              ticket.niveau_priorite === 'ROUGE' || ticket.niveau_priorite === 'ORANGE';

            return (
              <tr key={ticket.id_ticket} data-statut={ticket.statut}>
                <td>#{ticket.numero}</td>
                <td>{formatPatientName(ticket)}</td>
                <td className="items-center">
                  <PriorityBadge level={ticket.niveau_priorite} />
                  {!ticket.niveau_priorite && '—'}

                  {/* Badge visuel pulsant d'urgence */}
                  {isUrgent && (
                    <span
                      className="relative inline-flex h-3 w-3 ml-2 align-middle"
                      title={`Urgence ${ticket.niveau_priorite}`}
                    >
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          ticket.niveau_priorite === 'ROUGE' ? 'bg-red-500' : 'bg-orange-500'
                        }`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-3 w-3 ${
                          ticket.niveau_priorite === 'ROUGE' ? 'bg-red-600' : 'bg-orange-500'
                        }`}
                      />
                    </span>
                  )}
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
            );
          })}
        </QueueWaitingTable>
      )}
    </LegacyCard>
  );
}