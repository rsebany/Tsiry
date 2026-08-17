import { useCallback, useEffect, useMemo, useRef } from 'react';
import usePolling from '@/hooks/usePolling';
import { getActiveQueue } from '@/services/ticketService';
import { playEmergencySound } from '@/utils/soundAlert';
import { POLLING } from '@/lib/constants';

const PRIORITY_ORDER = { ROUGE: 0, ORANGE: 1, VERT: 2 };

const MESSAGES = {
  ROUGE: {
    color: 'red',
    text: "Misy marary samy paritra eo amin'ny fandraisana ankehitriny. Mankasitraka.",
  },
  ORANGE: {
    color: 'orange',
    text: "Misy marary manan-danja antsoina alohan'ny mahazatra. Misaotra.",
  },
  DEFAULT: {
    color: 'green',
    text: "Manomana ny karatra mamaritra toeranao ary miandry ny antsoinao.",
  },
};

export default function useMoniteurQueue() {
  const previousCriticalIdsRef = useRef(new Set());

  const fetchQueue = useCallback(async () => {
    const data = await getActiveQueue();
    return data;
  }, []);

  const { data: queue, error, loading } = usePolling(fetchQueue, POLLING.MONITEUR);

  const waiting = useMemo(() => {
    const list = queue?.waiting || [];
    return [...list].sort((a, b) => {
      const pa = PRIORITY_ORDER[a.niveau_priorite] ?? 99;
      const pb = PRIORITY_ORDER[b.niveau_priorite] ?? 99;
      if (pa !== pb) return pa - pb;
      return a.numero - b.numero;
    });
  }, [queue]);

  const stats = useMemo(() => ({
    waiting: waiting.length,
    rouge: waiting.filter((t) => t.niveau_priorite === 'ROUGE').length,
    orange: waiting.filter((t) => t.niveau_priorite === 'ORANGE').length,
    vert: waiting.filter((t) => t.niveau_priorite === 'VERT').length,
  }), [waiting]);

  const message = useMemo(() => {
    if (stats.rouge > 0) return MESSAGES.ROUGE;
    if (stats.orange > 0) return MESSAGES.ORANGE;
    return MESSAGES.DEFAULT;
  }, [stats]);

  useEffect(() => {
    const currentCriticalIds = new Set();
    let shouldTriggerSound = false;
    let highestPriority = 'ORANGE';

    waiting.forEach((ticket) => {
      if (ticket.niveau_priorite === 'ROUGE' || ticket.niveau_priorite === 'ORANGE') {
        const id = ticket.id_ticket;
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
  }, [waiting]);

  return {
    queue: { ...queue, waiting },
    stats,
    message,
    error,
    loading,
  };
}
