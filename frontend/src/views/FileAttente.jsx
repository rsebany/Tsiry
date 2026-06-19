import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  getFileAttente,
  appelerProchainTicket,
  terminerTicket,
} from '../services/ticketService.js';

export default function FileAttente({ refreshTrigger }) {
  const [fileAttente, setFileAttente] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ en_attente: 0, appele: 0, cloture: 0 });

  async function chargerFileAttente() {
    try {
      setLoading(true);
      const response = await getFileAttente();
      if (response.success) {
        const tickets = response.data.tickets;
        setFileAttente(tickets);
        setStats({
          en_attente: tickets.filter((t) => t.statut === 'EN_ATTENTE').length,
          appele: tickets.filter((t) => t.statut === 'APPELE').length,
          cloture: tickets.filter((t) => t.statut === 'CLOTURE').length,
        });
      }
    } catch {
      toast.error('Erreur lors du chargement de la file');
    } finally {
      setLoading(false);
    }
  }

  async function handleAppeler() {
    try {
      const response = await appelerProchainTicket();
      if (response.success) {
        toast.success(`Patient ${response.data.numero} appelé`);
        chargerFileAttente();
      } else {
        toast.error(response.message || 'Aucun patient en attente');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur lors de l\'appel');
    }
  }

  async function handleTerminer(id, numero) {
    try {
      const response = await terminerTicket(id);
      if (response.success) {
        toast.success(`Ticket ${numero} terminé`);
        chargerFileAttente();
      }
    } catch {
      toast.error('Erreur lors de la terminaison');
    }
  }

  useEffect(() => {
    chargerFileAttente();
    const interval = setInterval(chargerFileAttente, 5000);
    return () => clearInterval(interval);
  }, [refreshTrigger]);

  if (loading && fileAttente.length === 0) {
    return (
      <div className="card">
        <p className="status status--loading">Chargement de la file d&apos;attente…</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="file-attente-header">
        <h2>File d&apos;attente active</h2>
        <button type="button" className="btn-call" onClick={handleAppeler}>
          Appeler prochain patient
        </button>
      </div>

      <div className="file-attente-stats">
        <span className="stat stat--wait">{stats.en_attente} en attente</span>
        <span className="stat stat--called">{stats.appele} appelés</span>
        <span className="stat stat--done">{stats.cloture} terminés</span>
      </div>

      {fileAttente.length === 0 ? (
        <p className="empty-queue">Aucun ticket pour le moment</p>
      ) : (
        <div className="queue-table-wrap">
          <table className="queue-table">
            <thead>
              <tr>
                <th>N°</th>
                <th>Patient</th>
                <th>Heure</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {fileAttente.map((ticket) => (
                <tr key={ticket.id_ticket} data-statut={ticket.statut}>
                  <td>#{ticket.numero}</td>
                  <td>
                    {ticket.patient_nom} {ticket.patient_prenom}
                  </td>
                  <td>{new Date(ticket.heure_creation).toLocaleTimeString('fr-FR')}</td>
                  <td>{ticket.statut}</td>
                  <td>
                    {ticket.statut === 'APPELE' && (
                      <button
                        type="button"
                        className="btn-finish"
                        onClick={() => handleTerminer(ticket.id_ticket, ticket.numero)}
                      >
                        Terminer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
