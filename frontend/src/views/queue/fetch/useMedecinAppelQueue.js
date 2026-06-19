import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import usePolling from '../../../hooks/usePolling.js';
import { getActiveQueue, triggerCall } from '../../../services/ticketService.js';

export default function useMedecinAppelQueue() {
  const [boxByTicket, setBoxByTicket] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  const fetchQueue = useCallback(async () => {
    const response = await getActiveQueue();
    if (!response.success) throw new Error('Impossible de charger la file');
    return response.data;
  }, []);

  const { data: queue, reload } = usePolling(fetchQueue, 8000);

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
      toast.error(err.response?.data?.message || 'Appel impossible');
    } finally {
      setLoadingId(null);
    }
  }

  const waiting = queue?.waiting || [];

  return { waiting, boxByTicket, setBoxByTicket, loadingId, handleTriggerCall };
}
