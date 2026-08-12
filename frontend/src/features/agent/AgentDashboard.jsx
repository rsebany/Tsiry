import { Link } from 'react-router-dom';
import { AlarmClock, ArrowRight, ClipboardList, Ticket, Users } from 'lucide-react';
import QueueStats from '@/features/agent/components/QueueStats';
import useFileAttente from '@/features/agent/hooks/useFileAttente';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

// ============ Tsiry DS — Tableau de bord agent ============
// KPIs de la file + accès rapides (ticket / file / triage).
const ACTIONS = [
  {
    to: '/agent/file-attente',
    title: 'Mizara tiketo',
    description: 'Mamorona tiketo ho an\'ny marary tonga na fampidirana an-tanana.',
    icon: Ticket,
    button: 'Hanokatra ny fizarana',
    variant: 'default',
    tone: 'bg-green-soft text-primary',
  },
  {
    to: '/agent/file-attente',
    title: 'Filaharana',
    description: 'Antsoy sy arano ny tiketo mitohy, aloha ny vonjy maika.',
    icon: Users,
    button: 'Hitantana ny filaharana',
    variant: 'outline',
    tone: 'bg-info-soft text-info',
  },
  {
    to: '/agent/urgences',
    title: 'Manambara vonjy maika',
    description: 'Omeo laharana ambony ny tranga maika amin\'ny alalan\'ny laharam-tiketo.',
    icon: AlarmClock,
    button: 'Manambara vonjy maika',
    variant: 'danger',
    tone: 'bg-red-soft text-red',
  },
];

export default function AgentDashboard() {
  const { user } = useAuth();
  const { stats, loading } = useFileAttente();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-[28px]">
            Manao ahoana, {user?.prenom}
          </h1>
          <p className="mt-0.5 text-[13.5px] text-text-muted">
            Filaharana sy fanasokajiana ny vonjy maika anio.
          </p>
        </div>
        <Button asChild>
          <Link to="/agent/file-attente">
            <ClipboardList className="h-4 w-4" />
            Hitantana ny filaharana
          </Link>
        </Button>
      </header>

      <QueueStats
        en_attente={loading ? '…' : stats.en_attente}
        en_cours={loading ? '…' : stats.en_cours}
        termines={loading ? '…' : stats.termines}
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {ACTIONS.map(({ to, title, description, icon: Icon, button, variant, tone }) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[16px]">
                <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', tone)}>
                  <Icon className="h-5 w-5" />
                </span>
                {title}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant={variant}>
                <Link to={to} className="justify-center">
                  {button}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}