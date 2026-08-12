import { useEffect, useRef, useState } from 'react';

// // ============ OWNER: Nathan (UC6 - statut ticket) ============
// // TODO Nathan: gérer reconnexion automatique si la connexion SSE tombe.
// Suit un ticket en temps réel via SSE (backend pousse toutes les 2 s).
export default function useSseStatus(streamUrl, enabled = true) {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const sourceRef = useRef(null);

  useEffect(() => {
    if (!streamUrl || !enabled) return undefined;

    const source = new EventSource(streamUrl);
    sourceRef.current = source;

    source.onopen = () => setConnected(true);
    source.onerror = () => {
      setConnected(false);
      setError('Very ny fifandraisana amin\'ny fanaraha-maso mivantana');
    };

    source.onmessage = (event) => {
      try {
        setStatus(JSON.parse(event.data));
        setError(null);
      } catch {
        setError('Tsy mety ny angona filamatra');
      }
    };

    return () => {
      source.close();
      sourceRef.current = null;
      setConnected(false);
    };
  }, [streamUrl, enabled]);

  return { status, error, connected };
}
