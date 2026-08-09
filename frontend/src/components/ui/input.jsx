import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

// ============================================ Tsiry DS — Input ============
// 42px haut, radius 6, bordure --border-strong, focus ring vert 3px doux,
// état erreur (bordure + ring rouge), placeholder text-faint, disabled surface-2.
// Support natif `label` + `icon` pour un seul composant de formulaire.
const Input = React.forwardRef(({ className, type, error, label, icon, id, ...props }, ref) => {
  const inputId = id || (label ? `ui-${String(label).toLowerCase().replace(/\W+/g, '-')}` : undefined);
  const field = (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
          {icon}
        </span>
      )}
      <input
        type={type}
        id={inputId}
        className={cn(
          'flex h-[42px] w-full rounded-md border border-strong bg-surface px-3 py-2 text-sm text-foreground shadow-none transition-[border-color,box-shadow,background-color] duration-150 ease-soft file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-faint hover:border-[#aeb8b3] focus-visible:outline-none focus-visible:border-green focus-visible:ring-[3px] focus-visible:ring-green/15 disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-text-faint disabled:opacity-55',
          icon && 'pl-9',
          error && 'border-red focus-visible:border-red focus-visible:ring-red/15',
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );

  if (!label) return field;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={inputId}>{label}</Label>
      {field}
      {error && <p className="text-xs font-medium text-red">{error}</p>}
    </div>
  );
});
Input.displayName = 'Input';

export { Input };