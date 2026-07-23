import { useCallback, useEffect, useRef } from 'react';
import usePolling from '../../../hooks/usePolling.js';
import { getActiveQueue } from '../../../services/ticketService.js';
import { playEmergencySound } from '../../../utils/soundAlert.js';

export default function useMoniteurQueue() {
  const previousCriticalIdsRef = useRef(new Set());

  const fetchQueue = useCallback(async () => {
    const response = await getActiveQueue();
    if (!response.success) throw new Error('Connexion au serveur impossible.');
    return response.data;
  }, []);

  // Conservation stricte du hook usePolling original
  const { data: queue, error, loading } = usePolling(fetchQueue, 5000);

  // Effet secondaire : Analyse des tickets à chaque rafraîchissement du Polling
  useEffect(() => {
    if (!queue) return;

    // Adaptation au format de retour (tableau direct ou objet contenant les tickets)
    const ticketList = Array.isArray(queue)
      ? queue
      : queue.tickets || queue.en_attente || [];

    const currentCriticalIds = new Set();
    let shouldTriggerSound = false;
    let highestPriority = 'ORANGE';

    ticketList.forEach((ticket) => {
      if (ticket.niveau_priorite === 'ROUGE' || ticket.niveau_priorite === 'ORANGE') {
        const id = ticket.id_ticket || ticket.id;
        currentCriticalIds.add(id);

        // Si le ticket n'était pas présent lors du cycle précédent
        if (!previousCriticalIdsRef.current.has(id)) {
          shouldTriggerSound = true;
          if (ticket.niveau_priorite === 'ROUGE') {
            highestPriority = 'ROUGE';
          }
        }
      }
    });

    // Déclenchement de l'alerte sonore si un nouveau cas ROUGE ou ORANGE est détecté
    if (shouldTriggerSound) {
      playEmergencySound(highestPriority);
    }

    // Mise à jour de la référence avec les identifiants actuels
    previousCriticalIdsRef.current = currentCriticalIds;
  }, [queue]);

  // Retour original inchangé pour ne pas casser le composant MoniteurView
  return { queue, error, loading };
}