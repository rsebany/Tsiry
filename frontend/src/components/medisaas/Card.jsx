import * as React from 'react';
import { cn } from '@/lib/utils';

// ============ Medisaas Design System — Card ============
// Glassmorphism : fond blanc translucide + backdrop-blur-xl, overlay de reflet
// en haut à gauche, ombre douce au repos et élévation au survol.
const Card = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative overflow-hidden rounded-2xl border bg-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)]',
      'border-white/60',
      className
    )}
    {...props}
  >
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"
    />
    <div className="relative flex h-full flex-col">{children}</div>
  </div>
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col gap-1.5 p-6 pb-4', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-xl font-extrabold tracking-tight text-slate-900', className)} {...props} />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-slate-500', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex-1 p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-3 rounded-b-2xl border-t border-slate-100 bg-slate-50/80 px-6 py-4', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
