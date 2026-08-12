import { Clock, Users, CircleCheckBig, Timer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PRIORITES } from '@/lib/constants';

// ============ Tsiry DS — Statistiques de la file ============
// La 4e carte montre le temps d'attente moyen de la priorité la plus élevée présente.
export default function QueueStats({ en_attente, en_cours, termines, attentePrioritaire }) {
  const items = [
    { title: 'Miandry', value: en_attente, icon: Clock, tone: 'bg-green-soft text-primary' },
    { title: 'Mitohy', value: en_cours, icon: Users, tone: 'bg-info-soft text-info' },
    { title: 'Vita', value: termines, icon: CircleCheckBig, tone: 'bg-amber-soft text-amber' },
    {
      title: attentePrioritaire
        ? `Faharetan'ny fiandrasana — ${PRIORITES[attentePrioritaire.priorite]}`
        : "Faharetan'ny fiandrasana",
      value: attentePrioritaire ? `~${attentePrioritaire.moyenne_min} min` : '—',
      icon: Timer,
      tone: 'bg-red-soft text-red',
    },
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
