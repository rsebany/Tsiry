import { Hash, DoorOpen, Hourglass, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Status } from '@/components/ui/status';
import { TICKET_STATUTS } from '@/lib/constants';
import { cn } from '@/lib/utils';

// ============ Tsiry DS — Suivi du ticket (UC6) ============
const STATUS_TONE = {
  EN_ATTENTE: 'neutral',
  APPELE: 'success',
  EN_COURS: 'info',
  EN_CONSULTATION: 'success',
  TRAITE: 'neutral',
  CLOTURE: 'neutral',
};

export default function TicketStatusCards({ status }) {
  if (!status) return null;

  return (
    <div className="space-y-4">
      <Card className="border-primary bg-primary text-white">
        <CardContent className="flex flex-col items-center gap-1.5 py-8">
          <span className="text-[12px] font-medium uppercase tracking-[0.14em] text-white/85">
            Votre numéro
          </span>
          <span className="text-6xl font-bold leading-none tracking-tight">#{status.numero}</span>
          {status.numero_box && (
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-[15px] font-semibold">
              <DoorOpen className="h-4 w-4" /> Box {status.numero_box}
            </span>
          )}
          <Status tone="success" className="mt-3 border-transparent bg-white/15 text-white">
            {TICKET_STATUTS[status.statut] || status.statut}
          </Status>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-text-muted">
              <Hash className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[12px] text-text-muted">Ticket</p>
              <p className="text-sm font-semibold text-foreground">#{status.id_ticket}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-text-muted">
              <Users className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[12px] text-text-muted">Personnes avant vous</p>
              <p className="text-sm font-semibold text-foreground">{status.personnes_avant ?? 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-text-muted">
              <Hourglass className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[12px] text-text-muted">Estimation</p>
              <p className="text-sm font-semibold text-foreground">
                {status.estimation_minutes ? `${status.estimation_minutes} min` : '—'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}