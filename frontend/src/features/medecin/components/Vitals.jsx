import { HeartPulse, Activity, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============ OWNER: Clova (constantes vitales) ============
const buildItems = (ticket) => [
  {
    label: 'Pouls',
    unit: 'bpm',
    value: ticket.pouls,
    icon: HeartPulse,
    alert: ticket.pouls != null && (ticket.pouls > 120 || ticket.pouls < 50),
  },
  {
    label: 'Tension',
    unit: 'mmHg',
    value: ticket.tension_systolique,
    icon: Activity,
    alert: ticket.tension_systolique != null && ticket.tension_systolique >= 140,
  },
  {
    label: 'SpO₂',
    unit: '%',
    value: ticket.saturation_o2,
    icon: Droplets,
    alert: ticket.saturation_o2 != null && ticket.saturation_o2 < 90,
  },
];

export default function Vitals({ ticket }) {
  const hasVitals = ticket?.pouls || ticket?.tension_systolique || ticket?.saturation_o2;
  if (!hasVitals) return null;

  const items = buildItems(ticket);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2.5">
        {items.map(({ label, unit, value, icon: Icon, alert }) => (
          <div
            key={label}
            className={cn(
              'relative overflow-hidden rounded-xl border p-3 text-center',
              alert
                ? 'border-destructive/30 bg-destructive/5'
                : 'border-border bg-gradient-to-b from-muted/50 to-background'
            )}
          >
            <Icon className={cn('mx-auto h-5 w-5', alert ? 'text-destructive' : 'text-primary')} />
            <span
              className={cn(
                'mt-1 block text-xl font-bold leading-none',
                alert ? 'text-destructive' : 'text-foreground'
              )}
            >
              {value ?? '—'}
              {value != null && <span className="ml-0.5 text-xs font-medium text-muted-foreground">{unit}</span>}
            </span>
            <span className="mt-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
            {alert && <span className="absolute inset-x-0 top-0 h-0.5 bg-destructive" />}
          </div>
        ))}
      </div>

      {ticket?.score_gravite != null && (
        <p className="text-center text-xs text-muted-foreground">
          Isan'ny loza:{' '}
          <span className="font-medium text-foreground">{ticket.score_gravite}</span>
        </p>
      )}
    </div>
  );
}
