import * as React from 'react';
import { cn } from '@/lib/utils';

// ============================================================================ Tsiry DS — Textarea ============
// 90px min, resize vertical, même traitement que .control.
const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-[90px] w-full rounded-md border border-strong bg-surface px-3 py-2 text-sm text-foreground shadow-none transition-[border-color,box-shadow] duration-150 ease-soft placeholder:text-text-faint hover:border-[#aeb8b3] focus-visible:outline-none focus-visible:border-green focus-visible:ring-[3px] focus-visible:ring-green/15 disabled:cursor-not-allowed disabled:bg-surface-2 disabled:opacity-55',
      className
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export { Textarea };