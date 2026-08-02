import { Hash, DoorOpen, Hourglass, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TICKET_STATUTS } from '@/lib/constants';
import { cn } from '@/lib/utils';

// ============ OWNER: Nathan (UC6 - suivi du ticket) ============
// // TODO Nathan: ajouter l'estimation de temps restant si `estimation_minutes` est fournie.

const STATUS_BADGE = {
  EN_ATTENTE: 'default',
  APPELE: 'warning',
  EN_COURS: 'warning',
  EN_CONSULTATION: 'success',
  TRAITE: 'secondary',
  CLOTURE: 'secondary',
};

export default function TicketStatusCards({ status }) {
  if (!status) return null;

  return (
    <div className="space-y-4">
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="flex flex-col items-center gap-2 py-8">
          <span className="text-sm uppercase tracking-widest opacity-80">Votre numéro</span>
          <span className="text-6xl font-black">#{status.numero}</span>
          {status.numero_box && (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-lg font-semibold">
              <DoorOpen className="h-5 w-5" /> Box {status.numero_box}
            </span>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Hash className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Ticket</p>
              <p className="font-semibold">#{status.id_ticket}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Personnes avant vous</p>
              <p className="font-semibold">{status.personnes_avant ?? 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Hourglass className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Estimation</p>
              <p className="font-semibold">
                {status.estimation_minutes ? `${status.estimation_minutes} min` : '—'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Badge variant={STATUS_BADGE[status.statut] || 'outline'} className={cn('text-sm px-4 py-1')}>
          {TICKET_STATUTS[status.statut] || status.statut}
        </Badge>
      </div>
    </div>
  );
}
