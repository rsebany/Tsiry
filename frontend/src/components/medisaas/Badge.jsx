import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ============ Medisaas Design System — Badge ============
// Pill arrondi, texte XS très gras en majuscules (tracking élargi).
const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider',
  {
    variants: {
      variant: {
        success: 'bg-emerald-100 text-emerald-700 shadow-[0_2px_8px_rgba(5,150,105,0.15)]',
        warning: 'bg-amber-100 text-amber-700',
        default: 'bg-blue-100 text-blue-700',
        neutral: 'bg-slate-100 text-slate-600',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
