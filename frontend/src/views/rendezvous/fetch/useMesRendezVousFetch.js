import { useEffect, useState } from 'react';
import { fetchPatientAppointments } from '../../../services/rendezvousService.js';

const DEMO_PATIENT_ID = 1;

export default function useMesRendezVousFetch() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchPatientAppointments(DEMO_PATIENT_ID)
      .then((data) => {
        if (!cancelled) setAppointments(data);
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
  }, []);

  return { appointments, isLoading, error, demoPatientId: DEMO_PATIENT_ID };
}
