import { useEffect, useState } from 'react';
import { checkHealth } from '../services/api.js';

export default function HomeView() {
  const [status, setStatus] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    let cancelled = false;

    checkHealth()
      .then((data) => {
        if (!cancelled) {
          setStatus({ loading: false, data, error: null });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setStatus({
            loading: false,
            data: null,
            error: error.message || 'Impossible de joindre l\'API',
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="card">
      <h2>Accueil</h2>
      <p>Bienvenue sur l&apos;interface du système de gestion hospitalière.</p>

      <div className="status-block">
        <h3>État de l&apos;API</h3>
        {status.loading && <p className="status status--loading">Connexion en cours…</p>}
        {status.error && (
          <p className="status status--error">
            {status.error}
            <span className="status-hint">Vérifiez que le backend tourne sur le port 3000.</span>
          </p>
        )}
        {status.data && (
          <p className="status status--ok">
            {status.data.service} — <strong>{status.data.status}</strong>
          </p>
        )}
      </div>
    </section>
  );
}
