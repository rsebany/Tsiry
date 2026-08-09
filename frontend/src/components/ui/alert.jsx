import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ================================================================ Tsiry DS — Alert ============
// info / success / warning / error. Icône 18px + titre strong + description.
const alertVariants = cva(
  'relative flex w-full items-start gap-3 rounded-lg border p-3 px-4 text-sm',
  {
    variants: {
      variant: {
        default: 'border-[#c4d8ee] bg-info-soft text-[#1d4f8f]',
        info: 'border-[#c4d8ee] bg-info-soft text-[#1d4f8f]',
        success: 'border-green-border bg-green-soft text-green-deep',
        warning: 'border-amber-border bg-amber-soft text-[#7c5210]',
        destructive: 'border-red-border bg-red-soft text-red-dark',
        error: 'border-red-border bg-red-soft text-red-dark',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn('font-semibold leading-tight', className)} {...props} />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-[13px] leading-relaxed [&_p]:leading-relaxed', className)} {...props} />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };