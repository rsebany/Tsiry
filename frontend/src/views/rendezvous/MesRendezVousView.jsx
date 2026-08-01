import { Link } from 'react-router-dom';
import { checkIsEmptyState } from '@/services/rendezvousUtils';
import { downloadAppointmentsPDF } from '@/services/rendezvousService';
import AppointmentCard from '@/components/appointments/AppointmentCard';
import StatusMessage from '@/components/ui/StatusMessage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useMesRendezVousFetch from './fetch/useMesRendezVousFetch';

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
        <CardContent className="pt-6">
          <StatusMessage variant="loading" message="Chargement de vos données médicales…" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <StatusMessage variant="error" message={error} />
        </CardContent>
      </Card>
    );
  }

  // Configuration des onglets de filtrage
  const tabs = [
    { id: 'all', label: 'Tous' },
    { id: 'upcoming', label: 'À venir' },
    { id: 'past', label: 'Passés' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mon Espace Santé</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Barre d'onglets de filtrage */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-3">
          {tabs.map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Affichage des rendez-vous ou état vide */}
        {checkIsEmptyState(appointments) ? (
          <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200 my-4">
            <p className="font-medium">
              {filter === 'upcoming' && "Vous n'avez aucun rendez-vous à venir."}
              {filter === 'past' && "Vous n'avez aucun rendez-vous passé."}
              {filter === 'all' && "Vous n'avez aucun rendez-vous planifié ou passé."}
            </p>
            <p className="mt-2 text-sm">
              <Link
                to="/patient/rendez-vous/nouveau"
                className="text-blue-600 hover:underline font-semibold"
              >
                Prendre un nouveau rendez-vous
              </Link>
            </p>
          </div>
        ) : (
          <div className="appointments-list space-y-4">
            {appointments.map((rdv) => (
              <AppointmentCard key={rdv.id_rdv} rdv={rdv} />
            ))}
          </div>
        )}

        {/* Actions bas de page */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/patient/rendez-vous/nouveau"
            className="text-blue-600 hover:underline font-medium text-sm"
          >
            + Prendre un nouveau rendez-vous
          </Link>

          {patientId && (
            <button
              type="button"
              onClick={() => downloadAppointmentsPDF(patientId)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-sm px-4 py-2 rounded-md transition-colors"
            >
              Télécharger l'historique (PDF)
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}