import { useState } from 'react';
import useMedecinAppelQueue from '@/views/queue/fetch/useMedecinAppelQueue';
import { formatPatientName } from '@/utils/ticketUtils';
import PriorityBadge from '@/components/queue/PriorityBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

function Vitals({ ticket, highlight }) {
  const hasVitals = ticket?.pouls || ticket?.tension_systolique || ticket?.saturation_o2;
  if (!hasVitals) return null;
  return (
    <div className="grid grid-cols-3 gap-2 text-sm bg-slate-50 p-3 rounded-lg border mt-3 text-center">
      <div>
        <span className="text-muted-foreground">Pouls</span>
        <div className="font-semibold">{ticket.pouls ? `${ticket.pouls} bpm` : '—'}</div>
      </div>
      <div>
        <span className="text-muted-foreground">Tension</span>
        <div className="font-semibold">
          {ticket.tension_systolique ? `${ticket.tension_systolique} mmHg` : '—'}
        </div>
      </div>
      <div>
        <span className="text-muted-foreground">SpO₂</span>
        <div className={`font-semibold ${highlight && ticket.saturation_o2 < 90 ? 'text-red-600' : ''}`}>
          {ticket.saturation_o2 ? `${ticket.saturation_o2}%` : '—'}
        </div>
      </div>
    </div>
  );
}

export default function ConsultationCallPage() {
  const { waiting, current, boxByTicket, setBoxByTicket, loadingId, handleTriggerCall } =
    useMedecinAppelQueue();

  return (
    <div className="space-y-6">
      {/* Console médecin unifiée (UC9 + UC10) : patient en cours + file d'attente à appeler */}
      <Card>
        <CardHeader>
          <CardTitle>Patient en consultation</CardTitle>
          <CardDescription>Constantes vitales du patient actuellement en box.</CardDescription>
        </CardHeader>
        <CardContent>
          {current ? (
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className="text-base px-3 py-1">#{current.numero}</Badge>
                <span className="font-medium">{formatPatientName(current)}</span>
                {current.numero_box && (
                  <span className="text-sm text-muted-foreground">Box {current.numero_box}</span>
                )}
                {current.niveau_priorite && (
                  <PriorityBadge level={current.niveau_priorite} />
                )}
                {current.score_gravite != null && (
                  <Badge variant="outline">Score: {current.score_gravite}</Badge>
                )}
              </div>
              <Vitals ticket={current} highlight />
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-6">
              Aucun patient en consultation actuellement.
            </p>
          )}
        </CardContent>
      </Card>

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
                    <TableCell>
                      {formatPatientName(t)}
                      <Vitals ticket={t} />
                    </TableCell>
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
    </div>
  );
}
