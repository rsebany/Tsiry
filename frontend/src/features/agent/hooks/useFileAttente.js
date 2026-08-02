import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import usePolling from '@/hooks/usePolling';
import { getFileAttente, callTicket, closeTicket } from '@/services/ticketService';
import { errorMessage } from '@/services/api';
import { POLLING } from '@/lib/constants';
import { isActiveStatut, isClosedStatut } from '@/utils/ticketUtils';

// ============ OWNER: Jess (UC4/UC5 - gestion de la file) ============
// // TODO Jess: ajouter le temps d'attente moyen par priorité dans les stats.
export default function useFileAttente() {
  const [actionId, setActionId] = useState(null);

  const fetchFile = useCallback(async () => getFileAttente(), []);

  const { data: file, error, loading, reload } = usePolling(fetchFile, POLLING.FILE_ATTENTE);

  const tickets = file?.tickets || [];
  const stats = {
    en_attente: tickets.filter((t) => t.statut === 'EN_ATTENTE').length,
    en_cours: tickets.filter((t) => isActiveStatut(t.statut)).length,
    termines: tickets.filter((t) => isClosedStatut(t.statut)).length,
  };

  async function handleAppeler(ticket) {
    setActionId(ticket.id_ticket);
    try {
      const res = await callTicket(ticket.id_ticket);
      if (res.success) toast.success(`Ticket #${ticket.numero} appelé`);
      reload();
    } catch (err) {
      toast.error(errorMessage(err, 'Appel impossible'));
    } finally {
      setActionId(null);
    }
  }

  async function handleAppelerProchain() {
    const prochain = tickets.find((t) => t.statut === 'EN_ATTENTE');
    if (!prochain) {
      toast.error('Aucun patient en attente');
      return;
    }
    await handleAppeler(prochain);
  }

  async function handleCloturer(ticket) {
    setActionId(ticket.id_ticket);
    try {
      const res = await closeTicket(ticket.id_ticket);
      if (res.success) toast.success(`Ticket #${ticket.numero} clôturé`);
      reload();
    } catch (err) {
      toast.error(errorMessage(err, 'Clôture impossible'));
    } finally {
      setActionId(null);
    }
  }

  return {
    file: file || null,
    tickets,
    stats,
    error,
    loading,
    actionId,
    handleAppeler,
    handleAppelerProchain,
    handleCloturer,
    reload,
  };
}
