import { useState } from 'react';
import useMedecinAppelQueue from '@/views/queue/fetch/useMedecinAppelQueue';
import { formatPatientName } from '@/utils/ticketUtils';
import PriorityBadge from '@/components/queue/PriorityBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ConsultationCallPage() {
  const { waiting, boxByTicket, setBoxByTicket, loadingId, handleTriggerCall } =
    useMedecinAppelQueue();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appel en consultation</CardTitle>
        <CardDescription>
          Envoyer un patient en box (UC10). Les urgences ROUGE/ORANGE apparaissent en tête.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {waiting.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Aucun patient en attente.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Box</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {waiting.map((t) => (
                <TableRow key={t.id_ticket}>
                  <TableCell>#{t.numero}</TableCell>
                  <TableCell>{formatPatientName(t)}</TableCell>
                  <TableCell>
                    <PriorityBadge level={t.niveau_priorite} />
                  </TableCell>
                  <TableCell>
                    <Input
                      className="w-24"
                      placeholder="ex. A3"
                      value={boxByTicket[t.id_ticket] || ''}
                      onChange={(e) =>
                        setBoxByTicket({ ...boxByTicket, [t.id_ticket]: e.target.value })
                      }
                      disabled={loadingId === t.id_ticket}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handleTriggerCall(t)}
                      disabled={loadingId === t.id_ticket}
                    >
                      Appeler
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
