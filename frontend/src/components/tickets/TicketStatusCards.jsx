import PriorityBadge from '../queue/PriorityBadge.jsx';

export default function TicketStatusCards({ data, ticketId }) {
  return (
    <>
      <p className="status-hint">Ticket #{ticketId} — mise à jour toutes les 10 s</p>

      <div className="ticket-status-card">
        <p className="ticket-status-label">Votre numéro</p>
        <p className="ticket-status-numero">{data.numero}</p>
      </div>

      <div className="ticket-status-card">
        <p className="ticket-status-label">Statut</p>
        <p className="ticket-status-statut">{data.statut}</p>
      </div>

      {data.numero_box && (
        <div className="ticket-status-card">
          <p className="ticket-status-label">Box</p>
          <p className="ticket-status-statut">{data.numero_box}</p>
        </div>
      )}

      {data.niveau_priorite && (
        <div className="ticket-status-card">
          <p className="ticket-status-label">Priorité urgence</p>
          <PriorityBadge level={data.niveau_priorite} />
        </div>
      )}

      <div className="ticket-status-card ticket-status-highlight">
        <p>{data.message}</p>
      </div>
    </>
  );
}
