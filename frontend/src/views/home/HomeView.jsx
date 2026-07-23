import Card from '../../components/ui/card.jsx';
import StatusMessage from '../../components/ui/StatusMessage.jsx';
import useHomeFetch from './fetch/useHomeFetch.js';

export default function HomeView() {
  const { loading, data, error } = useHomeFetch();

  return (
    <Card title="Accueil" description="Bienvenue sur l'interface du système de gestion hospitalière.">
      <div className="status-block">
        <h3>État de l&apos;API</h3>
        {loading && <StatusMessage variant="loading" message="Connexion en cours…" />}
        {error && (
          <StatusMessage
            variant="error"
            message={error}
            hint="Vérifiez que le backend tourne sur le port 3000."
          />
        )}
        {data && (
          <StatusMessage variant="ok">
            {data.service} — <strong>{data.status}</strong>
          </StatusMessage>
        )}
      </div>
    </Card>
  );
}
