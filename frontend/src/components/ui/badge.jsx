import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ============================================================ Tsiry DS — Badge ============
// Pill sémantique (Statut / Priorité / État / Catégorie) : fond doux + texte foncé + bordure.
const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-[3px] text-[12.5px] font-medium leading-none',
  {
    variants: {
      variant: {
        default: 'border-primary bg-primary text-primary-foreground',
        success: 'border-green-border bg-green-soft text-green-deep',
        warning: 'border-amber-border bg-amber-soft text-[#8a5a12]',
        info: 'border-[#c4d8ee] bg-info-soft text-[#1d4f8f]',
        destructive: 'border-red-border bg-red-soft text-red-dark',
        danger: 'border-red-border bg-red-soft text-red-dark',
        secondary: 'border-border bg-surface-2 text-text-2',
        neutral: 'border-border bg-surface-2 text-text-2',
        outline: 'border-strong bg-surface text-text-2',
        info2: 'border-[#c4d8ee] bg-info-soft text-[#1d4f8f]',
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