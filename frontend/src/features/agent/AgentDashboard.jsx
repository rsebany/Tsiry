import { Link } from 'react-router-dom';
import { Ticket, ClipboardList, AlarmClock } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import QueueStats from '@/features/agent/components/QueueStats';
import useFileAttente from '@/features/agent/hooks/useFileAttente';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ============ OWNER: Jess (UC3/UC4/UC5 - tableau de bord agent) ============
// // TODO Jess: ajouter la file ROUGE/ORANGE prioritaire en haut du dashboard.
export default function AgentDashboard() {
  const { stats, loading } = useFileAttente();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord Agent"
        description="File d'attente et urgences du jour (UC3 + UC4 + UC5)."
      />

      <QueueStats
        en_attente={loading ? '…' : stats.en_attente}
        en_cours={loading ? '…' : stats.en_cours}
        termines={loading ? '…' : stats.termines}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Distribuer un ticket
            </CardTitle>
            <CardDescription>
              Créer un ticket pour un patient présent ou une entrée manuelle.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/agent/file-attente">Ouvrir la distribution</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              File d&apos;attente
            </CardTitle>
            <CardDescription>Appeler et clôturer les tickets en cours.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link to="/agent/file-attente">Gérer la file</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlarmClock className="h-5 w-5" />
              Déclarer une urgence
            </CardTitle>
            <CardDescription>Prioriser un patient critique (UC1/UC8).</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="destructive">
              <Link to="/agent/urgences">Déclarer une urgence</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
