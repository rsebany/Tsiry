import { useEffect, useState } from 'react';
import { registerPresence, searchTodayAppointments } from '../../../services/rendezvousService.js';

export default function useKiosqueRegister() {
  const [idRdv, setIdRdv] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Recherche fallback (nom / téléphone)
  const [searchNom, setSearchNom] = useState('');
  const [searchTelephone, setSearchTelephone] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!success) return undefined;
    const timer = setTimeout(() => {
      setSuccess(null);
      setIdRdv('');
      setResults([]);
      setSearched(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, [success]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const rdv = await registerPresence(idRdv);
      setSuccess(rdv);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Enregistrement refusé. Dirigez-vous vers le guichet d'accueil."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchNom.trim() && !searchTelephone.trim()) {
      setSearchError('Saisissez un nom ou un numéro de téléphone.');
      return;
    }
    setSearching(true);
    setSearchError(null);
    setSearched(false);

    try {
      const found = await searchTodayAppointments({
        nom: searchNom.trim() || undefined,
        telephone: searchTelephone.trim() || undefined,
      });
      setResults(found);
      setSearched(true);
    } catch (err) {
      setSearchError(
        err.response?.data?.error || 'Recherche impossible pour le moment.'
      );
    } finally {
      setSearching(false);
    }
  }

  async function handleSelectRdv(rdvId) {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const rdv = await registerPresence(rdvId);
      setSuccess(rdv);
      setResults([]);
      setSearched(false);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Enregistrement refusé. Dirigez-vous vers le guichet d'accueil."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetSearch() {
    setSearchNom('');
    setSearchTelephone('');
    setResults([]);
    setSearchError(null);
    setSearched(false);
  }

  return {
    idRdv,
    setIdRdv,
    loading,
    success,
    error,
    handleSubmit,
    searchNom,
    setSearchNom,
    searchTelephone,
    setSearchTelephone,
    results,
    searching,
    searchError,
    searched,
    handleSearch,
    handleSelectRdv,
    resetSearch,
  };
}
