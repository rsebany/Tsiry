import { Link } from 'react-router-dom';
import { getBadgeColorByStatus } from '../../services/rendezvousUtils.js';

export default function AppointmentCard({ rdv }) {
  const rdvDate = new Date(rdv.date_heure);
  const today = new Date();

  // 1. Vérification si la date correspond exactement à aujourd'hui
  const isToday = rdvDate.toDateString() === today.toDateString();

  // 2. Condition stricte : Date du jour ET statut PLANIFIE
  const showKioskButton = isToday && rdv.statut === 'PLANIFIE';

  return (
    <article className="appointment-card border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="appointment-card-header flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          {/* Numéro de RDV lisible */}
          <span className="bg-blue-100 text-blue-900 font-bold px-2.5 py-1 rounded text-sm border border-blue-200">
            RDV #{rdv.id_rdv}
          </span>
          <strong className="text-gray-900 text-sm">
            {rdvDate.toLocaleDateString('fr-FR')} à{' '}
            {rdvDate.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </strong>
        </div>

        {/* Statut du RDV */}
        <span
          className="appointment-badge px-2.5 py-1 rounded text-xs font-semibold text-white"
          style={{ backgroundColor: getBadgeColorByStatus(rdv.statut) }}
        >
          {rdv.statut}
        </span>
      </div>

      {/* Détails du rendez-vous */}
      <div className="space-y-1 text-sm text-gray-700">
        <p>
          <strong className="text-gray-900">Médecin :</strong> Dr {rdv.prenom_medecin} {rdv.nom_medecin}
        </p>
        <p>
          <strong className="text-gray-900">Spécialité :</strong> {rdv.specialite || 'Généraliste'}
        </p>
        <p>
          <strong className="text-gray-900">Motif :</strong> {rdv.motif || 'Non précisé'}
        </p>
      </div>

      {/* Bouton d'action "Aller au kiosk" si PLANIFIE + Date du jour */}
      {showKioskButton && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between bg-blue-50 p-3 rounded-md gap-2">
          <span className="text-xs text-blue-800 font-medium">
            Rendez-vous aujourd'hui ! S'enregistrer sur la borne.
          </span>
          <Link
            to={`/kiosque?id_rdv=${rdv.id_rdv}`}
            state={{ idRdv: rdv.id_rdv }}
            className="btn-primary text-xs px-3 py-2 rounded font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Aller au kiosk →
          </Link>
        </div>
      )}
    </article>
  );
}

export function BookingSuccessBanner({ rdv }) {
  return (
    <div className="status status--ok booking-success p-4 bg-green-50 border border-green-200 rounded-lg text-green-900 mb-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="bg-green-600 text-white font-bold text-xs px-2 py-0.5 rounded">
          RDV #{rdv.id_rdv}
        </span>
        <strong className="text-green-950">Rendez-vous confirmé !</strong>
      </div>
      <p className="text-sm text-green-800">
        {new Date(rdv.date_heure).toLocaleString('fr-FR')} — Statut : {rdv.statut}
      </p>
      <Link
        to="/mes-rendez-vous"
        className="booking-success-link text-sm font-semibold text-green-700 hover:underline mt-2 inline-block"
      >
        Consulter mes rendez-vous
      </Link>
    </div>
  );
}