import { cn } from '@/lib/utils';

// ============ OWNER: Clova (bannière d'en-tête dégradée) ============
export default function PageHero({ icon: Icon, title, description, actions, className }) {
  return (
    <div
      className={cn(
         'relative overflow-hidden rounded-3xl bg-white px-6 py-7 text-slate-900 shadow-lg sm:px-8 sm:py-8',
        className
      )}
    >
      <div
        aria-hidden="true"
        className="absolute -right-14 -top-20 h-60 w-60 rounded-full bg-white/10 blur-sm"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 right-40 h-44 w-44 rounded-full bg-white/10"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-emerald-300/20 blur-xl"
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {Icon && (
            <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur sm:flex">
              <Icon className="h-7 w-7" />
            </span>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
            {description && <p className="mt-1 max-w-xl text-sm text-white/85">{description}</p>}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
