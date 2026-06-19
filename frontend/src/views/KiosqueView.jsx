import { useState, useEffect } from 'react';
import { registerPresence } from '../services/rendezvousService.js';

export default function KiosqueView() {
  const [idRdv, setIdRdv] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!success) return undefined;
    const timer = setTimeout(() => {
      setSuccess(null);
      setIdRdv('');
    }, 5000);
    return () => clearTimeout(timer);
  }, [success]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const rdv = await registerPresence(idRdv);
      setSuccess(rdv);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Enregistrement refusé. Dirigez-vous vers le guichet d'accueil."
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="kiosque">
        <div className="kiosque-panel kiosque-panel--success">
          <h1>Enregistrement réussi</h1>
          <p>Votre présence est signalée. Veuillez vous installer en salle d&apos;attente.</p>
          <p className="kiosque-detail">RDV #{success.id_rdv} — Statut : {success.statut}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="kiosque">
      <div className="kiosque-panel">
        <h1>Borne d&apos;accueil</h1>
        <p>Saisissez le numéro de votre rendez-vous</p>

        {error && <p className="kiosque-error">{error}</p>}

        <form onSubmit={handleSubmit} className="kiosque-form">
          <input
            type="number"
            inputMode="numeric"
            className="kiosque-input"
            value={idRdv}
            onChange={(e) => setIdRdv(e.target.value)}
            placeholder="N° rendez-vous"
            required
            disabled={loading}
            autoFocus
          />
          <button type="submit" className="kiosque-btn" disabled={loading || !idRdv}>
            {loading ? 'Vérification…' : "Confirmer ma présence"}
          </button>
        </form>
      </div>
    </div>
  );
}
