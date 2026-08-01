import { useEffect, useState } from 'react';
import { fetchPatientAppointments } from '@/services/rendezvousService';
import { useAuth } from '@/contexts/AuthContext';

export default function useMesRendezVous(patientId) {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!patientId) return;

    let cancelled = false;
    setIsLoading(true);

    fetchPatientAppointments(patientId)
      .then((data) => {
        if (!cancelled) {
          // Sécurité finale : on s'assure que React reçoit bien un tableau (Array)
          const safeArray = Array.isArray(data) ? data : (data?.data || []);
          setAppointments(safeArray);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.error || "Impossible de charger l'historique des rendez-vous.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [patientId]);

  return { appointments, isLoading, error };
}

export function usePatientAppointments() {
  const { user } = useAuth();
  return useMesRendezVous(user?.id);
}