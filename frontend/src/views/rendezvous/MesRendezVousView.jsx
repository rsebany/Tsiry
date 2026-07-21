import { Link } from 'react-router-dom';
import { checkIsEmptyState } from '../../services/rendezvousUtils.js';
import { downloadAppointmentsPDF } from '../../services/rendezvousService.js';
import Card from '../../components/ui/Card.jsx';
import StatusMessage from '../../components/ui/StatusMessage.jsx';
import AppointmentCard from '../../components/appointments/AppointmentCard.jsx';
import useMesRendezVousFetch from './fetch/useMesRendezVousFetch.js';

export default function MesRendezVousView() {
  const {
    appointments,
    isLoading,
    error,
    filter,
    setFilter,
    patientId,
  } = useMesRendezVousFetch();

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

  return (
    <Card title="Mon Espace Santé">
      {/* Barre d'onglets de filtrage */}
      <div className="filter-tabs" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setFilter('all')}
          className={`btn-tab ${filter === 'all' ? 'active' : ''}`}
          style={{
            padding: '0.4rem 0.8rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: filter === 'all' ? '#1E3A8A' : '#f3f4f6',
            color: filter === 'all' ? '#fff' : '#000',
            cursor: 'pointer',
          }}
        >
          Tous
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`btn-tab ${filter === 'upcoming' ? 'active' : ''}`}
          style={{
            padding: '0.4rem 0.8rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: filter === 'upcoming' ? '#1E3A8A' : '#f3f4f6',
            color: filter === 'upcoming' ? '#fff' : '#000',
            cursor: 'pointer',
          }}
        >
          À venir
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`btn-tab ${filter === 'past' ? 'active' : ''}`}
          style={{
            padding: '0.4rem 0.8rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: filter === 'past' ? '#1E3A8A' : '#f3f4f6',
            color: filter === 'past' ? '#fff' : '#000',
            cursor: 'pointer',
          }}
        >
          Passés
        </button>
      </div>

      {/* Rendu conditionnel si aucun rendez-vous */}
      {checkIsEmptyState(appointments) ? (
        <div className="empty-state">
          <p>Vous n&apos;avez aucun rendez-vous dans cette catégorie.</p>
          <p style={{ marginTop: '0.5rem' }}>
            <Link to="/prendre-rendez-vous">Prendre un nouveau rendez-vous</Link>
          </p>
        </div>
      ) : (
        /* Liste des rendez-vous */
        <div className="appointments-list">
          {appointments.map((rdv) => (
            <AppointmentCard key={rdv.id_rdv} rdv={rdv} />
          ))}
        </div>
      )}

      {/* Barre d'actions du bas */}
      <div
        style={{
          marginTop: '1.5rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <Link to="/prendre-rendez-vous">Prendre un nouveau rendez-vous</Link>

        {patientId && (
          <button
            onClick={() => downloadAppointmentsPDF(patientId)}
            className="btn-secondary flex items-center gap-2"
          >
            Télécharger l'historique (PDF)
          </button>
        )}
      </div>
    </Card>
  );
}