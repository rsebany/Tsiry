import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { registerPresence, searchTodayAppointments } from '@/services/rendezvousService';

// ============ OWNER: Burin (UC3 - enregistrement à l'arrivée) ============
// Scan QR : /kiosque?id_rdv=N → enregistrement automatique au montage.
const IDLE_TIMEOUT_MS = 120000;

export default function useKiosqueRegister() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState('numero');
  const [numero, setNumero] = useState('');
  const [search, setSearch] = useState({ nom: '', telephone: '' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmed, setConfirmed] = useState(null);
  const timerRef = useRef(null);
  const idleTimerRef = useRef(null);
  const autoHandledRef = useRef(false);

  const resetAll = useCallback(() => {
    setNumero('');
    setSearch({ nom: '', telephone: '' });
    setResults([]);
    setError(null);
    setConfirmed(null);
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(resetAll, IDLE_TIMEOUT_MS);
  }, [resetAll]);

  useEffect(() => {
    resetIdleTimer();
    window.addEventListener('pointerdown', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('pointerdown', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
    };
  }, [resetIdleTimer]);

  // Scan QR : si ?id_rdv= est présent et valide, enregistrement auto (une seule fois),
  // puis purge de la query pour éviter une re-registration au retour/reload.
  useEffect(() => {
    if (autoHandledRef.current) return;
    const raw = searchParams.get('id_rdv');
    if (raw == null || raw === '') return;
    const id = Number(raw);
    if (!Number.isInteger(id) || id <= 0) return;
    autoHandledRef.current = true;
    setSearchParams({}, { replace: true });
    register(id);
  }, [searchParams, setSearchParams]);

  function scheduleReset() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(resetAll, 6000);
  }

  async function register(idRdv) {
    setLoading(true);
    setError(null);
    try {
      const rdv = await registerPresence(idRdv);
      setConfirmed(rdv);
      scheduleReset();
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.error || 'Enregistrement impossible.');
      setConfirmed(null);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }

  async function handleNumeroSubmit(e) {
    e?.preventDefault();
    if (!numero) return;
    await register(numero);
  }

  async function handleSearchSubmit(e) {
    e?.preventDefault();
    if (!search.nom && !search.telephone) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchTodayAppointments(search);
      setResults(data);
      if (data.length === 0) {
        setError('Aucun rendez-vous trouvé pour aujourd\u2019hui.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Recherche impossible.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return {
    mode,
    setMode,
    numero,
    setNumero,
    search,
    setSearch,
    results,
    loading,
    error,
    confirmed,
    register,
    handleNumeroSubmit,
    handleSearchSubmit,
    resetAll,
  };
}
