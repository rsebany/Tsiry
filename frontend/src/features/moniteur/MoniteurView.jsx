import { useEffect, useRef, useState } from 'react';
import { Cloud, BellRing, AlertTriangle, AlertCircle, Info, Volume2 } from 'lucide-react';
import useMoniteurQueue from '@/features/moniteur/hooks/useMoniteurQueue';
import MoniteurCurrentCall from '@/features/moniteur/components/MoniteurCurrentCall';
import MoniteurWaitingList from '@/features/moniteur/components/MoniteurWaitingList';
import FlagStripe from '@/components/FlagStripe';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import logo from '@/assets/image/logo.png';
import './moniteur.css';

const MESSAGE_ICON = {
  red: AlertTriangle,
  orange: AlertCircle,
  green: Info,
};

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
          <img src={logo} alt="Tsiry" className="moniteur-brand-mark h-10 w-10 rounded-[14px] object-contain" />
          Tsiry
        </div>
        <div className="moniteur-datetime">
          <div className="moniteur-date">
            {now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <div className="moniteur-clock">
            {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>
        <div className="moniteur-header-right">
          <div className="moniteur-weather">
            <Cloud size={16} aria-hidden="true" />
            24°C
          </div>
          {!audioReady && (
            <Button size="sm" onClick={() => setAudioReady(true)} variant="outline" className="moniteur-audio-btn">
              <Volume2 size={16} />
            </Button>
          )}
        </div>
      </header>

      {error ? (
        <p className="moniteur-empty">Tsy afaka mampifandray amin'ny mpizara.</p>
      ) : loading && !queue ? (
        <p className="moniteur-loading">Mitafy…</p>
      ) : (
        <>
          <div className="moniteur-main">
            <div className="moniteur-left">
              <MoniteurCurrentCall current={queue?.current} flash={flashCall} />
            </div>

            <div className="moniteur-stats-col">
              <div className="moniteur-stat-block">
                <span className="moniteur-stat-block-label">Miandry</span>
                <span className="moniteur-stat-block-value">{stats.waiting}</span>
              </div>
              <div className="moniteur-stat-block" data-priorite="ROUGE">
                <span className="moniteur-stat-block-dot" />
                <span className="moniteur-stat-block-label">Mena</span>
                <span className="moniteur-stat-block-value">{stats.rouge}</span>
              </div>
              <div className="moniteur-stat-block" data-priorite="ORANGE">
                <span className="moniteur-stat-block-dot" />
                <span className="moniteur-stat-block-label">Laoranjy</span>
                <span className="moniteur-stat-block-value">{stats.orange}</span>
              </div>
              <div className="moniteur-stat-block" data-priorite="VERT">
                <span className="moniteur-stat-block-dot" />
                <span className="moniteur-stat-block-label">Maitso</span>
                <span className="moniteur-stat-block-value">{stats.vert}</span>
              </div>
            </div>

            <div className="moniteur-right">
              <div className="moniteur-waiting-header">
                <BellRing size={16} aria-hidden="true" />
                Laharana manaraka
              </div>
              <MoniteurWaitingList waiting={queue?.waiting || []} />
            </div>
          </div>

          <footer className="moniteur-message" data-color={message.color}>
            <MessageIcon size={18} aria-hidden="true" />
            {message.text}
          </footer>
        </>
      )}
    </div>
  );
}
