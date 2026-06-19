import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Hospital, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleHome } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DEMO_ACCOUNTS = [
  { role: 'Patient', email: 'marie.dupont@demo.fr', password: 'demo123' },
  { role: 'Agent', email: 'agent.accueil@demo.fr', password: 'demo123' },
  { role: 'Médecin', email: 'jean.martin@demo.fr', password: 'demo123' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await login(email, password);
      navigate(getRoleHome(user.role));
    } catch (err) {
      setError(err.response?.data?.error || 'Connexion impossible.');
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(account) {
    setEmail(account.email);
    setPassword(account.password);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="mb-8 flex items-center gap-3 text-primary">
        <Hospital className="h-10 w-10" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">SGH</h1>
          <p className="text-sm text-muted-foreground">Système de Gestion Hospitalière</p>
        </div>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>Accédez à votre espace selon votre rôle</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.fr"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              <LogIn className="h-4 w-4" />
              {loading ? 'Connexion…' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-6 rounded-lg border bg-muted/50 p-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Comptes démo</p>
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

          <div className="mt-4 flex justify-center gap-4 text-xs text-muted-foreground">
            <Link to="/carte" className="hover:text-primary">Carte hôpitaux</Link>
            <Link to="/kiosque" className="hover:text-primary">Kiosque</Link>
            <Link to="/moniteur" className="hover:text-primary">Moniteur</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
