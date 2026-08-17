import { useCallback, useState } from 'react';
import usePolling from '@/hooks/usePolling';
import { fetchPatientAppointments, downloadAppointmentsPDF } from '@/services/rendezvousService';
import { FILTER_RDV } from '@/lib/constants';

// Synchronisation du statut (PLANIFIE -> PRESENT après passage au kiosk) via le
// polling existant du projet (usePolling), même mécanique que le moniteur, la
// file d'attente et le médecin. Aucun endpoint SSE n'est dédié aux RDV.
const POLL_INTERVAL = 5000;

export default function useMesRendezVous(patientId) {
  const [filter, setFilter] = useState(FILTER_RDV.ALL);
  const [exporting, setExporting] = useState(false);

  const fetchList = useCallback(async () => {
    if (!patientId) return [];
    const res = await fetchPatientAppointments(patientId, filter);
    return res.data || [];
  }, [patientId, filter]);

  // usePolling initialise `data` à null : normalisation pour garantir un tableau
  // (le défaut de déstructuration ne s'applique pas à null -> crash rendu sinon).
  const { data: rawData, error, loading } = usePolling(
    fetchList,
    POLL_INTERVAL,
    [patientId, filter]
  );
  const appointments = rawData ?? [];

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
