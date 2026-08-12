import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleHome } from '@/lib/auth';
import { register as registerApi, forgotPassword as forgotApi, resetPassword as resetApi } from '@/services/authService';
import { errorMessage } from '@/services/api';
import FlagStripe from '@/components/FlagStripe';
import logo from '@/assets/image/logo.png';
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
  email: z.string().email('Email tsy mety'),
  password: z.string().min(6, 'Fohy ny tenimiafina'),
});

const registerSchema = z
  .object({
    nom: z.string().trim().min(2, 'Mila anarana (2 litera farafahakeliny)'),
    prenom: z.string().trim().min(2, 'Mila fanampin\'anarana (2 litera farafahakeliny)'),
    email: z.string().email('Email tsy mety'),
    password: z.string().min(6, '6 litera farafahakeliny'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Tsy mifanentana ny tenimiafina',
  });

const forgotSchema = z.object({
  email: z.string().email('Email tsy mety'),
});

const resetSchema = z
  .object({
    password: z.string().min(6, '6 litera farafahakeliny'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Tsy mifanentana ny tenimiafina',
  });

const DEMO_ACCOUNTS = [
  { role: 'Marary', email: 'marie.dupont@demo.fr', password: 'demo123' },
  { role: 'Mpandraharaha', email: 'agent.accueil@demo.fr', password: 'demo123' },
  { role: 'Dokotera', email: 'jean.martin@demo.fr', password: 'demo123' },
];

function PasswordInput({ field, placeholder = '••••••••' }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        autoComplete="current-password"
        {...field}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Afeno ny tenimiafina' : 'Asao ny tenimiafina'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function RootError({ message }) {
  if (!message) return null;
  return (
    <Alert variant="destructive">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // login | register | forgot | reset
  const [forgotToken, setForgotToken] = useState(null);
  const [notice, setNotice] = useState('');

  async function handleLogin(values) {
    try {
      const user = await login(values.email, values.password);
      navigate(getRoleHome(user.role));
    } catch (err) {
      loginForm.setError('root', { message: errorMessage(err, 'Tsy afaka miditra.') });
    }
  }

  async function handleRegister(values) {
    try {
      await registerApi({
        nom: values.nom,
        prenom: values.prenom,
        email: values.email,
        password: values.password,
      });
      toast.success('Voasoratra ny kaonty. Miditra izao…');
      const user = await login(values.email, values.password);
      navigate(getRoleHome(user.role));
    } catch (err) {
      registerForm.setError('root', { message: errorMessage(err, 'Tsy afaka misoratra.') });
    }
  }

  async function handleForgot(values) {
    try {
      const res = await forgotApi(values.email);
      setNotice(res.message);
      if (res.resetToken) {
        setForgotToken(res.resetToken);
        setMode('reset');
      }
    } catch (err) {
      forgotForm.setError('root', { message: errorMessage(err, 'Tsy afaka ny asa.') });
    }
  }

  async function handleReset(values) {
    try {
      const res = await resetApi(forgotToken, values.password);
      toast.success(res.message || 'Nohavaozina ny tenimiafina.');
      resetForm.reset();
      setForgotToken(null);
      setMode('login');
    } catch (err) {
      resetForm.setError('root', { message: errorMessage(err, 'Tsy afaka mamerina ny tenimiafina.') });
    }
  }

  const loginForm = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });
  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { nom: '', prenom: '', email: '', password: '', confirmPassword: '' },
  });
  const forgotForm = useForm({ resolver: zodResolver(forgotSchema), defaultValues: { email: '' } });
  const resetForm = useForm({ resolver: zodResolver(resetSchema), defaultValues: { password: '', confirmPassword: '' } });

  function fillDemo(account) {
    loginForm.setValue('email', account.email, { shouldValidate: true });
    loginForm.setValue('password', account.password);
  }

  function goTo(m) {
    setMode(m);
    setNotice('');
  }

  const tabActive = (m) =>
    `flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      mode === m ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <FlagStripe className="h-1.5 w-full shrink-0" />

      <div className="grid flex-1 lg:grid-cols-2">
        {/* Panneau marque — logo, masqué sur mobile */}
        <aside className="relative hidden items-center justify-center bg-green-deep lg:flex">
          <img
            src={logo}
            alt="Tsiry"
            className="h-56 w-56 object-contain drop-shadow-[0_0_16px_rgba(255,255,255,0.28)]"
          />
        </aside>

        {/* Colonne formulaire */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between p-6 text-primary lg:hidden">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Tsiry" className="h-8 w-8 object-contain" />
              <span className="text-lg font-bold">Tsiry</span>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center p-4 pb-10 sm:p-8">
            <Card className="w-full max-w-md">
              <CardHeader>
                <div className="mb-4 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
                  <button type="button" className={tabActive('login')} onClick={() => goTo('login')}>
                    Fidirana
                  </button>
                  <button type="button" className={tabActive('register')} onClick={() => goTo('register')}>
                    Fisoratana
                  </button>
                </div>
                {mode === 'login' && (
                  <>
                    <CardTitle className="text-2xl">Tonga soa !</CardTitle>
                    <CardDescription>Midira ao amin'ny faritra misy anao araka ny andraikitra</CardDescription>
                  </>
                )}
                {mode === 'register' && (
                  <>
                    <CardTitle className="text-2xl">Mamorona kaonty</CardTitle>
                    <CardDescription>Misorata hitantana ny fotoananao</CardDescription>
                  </>
                )}
                {mode === 'forgot' && (
                  <>
                    <CardTitle className="text-2xl">Very ny tenimiafina</CardTitle>
                    <CardDescription>Ampidiro ny email anao mba hamerenana azy</CardDescription>
                  </>
                )}
                {mode === 'reset' && (
                  <>
                    <CardTitle className="text-2xl">Tenimiafina vaovao</CardTitle>
                    <CardDescription>Safidio tenimiafina vaovao</CardDescription>
                  </>
                )}
              </CardHeader>
              <CardContent>
                {mode === 'login' && (
                  <>
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="ianao@ohatra.mg" autoComplete="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Tenimiafina</FormLabel>
                                <button
                                  type="button"
                                  onClick={() => goTo('forgot')}
                                  className="text-xs text-primary hover:underline"
                                >
                                  Very ny tenimiafina ?
                                </button>
                              </div>
                              <FormControl>
                                <PasswordInput field={field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <RootError message={loginForm.formState.errors.root?.message} />
                        <Button type="submit" className="w-full" disabled={loginForm.formState.isSubmitting}>
                          <LogIn className="h-4 w-4" />
                          {loginForm.formState.isSubmitting ? 'Miditra…' : 'Hiditra'}
                        </Button>
                      </form>
                    </Form>

                    <div className="mt-6 rounded-lg border bg-muted/50 p-4">
                      <p className="mb-2 text-xs font-medium text-muted-foreground">
                        Kaonty fanandramana
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
                      <Link to="/carte" className="hover:text-primary">Sarintany hopitaly</Link>
                      <Link to="/kiosque" className="hover:text-primary">Kioska</Link>
                      <Link to="/moniteur" className="hover:text-primary">Moniteur</Link>
                    </div>
                  </>
                )}

                {mode === 'register' && (
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={registerForm.control}
                          name="nom"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Anarana</FormLabel>
                              <FormControl>
                                <Input placeholder="ohatra: Rakoto" autoComplete="family-name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="prenom"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fanampin'anarana</FormLabel>
                              <FormControl>
                                <Input placeholder="ohatra: Nomena" autoComplete="given-name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="ianao@ohatra.mg" autoComplete="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tenimiafina</FormLabel>
                            <FormControl>
                              <PasswordInput field={field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hamafiso ny tenimiafina</FormLabel>
                            <FormControl>
                              <PasswordInput field={field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <RootError message={registerForm.formState.errors.root?.message} />
                      <Button type="submit" className="w-full" disabled={registerForm.formState.isSubmitting}>
                        <UserPlus className="h-4 w-4" />
                        {registerForm.formState.isSubmitting ? 'Foronana…' : 'Misoratra'}
                      </Button>
                    </form>
                  </Form>
                )}

                {mode === 'forgot' && (
                  <Form {...forgotForm}>
                    <form onSubmit={forgotForm.handleSubmit(handleForgot)} className="space-y-4">
                      {notice && (
                        <Alert variant="success">
                          <CheckCircle2 className="h-4 w-4" />
                          <AlertDescription>{notice}</AlertDescription>
                        </Alert>
                      )}
                      <FormField
                        control={forgotForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="ianao@ohatra.mg" autoComplete="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <RootError message={forgotForm.formState.errors.root?.message} />
                      <Button type="submit" className="w-full" disabled={forgotForm.formState.isSubmitting}>
                        <KeyRound className="h-4 w-4" />
                        {forgotForm.formState.isSubmitting ? 'Alefa…' : 'Handefa ny rohy'}
                      </Button>
                    </form>
                  </Form>
                )}

                {mode === 'reset' && (
                  <Form {...resetForm}>
                    <form onSubmit={resetForm.handleSubmit(handleReset)} className="space-y-4">
                      <FormField
                        control={resetForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tenimiafina vaovao</FormLabel>
                            <FormControl>
                              <PasswordInput field={field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={resetForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hamafiso ny tenimiafina</FormLabel>
                            <FormControl>
                              <PasswordInput field={field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <RootError message={resetForm.formState.errors.root?.message} />
                      <Button type="submit" className="w-full" disabled={resetForm.formState.isSubmitting}>
                        <KeyRound className="h-4 w-4" />
                        {resetForm.formState.isSubmitting ? 'Fanavaozana…' : 'Hamerenina'}
                      </Button>
                    </form>
                  </Form>
                )}

                {mode !== 'login' && (
                  <button
                    type="button"
                    onClick={() => goTo('login')}
                    className="mt-4 flex w-full items-center justify-center gap-1 text-xs text-muted-foreground hover:text-primary"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Hiverina amin'ny fidirana
                  </button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
