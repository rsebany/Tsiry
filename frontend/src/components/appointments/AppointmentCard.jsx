import { Link } from 'react-router-dom';
import { getBadgeColorByStatus } from '../../services/rendezvousUtils.js';

export default function AppointmentCard({ rdv }) {
  return (
    <article className="appointment-card">
      <div className="appointment-card-header">
        <strong>
          {new Date(rdv.date_heure).toLocaleDateString('fr-FR')} à{' '}
          {new Date(rdv.date_heure).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </strong>
        <span
          className="appointment-badge"
          style={{ backgroundColor: getBadgeColorByStatus(rdv.statut) }}
        >
          {rdv.statut}
        </span>
      </div>
      <p>
        <strong>Médecin :</strong> Dr {rdv.prenom_medecin} {rdv.nom_medecin}
      </p>
      <p>
        <strong>Spécialité :</strong> {rdv.specialite}
      </p>
      <p>
        <strong>Motif :</strong> {rdv.motif || 'Non précisé'}
      </p>
      <p>
        <strong>N° RDV :</strong> {rdv.id_rdv}
      </p>
    </article>
  );
}

export function BookingSuccessBanner({ rdv }) {
  return (
    <div className="status status--ok booking-success">
      <strong>Rendez-vous confirmé !</strong>
      <span>
        RDV #{rdv.id_rdv} — {new Date(rdv.date_heure).toLocaleString('fr-FR')} — Statut : {rdv.statut}
      </span>
      <Link to="/mes-rendez-vous" className="booking-success-link">
        Consulter mes rendez-vous
      </Link>
    </div>
  );
}
