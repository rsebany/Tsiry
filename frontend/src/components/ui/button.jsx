import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ============ Tsiry DS — Button ============
// Variantes : primary (vert plein), secondary (blanc+bordure), soft (gris),
// ghost (transparent vert), danger (plein rouge), danger-outline, link.
// Nominal 40px · radius 6 · 13.5/500 · focus ring vert.
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-[13.5px] font-medium transition-[background-color,border-color,color,transform] duration-150 ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-55',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary-dark active:bg-primary-deep',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-red-dark active:bg-red',
        danger: 'bg-destructive text-destructive-foreground hover:bg-red-dark active:bg-red',
        'danger-outline': 'border border-red-border bg-surface text-red hover:bg-red-soft',
        outline: 'border border-border-strong bg-surface text-text hover:bg-surface-2 active:bg-surface-3',
        secondary: 'bg-surface-2 text-text hover:bg-surface-3 active:bg-surface-3/80',
        ghost: 'text-text-2 hover:bg-surface-2 hover:text-text',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-[34px] rounded-[4px] px-3 text-[13px]',
        lg: 'h-11 px-6',
        icon: 'h-10 w-10',
        'icon-sm': 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
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