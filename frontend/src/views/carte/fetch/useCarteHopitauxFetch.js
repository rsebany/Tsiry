import { useEffect, useState } from 'react';
import { getHopitaux } from '../../../services/urgenceService.js';

export default function useCarteHopitauxFetch() {
  const [hopitaux, setHopitaux] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getHopitaux()
      .then((response) => {
        if (response.success) setHopitaux(response.data);
      })
      .catch(() => setError('Impossible de charger les hôpitaux.'));
  }, []);

  return { hopitaux, error };
}
