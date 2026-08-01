import { useEffect, useState } from 'react';
import { fetchPatientAppointments } from '../../../services/rendezvousService.js';
import { useAuth } from '../../../contexts/AuthContext.jsx'; // Import du hook personnalisé

export default function useMesRendezVousFetch() {
  // Utilisation directe du hook useAuth()
  const { user } = useAuth();
  const patientId = user?.id; // L'ID réel du patient connecté

  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'upcoming' | 'past'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si l'utilisateur n'est pas encore chargé ou connecté, on ne lance pas la requête
    if (!patientId) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    // Envoi de l'ID dynamique et du filtre à l'API
    fetchPatientAppointments(patientId, filter)
      .then((data) => {
        if (!cancelled) setAppointments(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err.response?.data?.error ||
              "Impossible de charger l'historique des rendez-vous."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [patientId, filter]);

  return {
    appointments,
    isLoading,
    error,
    filter,
    setFilter,
    patientId,
  };
}