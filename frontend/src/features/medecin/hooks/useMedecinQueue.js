import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import usePolling from '@/hooks/usePolling';
import { getActiveQueue, triggerCall } from '@/services/ticketService';
import { errorMessage } from '@/services/api';
import { POLLING } from '@/lib/constants';

const PRIORITY_ORDER = { ROUGE: 0, ORANGE: 1, VERT: 2 };

// ============ OWNER: Clova (UC9/UC10 - console médecin) ============
export default function useMedecinQueue() {
  const [boxByTicket, setBoxByTicket] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  const fetchQueue = useCallback(async () => getActiveQueue(), []);

  const { data: queue, error, loading, reload } = usePolling(fetchQueue, POLLING.MEDECIN);

  const waiting = useMemo(() => {
    const list = queue?.waiting || [];
    return [...list].sort((a, b) => {
      const pa = PRIORITY_ORDER[a.niveau_priorite] ?? 99;
      const pb = PRIORITY_ORDER[b.niveau_priorite] ?? 99;
      if (pa !== pb) return pa - pb;
      return a.numero - b.numero;
    });
  }, [queue]);

  async function handleTriggerCall(ticket) {
    const box = boxByTicket[ticket.id_ticket];
    if (!box) {
      toast.error('Ampidiro ny laharana box');
      return;
    }
    setLoadingId(ticket.id_ticket);
    try {
      const response = await triggerCall(ticket.id_ticket, box);
      if (response.success) {
        toast.success(`Ticket #${ticket.numero} → box ${box}`);
        reload();
      }
    } catch (err) {
      toast.error(errorMessage(err, 'Tsy afaka mandsoa'));
    } finally {
      setLoadingId(null);
    }
  }

  return {
    current: queue?.current || null,
    waiting,
    error,
    loading,
    boxByTicket,
    setBoxByTicket,
    loadingId,
    handleTriggerCall,
  };
}
