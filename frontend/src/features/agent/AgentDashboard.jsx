import { Link } from 'react-router-dom';
import { AlarmClock, ArrowRight, ClipboardList, Ticket, Users } from 'lucide-react';
import QueueStats from '@/features/agent/components/QueueStats';
import useFileAttente from '@/features/agent/hooks/useFileAttente';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/medisaas';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

// ============ Medisaas — Tableau de bord agent ============
// KPIs de la file + accès rapides (ticket / file / triage).
const ACTIONS = [
  {
    to: '/agent/file-attente',
    title: 'Distribuer un ticket',
    description: 'Créer un ticket pour un patient présent ou une entrée manuelle.',
    icon: Ticket,
    button: 'Ouvrir la distribution',
    variant: 'primary',
    tone: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    to: '/agent/file-attente',
    title: 'File d\u2019attente',
    description: 'Appeler et clôturer les tickets en cours, urgences en tête.',
    icon: Users,
    button: 'Gérer la file',
    variant: 'outline',
    tone: 'bg-blue-500/10 text-blue-600',
  },
  {
    to: '/agent/urgences',
    title: 'Déclarer une urgence',
    description: 'Prioriser un cas critique uniquement via son numéro de ticket.',
    icon: AlarmClock,
    button: 'Déclarer une urgence',
    variant: 'danger',
    tone: 'bg-red-500/10 text-red-600',
  },
];

const VARIANTS = { danger: 'danger', outline: 'outline', primary: 'primary' };

export default function AgentDashboard() {
  const { user } = useAuth();
  const { stats, loading } = useFileAttente();

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Bonjour, {user?.prenom}
          </h1>
          <p className="text-sm text-slate-500">
            File d&apos;attente et triage des urgences du jour.
          </p>
        </div>
        <Button size="lg" asChild>
          <Link to="/agent/file-attente">
            <ClipboardList className="h-5 w-5" />
            Gérer la file
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
              <CardTitle className="flex items-center gap-2">
                <span className={cn('flex h-9 w-9 items-center justify-center rounded-xl', tone)}>
                  <Icon className="h-5 w-5" />
                </span>
                {title}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant={VARIANTS[variant]}>
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