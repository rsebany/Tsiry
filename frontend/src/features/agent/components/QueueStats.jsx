import { Clock, Users, CircleCheckBig } from 'lucide-react';
import StatCard from '@/components/StatCard';

// ============ OWNER: Jess (statistiques de la file) ============
export default function QueueStats({ en_attente, en_cours, termines }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard title="En attente" value={en_attente} icon={Clock} />
      <StatCard title="En cours" value={en_cours} icon={Users} />
      <StatCard title="Terminés" value={termines} icon={CircleCheckBig} />
    </div>
  );
}
