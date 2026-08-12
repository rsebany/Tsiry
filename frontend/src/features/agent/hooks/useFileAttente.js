import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import usePolling from '@/hooks/usePolling';
import { getFileAttente, callTicket, closeTicket } from '@/services/ticketService';
import { errorMessage } from '@/services/api';
import { POLLING, PRIORITE_ORDER } from '@/lib/constants';
import { isActiveStatut, isClosedStatut } from '@/utils/ticketUtils';

// ============ OWNER: Jess (UC4/UC5 - gestion de la file) ============
// Temps d'attente moyen par priorité + réimpression du ticket depuis la file.
export default function useFileAttente() {
  const [actionId, setActionId] = useState(null);
  const [lastPrinted, setLastPrinted] = useState(null);

  const fetchFile = useCallback(async () => getFileAttente(), []);

  const { data: file, error, loading, reload } = usePolling(fetchFile, POLLING.FILE_ATTENTE);

  const tickets = file?.tickets || [];
  const stats = {
    en_attente: tickets.filter((t) => t.statut === 'EN_ATTENTE').length,
    en_cours: tickets.filter((t) => isActiveStatut(t.statut)).length,
    termines: tickets.filter((t) => isClosedStatut(t.statut)).length,
  };

  const attentePrioritaire = (() => {
    const parPriorite = {};
    for (const t of tickets) {
      if (!t.niveau_priorite || !t.heure_appel || !t.heure_creation) continue;
      const minutes = (new Date(t.heure_appel) - new Date(t.heure_creation)) / 60000;
      if (minutes < 0) continue;
      const bucket = (parPriorite[t.niveau_priorite] ??= { somme: 0, nombre: 0 });
      bucket.somme += minutes;
      bucket.nombre += 1;
    }
    const priorite = PRIORITE_ORDER.find((p) => parPriorite[p]);
    if (!priorite) return null;
    return {
      priorite,
      moyenne_min: Math.round(parPriorite[priorite].somme / parPriorite[priorite].nombre),
    };
  })();

  const handleReprint = useCallback((ticket) => setLastPrinted(ticket), []);
  const clearLastPrinted = useCallback(() => setLastPrinted(null), []);

  async function handleAppeler(ticket) {
    setActionId(ticket.id_ticket);
    try {
      const res = await callTicket(ticket.id_ticket);
      if (res.success) toast.success(`Tiketo #${ticket.numero} voantso`);
      reload();
    } catch (err) {
      toast.error(errorMessage(err, 'Tsy afaka miantso'));
    } finally {
      setActionId(null);
    }
  }

  async function handleAppelerProchain() {
    const prochain = tickets.find((t) => t.statut === 'EN_ATTENTE');
    if (!prochain) {
      toast.error('Tsy misy marary miandry');
      return;
    }
    await handleAppeler(prochain);
  }

  async function handleCloturer(ticket) {
    setActionId(ticket.id_ticket);
    try {
      const res = await closeTicket(ticket.id_ticket);
      if (res.success) toast.success(`Tiketo #${ticket.numero} nofarana`);
      reload();
    } catch (err) {
      toast.error(errorMessage(err, 'Tsy afaka manaranaka'));
    } finally {
      setActionId(null);
    }
  }

  return {
    file: file || null,
    tickets,
    stats,
    attentePrioritaire,
    error,
    loading,
    actionId,
    lastPrinted,
    handleAppeler,
    handleAppelerProchain,
    handleCloturer,
    handleReprint,
    clearLastPrinted,
    reload,
  };
}
