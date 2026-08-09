import { AlertTriangle, CheckCircle2, Route } from 'lucide-react';
import PriorityBadge from '@/components/PriorityBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const PRIORITY_LABELS = {
  ROUGE: 'Critique — prise en charge immédiate',
  ORANGE: 'Urgent — surveillance rapprochée',
  JAUNE: 'Modéré',
  VERT: 'Stable',
};

const TONE = {
  ROUGE: { text: 'text-red-dark', strip: 'bg-red', bg: 'bg-red-soft' },
  ORANGE: { text: 'text-amber', strip: 'bg-amber', bg: 'bg-amber-soft' },
  JAUNE: { text: 'text-amber', strip: 'bg-amber', bg: 'bg-amber-soft' },
  VERT: { text: 'text-primary', strip: 'bg-primary', bg: 'bg-green-soft' },
};

// ============ Tsiry DS — Résultat du triage ============
// Confirmation immédiate de la priorité, du numéro et de la nouvelle position.
export default function UrgenceResultPanel({ result, onDismiss }) {
  if (!result) return null;

  const niveau = result.niveau_priorite;
  const tone = TONE[niveau] || TONE.VERT;
  const alerte = niveau === 'ROUGE' || niveau === 'ORANGE';
  const position = result.position_file ? `#${result.position_file}` : 'En consultation';

  return (
    <Card className={cn('overflow-hidden', tone.bg)}>
      <div className={cn('h-1 w-full', tone.strip)} />
      <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface shadow-xs', tone.text)}>
            {alerte ? (
              <AlertTriangle className="h-5 w-5" />
            ) : (
              <CheckCircle2 className="h-5 w-5" />
            )}
          </span>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PriorityBadge level={niveau} />
              <p className={cn('text-sm font-bold uppercase tracking-wide', tone.text)}>
                {alerte ? 'Alerte activée' : 'Patient stable'}
              </p>
            </div>
            <p className="text-sm text-text">{PRIORITY_LABELS[niveau] || ''}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
              <span>
                Ticket n° <strong className="text-foreground">{result.numero_ticket ?? '—'}</strong>
                {result.id_ticket != null && (
                  <span className="ml-1 text-text-faint">(ID {result.id_ticket})</span>
                )}
              </span>
              <span className="inline-flex items-center gap-1">
                <Route className="h-4 w-4" />
                Position en file : <strong className="text-foreground">{position}</strong>
              </span>
              {result.score_gravite != null && (
                <span>
                  Score : <strong className="text-foreground">{result.score_gravite}/4</strong>
                </span>
              )}
            </div>
          </div>
        </div>
        {onDismiss && (
          <Button variant="outline" onClick={onDismiss}>
            Nouvelle déclaration
          </Button>
        )}
      </CardContent>
    </Card>
  );
}