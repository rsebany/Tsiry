import { useEffect, useRef, useState } from 'react';
import useMoniteurQueue from '@/features/moniteur/hooks/useMoniteurQueue';
import MoniteurCurrentCall from '@/features/moniteur/components/MoniteurCurrentCall';
import MoniteurWaitingList from '@/features/moniteur/components/MoniteurWaitingList';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import FlagStripe from '@/components/FlagStripe';
import './moniteur.css';

// ============ OWNER: Clova (UC9 - écran public / TV) ============
// // TODO Clova: sonner à chaque nouvel appel (flash déjà actif).
export default function MoniteurView({ tvMode = false }) {
  const { queue, error, loading } = useMoniteurQueue();
  const [audioReady, setAudioReady] = useState(false);
  const [flashCall, setFlashCall] = useState(false);
  const previousCurrentIdRef = useRef(null);

  useEffect(() => {
    const currentId = queue?.current?.id_ticket ?? null;
    if (currentId !== null && currentId !== previousCurrentIdRef.current) {
      previousCurrentIdRef.current = currentId;
      setFlashCall(true);
      const timer = setTimeout(() => setFlashCall(false), 3500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [queue?.current?.id_ticket]);

  return (
    <div className={cn('moniteur', tvMode && 'moniteur-tv')}>
      <FlagStripe className="fixed inset-x-0 top-0 z-50 h-[4px]" />
      {!audioReady && (
        <div className="mb-4 text-center">
          <Button
            onClick={() => {
              setAudioReady(true);
            }}
            variant="secondary"
          >
            Atereo ny feo fanairana
          </Button>
        </div>
      )}

      <h1 className="moniteur-title">Efitra fiandrasana</h1>

      {error ? (
        <p className="moniteur-empty">Tsy afaka mifandray amin'ny mpanjaka.</p>
      ) : loading && !queue ? (
        <p className="moniteur-loading">Miandry kely…</p>
      ) : (
        <>
          <MoniteurCurrentCall current={queue?.current} flash={flashCall} />
          <section className="moniteur-next">
            <p className="moniteur-label">Laharana manaraka (vonjy maika aloha)</p>
            <MoniteurWaitingList waiting={queue?.waiting || []} />
          </section>
        </>
      )}
    </div>
  );
}
