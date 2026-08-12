import { cn } from '@/lib/utils';

// ============ OWNER: Clova (constantes vitales) ============
// // TODO Clova: ajouter le score de gravité si présent sur le ticket.
export default function Vitals({ ticket }) {
  const hasVitals = ticket?.pouls || ticket?.tension_systolique || ticket?.saturation_o2;
  if (!hasVitals) return null;

  return (
    <div className="grid grid-cols-3 gap-2 rounded-lg border bg-muted/40 p-3 text-center text-sm">
      <div>
        <span className="block text-xs text-muted-foreground">Fitempo</span>
        <span className="font-semibold">{ticket.pouls ? `${ticket.pouls} bpm` : '—'}</span>
      </div>
      <div>
        <span className="block text-xs text-muted-foreground">Tosika</span>
        <span className="font-semibold">
          {ticket.tension_systolique ? `${ticket.tension_systolique} mmHg` : '—'}
        </span>
      </div>
      <div>
        <span className="block text-xs text-muted-foreground">SpO₂</span>
        <span
          className={cn(
            'font-semibold',
            ticket.saturation_o2 && ticket.saturation_o2 < 90 && 'text-red'
          )}
        >
          {ticket.saturation_o2 ? `${ticket.saturation_o2}%` : '—'}
        </span>
      </div>
    </div>
  );
}
