import { useCallback, useEffect, useRef, useState } from 'react';
import { registerPresence, searchTodayAppointments } from '@/services/rendezvousService';

// ============ OWNER: Burin (UC3 - enregistrement à l'arrivée) ============
// // TODO Burin: lire l'id_rdv depuis un QR code scanné (location/query) quand le scan sera branché.
export default function useKiosqueRegister() {
  const [mode, setMode] = useState('numero');
  const [numero, setNumero] = useState('');
  const [search, setSearch] = useState({ nom: '', telephone: '' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmed, setConfirmed] = useState(null);
  const timerRef = useRef(null);

  const resetAll = useCallback(() => {
    setNumero('');
    setSearch({ nom: '', telephone: '' });
    setResults([]);
    setError(null);
    setConfirmed(null);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

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
      setError(err.response?.data?.error || 'Tsy afaka misoratra.');
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
        setError('Tsy misy fotoana hita ho an\'ity androany ity.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Tsy afaka mitady.');
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
