import { useEffect, useState } from 'react';
import { fetchPatientAppointments, downloadAppointmentsPDF } from '@/services/rendezvousService';
import { FILTER_RDV } from '@/lib/constants';

// ============ OWNER: Nathan (UC2 - liste des rendez-vous) ============
// // TODO Nathan: pagination complète (le backend renvoie `pagination`).
export default function useMesRendezVous(patientId) {
  const [filter, setFilter] = useState(FILTER_RDV.ALL);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!patientId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchPatientAppointments(patientId, filter)
      .then((res) => {
        if (!cancelled) setAppointments(res.data || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.error || 'Erreur de chargement');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [patientId, filter]);

  async function exportPDF() {
    if (!patientId) return;
    setExporting(true);
    try {
      await downloadAppointmentsPDF(patientId);
    } finally {
      setExporting(false);
    }
  }

  return { filter, setFilter, appointments, loading, error, exportPDF, exporting };
}
