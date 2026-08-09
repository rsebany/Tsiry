import { AlertTriangle, Inbox } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

// ============ OWNER: Jess (fondation) ============
// État unifié : chargement / erreur / vide.
// // TODO Jess: ajouter variante "compact" si besoin sur les tableaux denses.
export default function DataState({ loading, error, empty, emptyMessage = 'Aucune donnée.', children, className }) {
  if (loading) {
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
      <div className={cn('flex flex-col items-center justify-center gap-2.5 border border-dashed border-border rounded-lg py-12 text-center', className)}>
        <Inbox className="h-9 w-9 text-text-faint" />
        <p className="text-sm text-text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return <div className={className}>{children}</div>;
}
