import DataState from '@/components/DataState';
import TicketGenerator from '@/features/agent/components/TicketGenerator';
import TicketThermique from '@/features/agent/components/TicketThermique';
import FileAttenteTable from '@/features/agent/components/FileAttenteTable';
import QueueStats from '@/features/agent/components/QueueStats';
import useFileAttente from '@/features/agent/hooks/useFileAttente';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PhoneCall } from 'lucide-react';

// Distribution, appel, clôture et réimpression des tickets. Les urgences restent en tête.
export default function FileAttentePage() {
  const {
    tickets,
    stats,
    attentePrioritaire,
    loading,
    error,
    actionId,
    lastPrinted,
    handleAppeler,
    handleCloturer,
    handleAppelerProchain,
    handleReprint,
    clearLastPrinted,
  } = useFileAttente();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-[28px]">Filaharana</h1>
        <p className="mt-0.5 text-[13.5px] text-text-muted">
          Fizarana tiketo, antsom-panahy na famehezana ny marary.
        </p>
      </header>

      <QueueStats
        en_attente={loading ? '…' : stats.en_attente}
        en_cours={loading ? '…' : stats.en_cours}
        termines={loading ? '…' : stats.termines}
        attentePrioritaire={attentePrioritaire}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <TicketGenerator />
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1.5">
                <CardTitle>Filaharana misy</CardTitle>
                <CardDescription>Ny vonjy maika MENA/LAORANJY dia mijanona eo alohan'ny lisitra.</CardDescription>
              </div>
              <Button variant="secondary" onClick={handleAppelerProchain} disabled={loading || stats.en_attente === 0}>
                <PhoneCall className="h-4 w-4" />
                Antsoy ny manaraka
              </Button>
            </CardHeader>
            <CardContent>
              <DataState loading={loading} error={error} compact>
                <FileAttenteTable
                  tickets={tickets}
                  actionId={actionId}
                  actionLabel="Antso mitohy…"
                  handleAppeler={handleAppeler}
                  handleCloturer={handleCloturer}
                  handleReprint={handleReprint}
                />
              </DataState>
            </CardContent>
          </Card>
        </div>
      </div>

      {lastPrinted && (
        <TicketThermique ticket={lastPrinted} onClose={clearLastPrinted} autoCloseMs={null} />
      )}
    </div>
  );
}
