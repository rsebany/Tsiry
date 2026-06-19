import { useEffect, useState } from 'react';
import { registerPresence } from '../../../services/rendezvousService.js';

export default function useKiosqueRegister() {
  const [idRdv, setIdRdv] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!success) return undefined;
    const timer = setTimeout(() => {
      setSuccess(null);
      setIdRdv('');
    }, 5000);
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

  return { idRdv, setIdRdv, loading, success, error, handleSubmit };
}
