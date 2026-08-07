import * as React from 'react';
import { cn } from '@/lib/utils';

// ============ Medisaas Design System — Input ============
// Label semibold Slate-700, champ h-11 rounded-xl fond white/70 flouté.
// Focus ring doux émeraude ; survol du groupe -> fond blanc pur ; états
// erreur (bordure + texte rouge) et disabled (opacité 50%).
const Input = React.forwardRef(
  ({ className, label, error, id, icon, ...props }, ref) => {
    const inputId = id || (label ? `medisaas-${String(label).toLowerCase().replace(/\W+/g, '-')}` : undefined);
    return (
      <div className="group space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-slate-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'h-11 w-full rounded-xl border bg-white/70 px-3.5 text-sm text-slate-900 shadow-sm backdrop-blur-sm transition-all placeholder:text-slate-400 group-hover:bg-white',
              icon && 'pl-10',
              'focus:outline-none focus:ring-4 focus:ring-emerald-500/10',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                : 'border-slate-200 focus:border-emerald-500/50',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs font-medium text-red-600">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };