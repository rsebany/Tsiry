import PageHeader from '@/components/PageHeader';
import DataState from '@/components/DataState';
import TicketGenerator from '@/features/agent/components/TicketGenerator';
import FileAttenteTable from '@/features/agent/components/FileAttenteTable';
import QueueStats from '@/features/agent/components/QueueStats';
import useFileAttente from '@/features/agent/hooks/useFileAttente';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PhoneCall } from 'lucide-react';

// ============ OWNER: Jess (UC3 + UC4 + UC5 - file d'attente) ============
// // TODO Jess: imprimer à nouveau le dernier ticket depuis cette page.
export default function FileAttentePage() {
  const { tickets, stats, loading, error, actionId, handleAppeler, handleCloturer, handleAppelerProchain } =
    useFileAttente();

  return (
    <div className="space-y-6">
      <PageHeader
        title="File d'attente"
        description="Distribution de tickets, appel et clôture des patients (UC3 + UC4 + UC5)."
      />

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
                <CardDescription>
                  Les urgences ROUGE/ORANGE restent en tête de liste.
                </CardDescription>
              </div>
              <Button
                variant="secondary"
                onClick={handleAppelerProchain}
                disabled={loading || stats.en_attente === 0}
              >
                <PhoneCall className="h-4 w-4" />
                Appeler le prochain
              </Button>
            </CardHeader>
            <CardContent>
              <DataState loading={loading} error={error}>
                <FileAttenteTable
                  tickets={tickets}
                  actionId={actionId}
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
