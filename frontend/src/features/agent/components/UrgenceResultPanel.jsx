import { AlertTriangle, CheckCircle2, Route } from 'lucide-react';
import PriorityBadge from '@/components/PriorityBadge';
import { Button, Card, CardContent } from '@/components/medisaas';
import { cn } from '@/lib/utils';

const PRIORITY_LABELS = {
  ROUGE: 'Critique — prise en charge immédiate',
  ORANGE: 'Urgent — surveillance rapprochée',
  JAUNE: 'Modéré',
  VERT: 'Stable',
};

const TONE = {
  ROUGE: { text: 'text-red-700', strip: 'from-red-500 to-rose-500', bg: 'bg-red-50/80' },
  ORANGE: { text: 'text-amber-700', strip: 'from-amber-500 to-orange-500', bg: 'bg-amber-50/80' },
  JAUNE: { text: 'text-amber-700', strip: 'from-amber-400 to-yellow-500', bg: 'bg-amber-50/80' },
  VERT: { text: 'text-emerald-700', strip: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50/80' },
};

// ============ Medisaas — Résultat du triage ============
// Confirmation immédiate de la priorité, du numéro et de la nouvelle position.
export default function UrgenceResultPanel({ result, onDismiss }) {
  if (!result) return null;

  const niveau = result.niveau_priorite;
  const tone = TONE[niveau] || TONE.VERT;
  const alerte = niveau === 'ROUGE' || niveau === 'ORANGE';
  const position = result.position_file ? `#${result.position_file}` : 'En consultation';

  return (
    <Card className={cn('transition-colors', tone.bg)}>
      <div className={cn('absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r', tone.strip)} />
      <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/80', tone.text)}>
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
            <p className="text-sm text-slate-700">{PRIORITY_LABELS[niveau] || ''}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
              <span>
                Ticket n° <strong className="text-slate-800">{result.numero_ticket ?? '—'}</strong>
                {result.id_ticket != null && (
                  <span className="ml-1 text-slate-400">(ID {result.id_ticket})</span>
                )}
              </span>
              <span className="inline-flex items-center gap-1">
                <Route className="h-4 w-4" />
                Position en file : <strong className="text-slate-800">{position}</strong>
              </span>
              {result.score_gravite != null && (
                <span>
                  Score : <strong className="text-slate-800">{result.score_gravite}/4</strong>
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