import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Hospital,
  LogIn,
  Eye,
  EyeOff,
  CalendarCheck,
  ClipboardList,
  HeartPulse,
  BellRing,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleHome } from '@/lib/auth';
import FlagStripe from '@/components/FlagStripe';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// // ============ OWNER: Jess (auth partagée) ============
const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court'),
});

const DEMO_ACCOUNTS = [
  { role: 'Patient', email: 'marie.dupont@demo.fr', password: 'demo123' },
  { role: 'Agent', email: 'agent.accueil@demo.fr', password: 'demo123' },
  { role: 'Médecin', email: 'jean.martin@demo.fr', password: 'demo123' },
];

const FEATURES = [
  { icon: CalendarCheck, title: 'Rendez-vous en ligne', text: 'Réservez un créneau avec le bon médecin, 24h/24.' },
  { icon: ClipboardList, title: 'File d\'attente temps réel', text: 'Distribuez et suivez les tickets au guichet.' },
  { icon: HeartPulse, title: 'Urgences priorisées', text: 'Triage automatique ROUGE → VERT sur les constantes vitales.' },
  { icon: BellRing, title: 'Alertes et suivi', text: 'Appel du patient en salle et statut du ticket en direct.' },
  { icon: MapPin, title: 'Cartographie', text: 'Tous les établissements de santé de la région.' },
];

function Brand({ compact }) {
  return (
    <div className="flex items-center gap-3 text-white">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
        <Hospital className="h-6 w-6" />
      </div>
      <div>
        <p className="text-lg font-bold leading-none">Tsiry</p>
        <p className="text-xs text-white/70">Système de Gestion Hospitalière</p>
      </div>
      {!compact && (
        <div className="ml-2 hidden items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 sm:flex">
          <ShieldCheck className="h-3.5 w-3.5" />
          Connexion sécurisée
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const { setValue } = form;

  async function handleSubmit(values) {
    try {
      const user = await login(values.email, values.password);
      navigate(getRoleHome(user.role));
    } catch (err) {
      form.setError('root', {
        message: err.response?.data?.error || 'Connexion impossible.',
      });
    }
  }

  function fillDemo(account) {
    setValue('email', account.email, { shouldValidate: true });
    setValue('password', account.password);
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-emerald-100/60">
      <FlagStripe className="h-1.5 w-full shrink-0" />

      <div className="grid flex-1 lg:grid-cols-2">
        {/* Panneau marque — masqué sur mobile */}
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-white lg:flex lg:flex-col">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />

          <div className="relative flex flex-1 flex-col justify-between p-12">
            <Brand />

            <div className="max-w-md space-y-8">
              <div className="space-y-3">
                <h1 className="text-4xl font-bold leading-tight">
                  Votre santé,<br />simplifiée du guichet à la salle de soins.
                </h1>
                <p className="text-emerald-100/80">
                  Une plateforme unique pour prendre rendez-vous, gérer la file d'attente
                  et prioriser les urgences.
                </p>
              </div>

              <ul className="space-y-5">
                {FEATURES.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="text-sm text-emerald-100/70">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-emerald-100/50">
              © {new Date().getFullYear()} Tsiry — Système de Gestion Hospitalière
            </p>
          </div>
        </aside>

        {/* Colonne formulaire */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between p-6 text-primary lg:hidden">
            <Brand compact />
          </div>

          <div className="flex flex-1 flex-col items-center justify-center p-4 pb-10 sm:p-8">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-2xl">Connexion</CardTitle>
                <CardDescription>
                  Accédez à votre espace selon votre rôle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="vous@exemple.fr" autoComplete="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {form.formState.errors.root && (
                      <Alert variant="destructive">
                        <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                      <LogIn className="h-4 w-4" />
                      {form.formState.isSubmitting ? 'Connexion…' : 'Se connecter'}
                    </Button>
                  </form>
                </Form>

                <div className="mt-6 rounded-lg border bg-muted/50 p-4">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Comptes de démonstration
                  </p>
                  <div className="space-y-2">
                    {DEMO_ACCOUNTS.map((acc) => (
                      <button
                        key={acc.email}
                        type="button"
                        onClick={() => fillDemo(acc)}
                        className="block w-full rounded-md border bg-background px-3 py-2 text-left text-xs hover:bg-accent"
                      >
                        <span className="font-medium">{acc.role}</span> — {acc.email}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <Link to="/carte" className="hover:text-primary">Carte hôpitaux</Link>
                  <Link to="/kiosque" className="hover:text-primary">Kiosque</Link>
                  <Link to="/moniteur" className="hover:text-primary">Moniteur</Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
