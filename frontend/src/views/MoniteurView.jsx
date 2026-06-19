import { useEffect, useState } from 'react';
import { getActiveQueue } from '../services/ticketService.js';

function PriorityBadge({ level }) {
  if (!level) return null;
  return <span className={`priority-badge priority-badge--${level.toLowerCase()}`}>{level}</span>;
}

export default function MoniteurView() {
  const [queue, setQueue] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await getActiveQueue();
        if (!cancelled && response.success) {
          setQueue(response.data);
          setError(null);
        }
      } catch {
        if (!cancelled) setError('Connexion au serveur impossible.');
      }
    }

    load();
    const interval = setInterval(load, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (error) {
    return (
      <div className="moniteur">
        <p className="moniteur-error">{error}</p>
      </div>
    );
  }

  if (!queue) {
    return (
      <div className="moniteur">
        <p className="moniteur-loading">Chargement…</p>
      </div>
    );
  }

  const current = queue.current;
  const currentNum = current?.numero;
  const box = current?.numero_box;

  return (
    <div className="moniteur">
      <h1 className="moniteur-title">Salle d&apos;attente</h1>

      <section className="moniteur-current">
        <p className="moniteur-label">
          {current?.statut === 'EN_CONSULTATION' ? 'En consultation' : 'En cours d&apos;appel'}
        </p>
        <p className="moniteur-numero">{currentNum != null ? `#${currentNum}` : '—'}</p>
        {box && <p className="moniteur-box">Box {box}</p>}
        {current?.niveau_priorite && (
          <p className="moniteur-priority">
            <PriorityBadge level={current.niveau_priorite} />
          </p>
        )}
      </section>

      <section className="moniteur-next">
        <p className="moniteur-label">Prochains numéros (priorité urgences)</p>
        {queue.waiting.length === 0 ? (
          <p className="moniteur-empty">Aucun patient en attente</p>
        ) : (
          <ul className="moniteur-list">
            {queue.waiting.slice(0, 8).map((t) => (
              <li key={t.id_ticket}>
                #{t.numero}
                {t.niveau_priorite && (
                  <span className={`moniteur-priority-dot moniteur-priority-dot--${t.niveau_priorite.toLowerCase()}`} />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
