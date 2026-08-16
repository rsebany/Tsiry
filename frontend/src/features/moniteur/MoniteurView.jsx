import { useEffect, useRef, useState } from 'react';
import { Building2, Cloud, BellRing, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import useMoniteurQueue from '@/features/moniteur/hooks/useMoniteurQueue';
import MoniteurCurrentCall from '@/features/moniteur/components/MoniteurCurrentCall';
import MoniteurWaitingList from '@/features/moniteur/components/MoniteurWaitingList';
import FlagStripe from '@/components/FlagStripe';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import './moniteur.css';

const MESSAGE_ICON = {
  red: AlertTriangle,
  orange: AlertCircle,
  green: Info,
};


// ============ OWNER: Clova (UC9 - écran public / TV) ============
// TODO Clova: brancher une vraie source météo (ex. Open-Meteo) à la place
// du "—" ci-dessous ; coordonnées Antananarivo : -18.8792, 47.5079.
export default function MoniteurView({ tvMode = false }) {
  const { queue, stats, message, error, loading } = useMoniteurQueue();
  const [audioReady, setAudioReady] = useState(false);
  const [flashCall, setFlashCall] = useState(false);
  const [now, setNow] = useState(new Date());
  const previousCurrentIdRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

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

  const MessageIcon = MESSAGE_ICON[message.color] || Info;

  return (
    <div className={cn('moniteur', tvMode && 'moniteur-tv')}>
      <FlagStripe className="moniteur-flag" />

      <header className="moniteur-header">
        <div className="moniteur-brand">
          <span className="moniteur-brand-mark">
            <Building2 size={18} aria-hidden="true" />
          </span>
          Tsiry
        </div>

        <div className="moniteur-datetime">
          <div className="moniteur-date">
            {now.toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </div>
          <div className="moniteur-clock">
            {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit',second: '2-digit' })}
          </div>
        </div>

        <div className="moniteur-weather">
          <Cloud size={18} aria-hidden="true" />
          24°C — Antananarivo
        </div>
      </header>

      {!audioReady && (
        <div style={{ textAlign: 'center' }}>
          <Button onClick={() => setAudioReady(true)} variant="secondary">
            <div className='moniteur-audio'> Akatony ny faneno</div>
          </Button>
        </div>
      )}

      {error ? (
        <p className="moniteur-empty">Tsy afaka mampifandray amin'ny mpizara.</p>
      ) : loading && !queue ? (
        <p className="moniteur-loading">Mitafy…</p>
      ) : (
        <>
          <div className="moniteur-body">
            <div className="moniteur-title-wrap">
              <h1 className="moniteur-title">Efitran'ny miandry</h1>
              <p className="moniteur-subtitle">
                Mankasitraka ny écran ary mankany ao amin'ny box rehefa antsoinao ny laharanao.
              </p>
            </div>

            <MoniteurCurrentCall current={queue?.current} flash={flashCall} />

            <section className="moniteur-next">
              <p className="moniteur-label">
                <BellRing size={16} aria-hidden="true" />
                Laharana manaraka
              </p>
              <MoniteurWaitingList waiting={queue?.waiting || []} />
            </section>

            <div className="moniteur-stats">
              <div className="moniteur-stat">
                <div className="moniteur-stat-label">
                  <span className="moniteur-stat-dot" />
                  Miandry
                </div>
                <div className="moniteur-stat-value">{stats.waiting}</div>
              </div>
              <div className="moniteur-stat" data-priorite="ROUGE">
                <div className="moniteur-stat-label">
                  <span className="moniteur-stat-dot" />
                  Mena
                </div>
                <div className="moniteur-stat-value">{stats.rouge}</div>
              </div>
              <div className="moniteur-stat" data-priorite="ORANGE">
                <div className="moniteur-stat-label">
                  <span className="moniteur-stat-dot" />
                  Laoranjy
                </div>
                <div className="moniteur-stat-value">{stats.orange}</div>
              </div>
              <div className="moniteur-stat" data-priorite="VERT">
                <div className="moniteur-stat-label">
                  <span className="moniteur-stat-dot" />
                  Maitso
                </div>
                <div className="moniteur-stat-value">{stats.vert}</div>
              </div>
            </div>
          </div>

          <footer className="moniteur-message" data-color={message.color}>
            <MessageIcon size={20} aria-hidden="true" />
            {message.text}
          </footer>
        </>
      )}
    </div>
  );
}
