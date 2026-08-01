import { useState } from 'react';
import StatusMessage from '../../components/ui/StatusMessage.jsx';
import MoniteurCurrentCall from '../../components/moniteur/MoniteurCurrentCall.jsx';
import MoniteurWaitingList from '../../components/moniteur/MoniteurWaitingList.jsx';
import useMoniteurQueue from './fetch/useMoniteurQueue.js';
import { playEmergencySound } from '../../utils/soundAlert.js'; // Ajuste le chemin si besoin

export default function MoniteurView() {
  const { queue, error, loading } = useMoniteurQueue();
  const [audioReady, setAudioReady] = useState(false);

  // Débloque l'audio du navigateur lors du clic
  const enableAudio = () => {
    playEmergencySound('ORANGE'); // Joue un petit bip pour tester et débloquer
    setAudioReady(true);
  };

  if (error) {
    return (
      <div className="moniteur">
        <StatusMessage variant="error" message={error} />
      </div>
    );
  }

  if (loading && !queue) {
    return (
      <div className="moniteur">
        <StatusMessage variant="loading" message="Chargement…" />
      </div>
    );
  }

  return (
    <div className="moniteur">
      {/* Bouton pour débloquer l'audio au démarrage */}
      {!audioReady && (
        <div className="mb-4 text-center">
          <button
            onClick={enableAudio}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Activer les alertes sonores
          </button>
        </div>
      )}

      <h1 className="moniteur-title">Salle d&apos;attente</h1>
      <MoniteurCurrentCall current={queue?.current} />
      <section className="moniteur-next">
        <p className="moniteur-label">Prochains numéros (priorité urgences)</p>
        <MoniteurWaitingList waiting={queue?.waiting || []} />
      </section>
    </div>
  );
}