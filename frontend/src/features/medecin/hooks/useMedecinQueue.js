import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import usePolling from '@/hooks/usePolling';
import { getActiveQueue, triggerCall } from '@/services/ticketService';
import { errorMessage } from '@/services/api';
import { POLLING } from '@/lib/constants';

// ============ OWNER: Clova (UC9/UC10 - console médecin) ============
export default function useMedecinQueue() {
  const [boxByTicket, setBoxByTicket] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  const fetchQueue = useCallback(async () => getActiveQueue(), []);

  const { data: queue, error, loading, reload } = usePolling(fetchQueue, POLLING.MEDECIN);

  async function handleTriggerCall(ticket) {
    const box = boxByTicket[ticket.id_ticket];
    if (!box) {
      toast.error('Indiquez un numéro de box');
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
      toast.error(errorMessage(err, 'Appel impossible'));
    } finally {
      setLoadingId(null);
    }
  }

  return {
    current: queue?.current || null,
    waiting: queue?.waiting || [],
    error,
    loading,
    boxByTicket,
    setBoxByTicket,
    loadingId,
    handleTriggerCall,
  };
}
