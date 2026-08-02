import { useState } from 'react';
import { fetchSpecialites, fetchMedecins, bookAppointment } from '@/services/rendezvousService';

// ============ OWNER: Nathan (UC1 - formulaire de réservation) ============
export default function useBookAppointment() {
  const [specialites, setSpecialites] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [loadingMedecins, setLoadingMedecins] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [lastRdv, setLastRdv] = useState(null);
  const [conflict, setConflict] = useState(false);

  async function loadSpecialites() {
    try {
      const data = await fetchSpecialites();
      setSpecialites(data);
    } catch {
      setSpecialites([]);
    }
  }

  async function loadMedecins(specialite) {
    setLoadingMedecins(true);
    setMedecins([]);
    try {
      const data = await fetchMedecins(specialite || undefined);
      setMedecins(data);
    } catch {
      setMedecins([]);
    } finally {
      setLoadingMedecins(false);
    }
  }

  async function submit(values) {
    setBookingError(null);
    setConflict(false);
    setLastRdv(null);
    try {
      const rdv = await bookAppointment(values);
      setLastRdv(rdv);
      return { success: true, rdv };
    } catch (err) {
      const status = err.response?.status;
      if (status === 409) {
        setConflict(true);
      }
      setBookingError(err.response?.data?.error || 'Réservation impossible.');
      return { success: false, error: err.response?.data?.error };
    }
  }

  return {
    specialites,
    medecins,
    loadingMedecins,
    bookingError,
    conflict,
    lastRdv,
    loadSpecialites,
    loadMedecins,
    submit,
  };
}
