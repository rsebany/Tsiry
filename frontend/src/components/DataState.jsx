import { AlertTriangle, Inbox } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

// ============ OWNER: Jess (fondation) ============
// État unifié : chargement / erreur / vide. Variante "compact" pour les tableaux denses.
export default function DataState({
  loading,
  error,
  empty,
  emptyMessage = 'Tsy misy angona.',
  children,
  className,
  compact = false,
}) {
  if (loading) {
    if (compact) {
      return (
        <div className={cn('space-y-2', className)} aria-busy="true">
          <Skeleton className="h-8 w-full" />
        </div>
      );
    }
    return (
      <div className={cn('space-y-3', className)} aria-busy="true">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-2/3" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error" className={className}>
        <AlertTriangle className="h-4 w-4 text-red" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (empty) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2.5 border border-dashed border-border rounded-lg text-center',
          compact ? 'py-6' : 'py-12',
          className
        )}
      >
        <Inbox className={cn('text-text-faint', compact ? 'h-6 w-6' : 'h-9 w-9')} />
        <p className={cn('text-text-muted', compact ? 'text-xs' : 'text-sm')}>{emptyMessage}</p>
      </div>
    );
  }

  return <div className={className}>{children}</div>;
}
