import { useEffect, useState } from 'react';
import { getActiveQueue } from '../services/ticketService.js';

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

  const currentNum = queue.current?.numero;

  return (
    <div className="moniteur">
      <h1 className="moniteur-title">Salle d&apos;attente</h1>

      <section className="moniteur-current">
        <p className="moniteur-label">En cours d&apos;appel</p>
        <p className="moniteur-numero">{currentNum != null ? `#${currentNum}` : '—'}</p>
      </section>

      <section className="moniteur-next">
        <p className="moniteur-label">Prochains numéros</p>
        {queue.waiting.length === 0 ? (
          <p className="moniteur-empty">Aucun patient en attente</p>
        ) : (
          <ul className="moniteur-list">
            {queue.waiting.slice(0, 8).map((t) => (
              <li key={t.id_ticket}>#{t.numero}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
