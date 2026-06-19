import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getActiveQueue, triggerCall } from '../services/ticketService.js';

function PriorityBadge({ level }) {
  if (!level) return null;
  return <span className={`priority-badge priority-badge--${level.toLowerCase()}`}>{level}</span>;
}

export default function MedecinAppelView() {
  const [queue, setQueue] = useState(null);
  const [boxByTicket, setBoxByTicket] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  async function loadQueue() {
    try {
      const response = await getActiveQueue();
      if (response.success) setQueue(response.data);
    } catch {
      toast.error('Impossible de charger la file');
    }
  }

  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 8000);
    return () => clearInterval(interval);
  }, []);

  async function handleTriggerCall(ticket) {
    const box = boxByTicket[ticket.id_ticket];
    if (!box) {
      toast.error('Indiquez un numéro de box');
      return;
    }
    setLoadingId(ticket.id_ticket);
    try {
      const response = await triggerCall(ticket.id_ticket, box);
      if (response.success) {
        toast.success(`Ticket #${ticket.numero} → box ${box}`);
        loadQueue();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Appel impossible');
    } finally {
      setLoadingId(null);
    }
  }

  const waiting = queue?.waiting || [];

  return (
    <section className="card">
      <h2>Appel en consultation</h2>
      <p>Envoyer un patient en box (UC10 — Clova). Les urgences ROUGE/ORANGE apparaissent en tête.</p>

      {waiting.length === 0 ? (
        <p className="empty-queue">Aucun patient en attente.</p>
      ) : (
        <div className="queue-table-wrap">
          <table className="queue-table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Patient</th>
                <th>Priorité</th>
                <th>Box</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {waiting.map((t) => (
                <tr key={t.id_ticket}>
                  <td>#{t.numero}</td>
                  <td>
                    {t.patient_prenom} {t.patient_nom}
                  </td>
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
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
