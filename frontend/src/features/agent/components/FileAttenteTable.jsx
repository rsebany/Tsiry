import PriorityBadge from '@/components/PriorityBadge';
import { Badge } from '@/components/medisaas';
import { Button } from '@/components/medisaas';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatPatientName, isActiveStatut } from '@/utils/ticketUtils';
import { cn } from '@/lib/utils';

// ============ Medisaas — File d'attente ============
// Tableau vitré, priorités colorées animées, actions d'appel/clôture.
export default function FileAttenteTable({ tickets, actionId, actionLabel = '…', handleAppeler, handleCloturer }) {
  if (tickets.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-400">
        Aucun ticket pour le moment. Distribuez un ticket pour démarrer la file.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur">
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
              <TableRow
                key={ticket.id_ticket}
                className={cn('transition-colors', urgent && 'bg-red-50/60 hover:bg-red-50')}
              >
                <TableCell className="font-bold text-slate-800">#{ticket.numero}</TableCell>
                <TableCell>
                  <span
                    title="Saisir cet identifiant dans « Déclarer une urgence »"
                    className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-extrabold text-slate-700"
                  >
                    {ticket.id_ticket}
                  </span>
                </TableCell>
                <TableCell className="text-slate-700">{formatPatientName(ticket)}</TableCell>
                <TableCell>
                  {ticket.niveau_priorite ? (
                    <div className="flex items-center gap-2">
                      <PriorityBadge level={ticket.niveau_priorite} />
                      {urgent && (
                        <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                          <span
                            className={cn(
                              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                              ticket.niveau_priorite === 'ROUGE' ? 'bg-red-500' : 'bg-orange-500'
                            )}
                          />
                          <span
                            className={cn(
                              'relative inline-flex h-2.5 w-2.5 rounded-full',
                              ticket.niveau_priorite === 'ROUGE' ? 'bg-red-600' : 'bg-orange-500'
                            )}
                          />
                        </span>
                      )}
                    </div>
) : (
                    <p className="text-slate-300">&mdash;</p>
                  )}
                </TableCell>
                <TableCell className="text-slate-500">
                  {new Date(ticket.heure_creation).toLocaleTimeString('fr-FR')}
                </TableCell>
                <TableCell>
                  <Badge variant="neutral">{ticket.statut || '—'}</Badge>
                </TableCell>
                <TableCell className="text-slate-500">{ticket.numero_box || '—'}</TableCell>
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
    </div>
  );
}