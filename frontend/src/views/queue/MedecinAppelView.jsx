import Card from '../../components/ui/Card.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import PriorityBadge from '../../components/queue/PriorityBadge.jsx';
import QueueWaitingTable from '../../components/queue/QueueWaitingTable.jsx';
import useMedecinAppelQueue from './fetch/useMedecinAppelQueue.js';
import { formatPatientName } from '../../utils/ticketUtils.js';

export default function MedecinAppelView() {
  const { waiting, boxByTicket, setBoxByTicket, loadingId, handleTriggerCall } =
    useMedecinAppelQueue();

  return (
    <Card
      title="Appel en consultation"
      description="Envoyer un patient en box (UC10 — Clova). Les urgences ROUGE/ORANGE apparaissent en tête."
    >
      {waiting.length === 0 ? (
        <EmptyState message="Aucun patient en attente." />
      ) : (
        <QueueWaitingTable columns={['Ticket', 'Patient', 'Priorité', 'Box', '']}>
          {waiting.map((t) => (
            <tr key={t.id_ticket}>
              <td>#{t.numero}</td>
              <td>{formatPatientName(t)}</td>
              <td>
                <PriorityBadge level={t.niveau_priorite} />
              </td>
              <td>
                <input
                  type="text"
                  className="form-input form-input--inline"
                  placeholder="ex. A3"
                  value={boxByTicket[t.id_ticket] || ''}
                  onChange={(e) =>
                    setBoxByTicket({ ...boxByTicket, [t.id_ticket]: e.target.value })
                  }
                  disabled={loadingId === t.id_ticket}
                />
              </td>
              <td>
                <button
                  type="button"
                  className="btn-call"
                  onClick={() => handleTriggerCall(t)}
                  disabled={loadingId === t.id_ticket}
                >
                  Appeler
                </button>
              </td>
            </tr>
          ))}
        </QueueWaitingTable>
      )}
    </Card>
  );
}
