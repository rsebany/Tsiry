import { useMemo, useState } from 'react';
import { getTicketStatus, getStatusStreamUrl } from '@/services/ticketService';
import useSseStatus from '@/hooks/useSseStatus';

// ============ OWNER: Nathan (UC6 - statut du ticket) ============
// // TODO Nathan: valider l'affichage de `personnes_avant` sur l'écran patient.
export default function useTicketStatus(initialId) {
  const [ticketId, setTicketId] = useState(initialId || '');
  const [lookedUp, setLookedUp] = useState(initialId || '');
  const [lookupError, setLookupError] = useState(null);

  const streamUrl = useMemo(
    () => (lookedUp ? getStatusStreamUrl(lookedUp) : null),
    [lookedUp]
  );

  const { status, error: sseError, connected } = useSseStatus(streamUrl, Boolean(lookedUp));

  async function lookup(id) {
    const value = String(id || ticketId).trim();
    if (!value) return;
    setLookupError(null);
    try {
      await getTicketStatus(value);
      setLookedUp(value);
    } catch (err) {
      setLookupError(err.response?.data?.error || 'Tsy hita ny tiketo');
      setLookedUp('');
    }
  }

  return { ticketId, setTicketId, lookedUp, lookup, status, sseError, connected, lookupError };
}
