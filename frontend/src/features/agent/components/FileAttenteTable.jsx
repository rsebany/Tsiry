import PriorityBadge from '@/components/PriorityBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatPatientName, isActiveStatut } from '@/utils/ticketUtils';

// ============ OWNER: Jess (UC4/UC5 - tableau de la file) ============
// // TODO Jess: grouper par statut (en attente / appelés / terminés).
export default function FileAttenteTable({ tickets, actionId, handleAppeler, handleCloturer }) {
  if (tickets.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        Aucun ticket pour le moment. Distribuez un ticket pour démarrer la file.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
      <TableHeader>
        <TableRow>
          <TableHead>N°</TableHead>
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
            <TableRow key={ticket.id_ticket}>
              <TableCell className="font-semibold">#{ticket.numero}</TableCell>
              <TableCell>{formatPatientName(ticket)}</TableCell>
              <TableCell>
                {ticket.niveau_priorite ? (
                  <div className="flex items-center gap-2">
                    <PriorityBadge level={ticket.niveau_priorite} />
                    {urgent && (
                      <span className="relative flex h-2.5 w-2.5">
                        <span
                          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                            ticket.niveau_priorite === 'ROUGE' ? 'bg-red-500' : 'bg-orange-500'
                          }`}
                        />
                        <span
                          className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                            ticket.niveau_priorite === 'ROUGE' ? 'bg-red-600' : 'bg-orange-500'
                          }`}
                        />
                      </span>
                    )}
                  </div>
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell>
                {new Date(ticket.heure_creation).toLocaleTimeString('fr-FR')}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{ticket.statut || '—'}</Badge>
              </TableCell>
              <TableCell>{ticket.numero_box || '—'}</TableCell>
              <TableCell className="text-right">
                {ticket.statut === 'EN_ATTENTE' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={actionId === ticket.id_ticket}
                    onClick={() => handleAppeler(ticket)}
                  >
                    Appeler
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
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
    </div>
  );
}
