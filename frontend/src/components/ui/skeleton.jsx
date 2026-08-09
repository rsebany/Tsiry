import { cn } from '@/lib/utils';

// ==================================================================== Skeleton — barres grises
function Skeleton({ className, ...props }) {
  return <div className={cn('animate-pulse rounded-md bg-surface-3', className)} {...props} />;
}

export { Skeleton };