import { Link } from 'react-router-dom';
import { checkIsEmptyState } from '../../services/rendezvousUtils.js';
import Card from '../../components/ui/card.jsx';
import StatusMessage from '../../components/ui/StatusMessage.jsx';
import AppointmentCard from '../../components/appointments/AppointmentCard.jsx';
import useMesRendezVousFetch from './fetch/useMesRendezVousFetch.js';

export default function MesRendezVousView() {
  const { appointments, isLoading, error, demoPatientId } = useMesRendezVousFetch();

  if (isLoading) {
    return (
      <Card>
        <StatusMessage variant="loading" message="Chargement de vos données médicales…" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <StatusMessage variant="error" message={error} />
      </Card>
    );
  }

  if (checkIsEmptyState(appointments)) {
    return (
      <Card title="Mon Espace Santé">
        <p>Vous n&apos;avez aucun rendez-vous planifié ou passé.</p>
        <p>
          <Link to="/prendre-rendez-vous">Prendre un nouveau rendez-vous</Link>
        </p>
      </Card>
    );
  }

  return (
    <Card title="Mon Espace Santé">
      <p className="status-hint">Patient démo (id {demoPatientId})</p>

      <div className="appointments-list">
        {appointments.map((rdv) => (
          <AppointmentCard key={rdv.id_rdv} rdv={rdv} />
        ))}
      </div>

      <p style={{ marginTop: '1rem' }}>
        <Link to="/prendre-rendez-vous">Prendre un nouveau rendez-vous</Link>
      </p>
    </Card>
  );
}
