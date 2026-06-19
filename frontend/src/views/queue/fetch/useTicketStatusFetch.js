import { useCallback } from 'react';
import usePolling from '../../../hooks/usePolling.js';
import { getTicketStatus } from '../../../services/ticketService.js';

export default function useTicketStatusFetch(ticketId) {
  const invalidId = Number.isNaN(ticketId);

  const fetchStatus = useCallback(async () => {
    if (invalidId) throw new Error('Identifiant de ticket invalide.');
    return getTicketStatus(ticketId);
  }, [ticketId, invalidId]);

  const { data, error, loading } = usePolling(fetchStatus, 10000, [ticketId]);

  return { data, error, loading, invalidId };
}
