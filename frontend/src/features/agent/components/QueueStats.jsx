import { Clock, Users, CircleCheckBig } from 'lucide-react';
import { Card, CardContent } from '@/components/medisaas';
import { cn } from '@/lib/utils';

// ============ Medisaas — Statistiques de la file ============
// Mêmes KPIs que le dashboard patient : icônes colorées, valeur extrabold.
export default function QueueStats({ en_attente, en_cours, termines }) {
  const items = [
    { title: 'En attente', value: en_attente, icon: Clock, tone: 'bg-emerald-500/10 text-emerald-600' },
    { title: 'En cours', value: en_cours, icon: Users, tone: 'bg-blue-500/10 text-blue-600' },
    { title: 'Terminés', value: termines, icon: CircleCheckBig, tone: 'bg-indigo-500/10 text-indigo-600' },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ title, value, icon: Icon, tone }) => (
        <Card key={title}>
          <CardContent className="flex items-start gap-4 p-5">
            <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', tone)}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
              <p className="mt-1 text-3xl font-extrabold leading-none text-slate-900">{value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}