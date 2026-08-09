import DataState from '@/components/DataState';
import TicketGenerator from '@/features/agent/components/TicketGenerator';
import FileAttenteTable from '@/features/agent/components/FileAttenteTable';
import QueueStats from '@/features/agent/components/QueueStats';
import useFileAttente from '@/features/agent/hooks/useFileAttente';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PhoneCall } from 'lucide-react';

// ============ Tsiry DS — File d'attente (UC3 + UC4 + UC5) ============
// Distribution, appel et clôture des tickets. Les urgences restent en tête.
export default function FileAttentePage() {
  const { tickets, stats, loading, error, actionId, handleAppeler, handleCloturer, handleAppelerProchain } =
    useFileAttente();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-[28px]">File d&apos;attente</h1>
        <p className="mt-0.5 text-[13.5px] text-text-muted">
          Distribution de tickets, appel et clôture des patients (UC3 + UC4 + UC5).
        </p>
      </header>

      <QueueStats
        en_attente={loading ? '…' : stats.en_attente}
        en_cours={loading ? '…' : stats.en_cours}
        termines={loading ? '…' : stats.termines}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <TicketGenerator />
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1.5">
                <CardTitle>File d&apos;attente active</CardTitle>
                <CardDescription>Les urgences ROUGE/ORANGE restent en tête de liste.</CardDescription>
              </div>
              <Button variant="secondary" onClick={handleAppelerProchain} disabled={loading || stats.en_attente === 0}>
                <PhoneCall className="h-4 w-4" />
                Appeler le prochain
              </Button>
            </CardHeader>
            <CardContent>
              <DataState loading={loading} error={error}>
                <FileAttenteTable
                  tickets={tickets}
                  actionId={actionId}
                  actionLabel="Appel en cours…"
                  handleAppeler={handleAppeler}
                  handleCloturer={handleCloturer}
                />
              </DataState>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}