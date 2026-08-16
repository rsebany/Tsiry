import { cn } from '@/lib/utils';

// ============ OWNER: Clova (tuile statistique) ============
const TONES = {
  emerald: {
    chip: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/25',
    bar: 'from-emerald-500 to-teal-500',
  },
  teal: {
    chip: 'bg-teal-500/10 text-teal-600 ring-teal-500/25',
    bar: 'from-teal-500 to-sky-500',
  },
  sky: {
    chip: 'bg-sky-500/10 text-sky-600 ring-sky-500/25',
    bar: 'from-sky-500 to-indigo-500',
  },
  violet: {
    chip: 'bg-violet-500/10 text-violet-600 ring-violet-500/25',
    bar: 'from-violet-500 to-fuchsia-500',
  },
  rose: {
    chip: 'bg-rose-500/10 text-rose-600 ring-rose-500/25',
    bar: 'from-rose-500 to-red-500',
  },
  amber: {
    chip: 'bg-amber-500/10 text-amber-600 ring-amber-500/25',
    bar: 'from-amber-500 to-orange-500',
  },
};

export default function StatTile({ label, value, sub, icon: Icon, tone = 'emerald', className }) {
  const t = TONES[tone] || TONES.emerald;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {Icon && (
          <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl ring-1', t.chip)}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
      <p className="mt-3 text-3xl font-extrabold tracking-tight">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
