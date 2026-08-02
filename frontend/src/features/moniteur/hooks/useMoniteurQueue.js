import { useCallback, useEffect, useRef } from 'react';
import usePolling from '@/hooks/usePolling';
import { getActiveQueue } from '@/services/ticketService';
import { playEmergencySound } from '@/utils/soundAlert';
import { POLLING } from '@/lib/constants';

// ============ OWNER: Clova (UC9 - moniteur public) ============
// // TODO Clova: ajouter la détection du box attribué pour l'afficher plus tôt.
export default function useMoniteurQueue() {
  const previousCriticalIdsRef = useRef(new Set());

  const fetchQueue = useCallback(async () => {
    const data = await getActiveQueue();
    return data;
  }, []);

  const { data: queue, error, loading } = usePolling(fetchQueue, POLLING.MONITEUR);

  useEffect(() => {
    if (!queue) return;
    const ticketList = Array.isArray(queue) ? queue : queue.waiting || [];
    const currentCriticalIds = new Set();
    let shouldTriggerSound = false;
    let highestPriority = 'ORANGE';

    ticketList.forEach((ticket) => {
      if (ticket.niveau_priorite === 'ROUGE' || ticket.niveau_priorite === 'ORANGE') {
        const id = ticket.id_ticket || ticket.id;
        currentCriticalIds.add(id);
        if (!previousCriticalIdsRef.current.has(id)) {
          shouldTriggerSound = true;
          if (ticket.niveau_priorite === 'ROUGE') highestPriority = 'ROUGE';
        }
      }
    });

    if (shouldTriggerSound) {
      playEmergencySound(highestPriority);
    }
    previousCriticalIdsRef.current = currentCriticalIds;
  }, [queue]);

  return { queue, error, loading };
}
