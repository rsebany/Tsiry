import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

// ============================================================== Tsiry DS — Tooltip ============
// Pastille gris foncé (charcoal #17201b), texte blanc 12px, rayon 4.
const TooltipProvider = ({ delayDuration = 100, skipDelayDuration, children, ...props }) => (
  <TooltipPrimitive.Provider delayDuration={delayDuration} skipDelayDuration={skipDelay} {...props}>
    {children}
  </TooltipPrimitive.Provider>
);

const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 overflow-hidden rounded-[4px] bg-[#172a1f] px-2.5 py-1.5 text-[12px] font-medium text-white shadow-md animate-fade-in',
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };