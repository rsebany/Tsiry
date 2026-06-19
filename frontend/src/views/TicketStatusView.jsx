import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTicketStatus } from '../services/ticketService.js';

export default function TicketStatusView() {
  const { id } = useParams();
  const ticketId = parseInt(id, 10);
  const [data, setData] = useState(null);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    if (Number.isNaN(ticketId)) {
      setErreur('Identifiant de ticket invalide.');
      return;
    }

    let cancelled = false;

    async function fetchStatus() {
      try {
        const result = await getTicketStatus(ticketId);
        if (!cancelled) {
          setData(result);
          setErreur(null);
        }
      } catch {
        if (!cancelled) setErreur('Erreur de connexion au serveur.');
      }
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [ticketId]);

  if (Number.isNaN(ticketId)) {
    return (
      <section className="card">
        <p className="status status--error">Identifiant de ticket invalide.</p>
      </section>
    );
  }

  if (erreur) {
    return (
      <section className="card">
        <p className="status status--error">{erreur}</p>
        <Link to="/file-attente">Retour à la file d&apos;attente</Link>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="card">
        <p className="status status--loading">Chargement…</p>
      </section>
    );
  }

  return (
    <section className="card ticket-status-view">
      <h2>Salle d&apos;attente</h2>
      <p className="status-hint">Ticket #{ticketId} — mise à jour toutes les 10 s</p>

      <div className="ticket-status-card">
        <p className="ticket-status-label">Votre numéro</p>
        <p className="ticket-status-numero">{data.numero}</p>
      </div>

      <div className="ticket-status-card">
        <p className="ticket-status-label">Statut</p>
        <p className="ticket-status-statut">{data.statut}</p>
      </div>

      <div className="ticket-status-card ticket-status-highlight">
        <p>{data.message}</p>
      </div>

      <p>
        <Link to="/file-attente">Voir la file d&apos;attente</Link>
      </p>
    </section>
  );
}
