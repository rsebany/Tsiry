import PriorityBadge from '@/components/PriorityBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatPatientName, isActiveStatut } from '@/utils/ticketUtils';
import { cn } from '@/lib/utils';

// ============ Tsiry DS — File d'attente ============
// Tableau admin : priorités sémantiques, actions d'appel/clôture (UC3-UC5).
export default function FileAttenteTable({ tickets, actionId, actionLabel = '…', handleAppeler, handleCloturer }) {
  if (tickets.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-text-muted">
        Aucun ticket pour le moment. Distribuez un ticket pour démarrer la file.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>N° ticket</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Patient</TableHead>
          <TableHead>Priorité</TableHead>
          <TableHead>Heure</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Box</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => {
          const urgent = ticket.niveau_priorite === 'ROUGE' || ticket.niveau_priorite === 'ORANGE';
          return (
            <TableRow key={ticket.id_ticket} className={cn(urgent && 'bg-red-soft/60 hover:bg-red-soft')}>
              <TableCell className="font-semibold text-foreground">#{ticket.numero}</TableCell>
              <TableCell>
                <span
                  title="Saisir cet identifiant dans « Déclarer une urgence »"
                  className="inline-block rounded-full bg-surface-2 px-2 py-0.5 text-xs font-semibold text-text-2"
                >
                  {ticket.id_ticket}
                </span>
              </TableCell>
              <TableCell className="text-text">{formatPatientName(ticket)}</TableCell>
              <TableCell>
                {ticket.niveau_priorite ? (
                  <div className="flex items-center gap-2">
                    <PriorityBadge level={ticket.niveau_priorite} />
                    {urgent && (
                      <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                        <span
                          className={cn(
                            'absolute inline-flex h-full w-full animate-ping rounded-full opacity-60',
                            ticket.niveau_priorite === 'ROUGE' ? 'bg-red' : 'bg-amber'
                          )}
                        />
                        <span
                          className={cn(
                            'relative inline-flex h-2.5 w-2.5 rounded-full',
                            ticket.niveau_priorite === 'ROUGE' ? 'bg-red' : 'bg-amber'
                          )}
                        />
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-text-faint">&mdash;</p>
                )}
              </TableCell>
              <TableCell className="text-text-muted">
                {new Date(ticket.heure_creation).toLocaleTimeString('fr-FR')}
              </TableCell>
              <TableCell>
                <Badge variant="neutral">{ticket.statut || '—'}</Badge>
              </TableCell>
              <TableCell className="text-text-muted">{ticket.numero_box || '—'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {ticket.statut === 'EN_ATTENTE' && (
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={actionId === ticket.id_ticket}
                      onClick={() => handleAppeler(ticket)}
                    >
                      {actionId === ticket.id_ticket ? actionLabel : 'Appeler'}
                    </Button>
                  )}
                  {isActiveStatut(ticket.statut) && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={actionId === ticket.id_ticket}
                      onClick={() => handleCloturer(ticket)}
                    >
                      Clôturer
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}