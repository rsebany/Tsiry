import { useState } from 'react';
import { getHistoriquePatient } from '@/services/urgenceService';
import { errorMessage } from '@/services/api';

// ============ OWNER: Clova / Orneda (historique patient) ============
// // TODO Clova: passer le triage dashboard à cette feature si besoin (routes /urgences/triage-dashboard).
export default function useHistoriquePatient() {
  const [patientId, setPatientId] = useState('');
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function search(id) {
    const value = String(id || patientId).trim();
    if (!value) return;
    setLoading(true);
    setError(null);
    setHistory(null);
    try {
      const data = await getHistoriquePatient(value);
      setHistory(data || []);
    } catch (err) {
      setError(errorMessage(err, 'Tsy hita ny tantara'));
    } finally {
      setLoading(false);
    }
  }

  return { patientId, setPatientId, history, loading, error, search };
}
