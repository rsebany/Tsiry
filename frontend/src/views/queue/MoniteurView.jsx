import { useEffect, useRef, useState } from 'react';
import StatusMessage from '../../components/ui/StatusMessage.jsx';
import MoniteurCurrentCall from '../../components/moniteur/MoniteurCurrentCall.jsx';
import MoniteurWaitingList from '../../components/moniteur/MoniteurWaitingList.jsx';
import useMoniteurQueue from './fetch/useMoniteurQueue.js';
import { playEmergencySound } from '../../utils/soundAlert.js';

export default function MoniteurView({ tvMode = false }) {
  const { queue, error, loading } = useMoniteurQueue();
  const [audioReady, setAudioReady] = useState(false);
  const [flashCall, setFlashCall] = useState(false);
  const previousCurrentIdRef = useRef(null);

  useEffect(() => {
    const currentId = queue?.current?.id_ticket ?? null;
    if (currentId !== null && currentId !== previousCurrentIdRef.current) {
      previousCurrentIdRef.current = currentId;
      setFlashCall(true);
      const timer = setTimeout(() => setFlashCall(false), 3500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [queue?.current?.id_ticket]);

  const enableAudio = () => {
    playEmergencySound('ORANGE');
    setAudioReady(true);
  };

  if (error) {
    return (
      <div className={`moniteur ${tvMode ? 'moniteur-tv' : ''}`}>
        <StatusMessage variant="error" message={error} />
      </div>
    );
  }

  if (loading && !queue) {
    return (
      <div className={`moniteur ${tvMode ? 'moniteur-tv' : ''}`}>
        <StatusMessage variant="loading" message="Chargement…" />
      </div>
    );
  }

  return (
    <div className={`moniteur ${tvMode ? 'moniteur-tv' : ''}`}>
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
      <MoniteurCurrentCall current={queue?.current} flash={flashCall} />
      <section className="moniteur-next">
        <p className="moniteur-label">Prochains numéros (priorité urgences)</p>
        <MoniteurWaitingList waiting={queue?.waiting || []} />
      </section>
    </div>
  );
}
