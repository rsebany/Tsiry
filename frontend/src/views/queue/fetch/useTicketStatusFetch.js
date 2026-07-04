import { useEffect, useRef, useState } from 'react';
import { getStoredToken } from '../../../lib/auth.js';

function notifyStatusChange(message) {
  if (typeof Notification === 'undefined') return;
  if (Notification.permission !== 'granted') return;
  new Notification('Mise à jour de votre ticket', {
    body: message,
  });
}

export default function useTicketStatusFetch(ticketId) {
  const invalidId = Number.isNaN(ticketId);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const lastStatutRef = useRef(null);
  const permissionRequestedRef = useRef(false);

  useEffect(() => {
    if (typeof Notification === 'undefined') return;
    if (permissionRequestedRef.current) return;
    permissionRequestedRef.current = true;
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (invalidId) {
      setError('Identifiant de ticket invalide.');
      setLoading(false);
      return undefined;
    }

    const token = getStoredToken();
    const url = `/api/tickets/${ticketId}/status/stream?token=${encodeURIComponent(token || '')}`;
    const source = new EventSource(url);

    source.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      setData(parsed);
      setError(null);
      setLoading(false);

      const previousStatut = lastStatutRef.current;
      if (previousStatut !== null && previousStatut !== parsed.statut) {
        notifyStatusChange(parsed.message);
      }
      lastStatutRef.current = parsed.statut;
    };

    source.onerror = () => {
      setError('Connexion au serveur interrompue.');
    };

    return () => {
      source.close();
    };
  }, [ticketId, invalidId]);

  return { data, error, loading, invalidId };
}
