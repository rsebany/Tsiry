import { Clock, Users, CircleCheckBig } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// ============ Tsiry DS — Statistiques de la file ============
export default function QueueStats({ en_attente, en_cours, termines }) {
  const items = [
    { title: 'En attente', value: en_attente, icon: Clock, tone: 'bg-green-soft text-primary' },
    { title: 'En cours', value: en_cours, icon: Users, tone: 'bg-info-soft text-info' },
    { title: 'Terminés', value: termines, icon: CircleCheckBig, tone: 'bg-amber-soft text-amber' },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ title, value, icon: Icon, tone }) => (
        <Card key={title}>
          <CardContent className="flex items-center gap-3 p-5">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tone}`}>
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-text-2">{title}</p>
              <p className="mt-0.5 text-3xl font-bold leading-none text-foreground">{value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}