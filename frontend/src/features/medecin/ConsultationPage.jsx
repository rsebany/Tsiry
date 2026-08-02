import useMedecinQueue from '@/features/medecin/hooks/useMedecinQueue';
import Vitals from '@/features/medecin/components/Vitals';
import PageHeader from '@/components/PageHeader';
import DataState from '@/components/DataState';
import PriorityBadge from '@/components/PriorityBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatPatientName } from '@/utils/ticketUtils';

// ============ OWNER: Clova (UC9+UC10 - console unifiée) ============
// // TODO Clova: permettre de clôturer la consultation depuis cet écran (route AGENT actuellement).
export default function ConsultationPage() {
  const { current, waiting, error, loading, boxByTicket, setBoxByTicket, loadingId, handleTriggerCall } =
    useMedecinQueue();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Console de consultation"
        description="Patient en cours + file d'attente à appeler (UC9 + UC10)."
      />

      <DataState loading={loading} error={error}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Patient en consultation</CardTitle>
            <CardDescription>Constantes vitales du patient actuellement en box.</CardDescription>
          </CardHeader>
          <CardContent>
            {current ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="px-3 py-1 text-base">#{current.numero}</Badge>
                  <span className="font-medium">{formatPatientName(current)}</span>
                  {current.numero_box && (
                    <span className="text-sm text-muted-foreground">Box {current.numero_box}</span>
                  )}
                  {current.niveau_priorite && <PriorityBadge level={current.niveau_priorite} />}
                </div>
                <Vitals ticket={current} />
              </div>
            ) : (
              <p className="py-6 text-center text-muted-foreground">
                Aucun patient en consultation actuellement.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Appel en consultation</CardTitle>
            <CardDescription>
              Les urgences ROUGE/ORANGE apparaissent en tête de liste.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {waiting.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">Aucun patient en attente.</p>
            ) : (
              <div className="overflow-x-auto">
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
              </div>
            )}
          </CardContent>
        </Card>
      </DataState>
    </div>
  );
}
