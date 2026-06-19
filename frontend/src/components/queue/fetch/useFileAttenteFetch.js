import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getFileAttente, callTicket, closeTicket } from '../../../services/ticketService.js';
import { isActiveStatut, isClosedStatut } from '../../../utils/ticketUtils.js';

export default function useFileAttenteFetch(refreshTrigger) {
  const [fileAttente, setFileAttente] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ en_attente: 0, appele: 0, cloture: 0 });

  const chargerFileAttente = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getFileAttente();
      if (response.success) {
        const tickets = response.data.tickets;
        setFileAttente(tickets);
        setStats({
          en_attente: tickets.filter((t) => t.statut === 'EN_ATTENTE').length,
          appele: tickets.filter((t) => isActiveStatut(t.statut)).length,
          cloture: tickets.filter((t) => isClosedStatut(t.statut)).length,
        });
      }
    } catch {
      toast.error('Erreur lors du chargement de la file');
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleAppeler() {
    try {
      const response = await getFileAttente();
      if (!response.success) return;

      const prochain = response.data.tickets.find((t) => t.statut === 'EN_ATTENTE');
      if (!prochain) {
        toast.error('Aucun patient en attente');
        return;
      }

      const callResponse = await callTicket(prochain.id_ticket);
      if (callResponse.success) {
        toast.success(`Patient #${callResponse.data.numero} appelé (EN_COURS)`);
        chargerFileAttente();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'appel");
    }
  }

  async function handleTerminer(id, numero) {
    try {
      const response = await closeTicket(id);
      if (response.success) {
        toast.success(`Ticket #${numero} clôturé (TRAITE)`);
        chargerFileAttente();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la clôture');
    }
  }

  useEffect(() => {
    chargerFileAttente();
    const interval = setInterval(chargerFileAttente, 5000);
    return () => clearInterval(interval);
  }, [refreshTrigger, chargerFileAttente]);

  return { fileAttente, stats, loading, handleAppeler, handleTerminer };
}
