import StatusMessage from '../../components/ui/StatusMessage.jsx';
import MoniteurCurrentCall from '../../components/moniteur/MoniteurCurrentCall.jsx';
import MoniteurWaitingList from '../../components/moniteur/MoniteurWaitingList.jsx';
import useMoniteurQueue from './fetch/useMoniteurQueue.js';

export default function MoniteurView() {
  const { queue, error, loading } = useMoniteurQueue();

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
      <h1 className="moniteur-title">Salle d&apos;attente</h1>
      <MoniteurCurrentCall current={queue?.current} />
      <section className="moniteur-next">
        <p className="moniteur-label">Prochains numéros (priorité urgences)</p>
        <MoniteurWaitingList waiting={queue?.waiting || []} />
      </section>
    </div>
  );
}
