import { useCallback } from 'react';
import usePolling from '../../../hooks/usePolling.js';
import { getActiveQueue } from '../../../services/ticketService.js';

export default function useMoniteurQueue() {
  const fetchQueue = useCallback(async () => {
    const response = await getActiveQueue();
    if (!response.success) throw new Error('Connexion au serveur impossible.');
    return response.data;
  }, []);

  const { data: queue, error, loading } = usePolling(fetchQueue, 5000);

  return { queue, error, loading };
}
