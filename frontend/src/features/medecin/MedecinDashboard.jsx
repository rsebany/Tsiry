import useMedecinQueue from '@/features/medecin/hooks/useMedecinQueue';
import Vitals from '@/features/medecin/components/Vitals';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import DataState from '@/components/DataState';
import PriorityBadge from '@/components/PriorityBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Stethoscope, HeartPulse } from 'lucide-react';
import { formatPatientName } from '@/utils/ticketUtils';

// ============ OWNER: Clova (UC9/UC10 - tableau de bord médecin) ============
// // TODO Clova: ajouter l'accès au triage dashboard depuis cette page.
export default function MedecinDashboard() {
  const { current, waiting, error, loading } = useMedecinQueue();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord Médecin"
        description="File d'attente et consultations du jour."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="En attente" value={waiting.length} icon={Users} />
        <StatCard
          title="En consultation"
          value={current ? `#${current.numero}` : '—'}
          icon={Stethoscope}
        />
        <StatCard
          title="Box courant"
          value={current?.numero_box || '—'}
          icon={HeartPulse}
        />
      </div>

      <DataState loading={loading} error={error}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Patient en consultation</CardTitle>
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
                  {current.niveau_priorite && (
                    <PriorityBadge level={current.niveau_priorite} />
                  )}
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
      </DataState>
    </div>
  );
}
