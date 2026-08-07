import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ============ Medisaas Design System — Button ============
// Variants : Primary (dégradé émeraude), Secondary (dégradé bleu), Outline,
// Danger (rouge doux), Glass (translucide flouté). Transition 300ms easing out,
// élévation au survol (-translate-y-0.5), enfoncement au clic (scale-[0.97]).
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/10 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-[0_4px_14px_rgba(5,150,105,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(5,150,105,0.35)] hover:brightness-105 active:translate-y-0 active:scale-[0.97]',
        secondary:
          'bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:scale-[0.97]',
        outline:
          'border border-slate-200 bg-white/50 text-slate-700 backdrop-blur-sm hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white/80 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] active:translate-y-0 active:scale-[0.97]',
        danger:
          'bg-red-50 text-red-600 hover:-translate-y-0.5 hover:bg-red-100 active:translate-y-0 active:scale-[0.97]',
        glass:
          'border border-white/70 bg-white/40 text-slate-800 backdrop-blur-xl hover:-translate-y-0.5 hover:bg-white/60 active:translate-y-0 active:scale-[0.97]',
      },
      size: {
        sm: 'h-9 px-3 text-xs rounded-lg',
        default: 'h-10 px-5',
        lg: 'h-12 px-6 text-base rounded-2xl',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = 'Button';

export { Button, buttonVariants };
