import { CheckCircle2, Hash, Search, User } from 'lucide-react';
import useKiosqueRegister from '@/features/kiosque/hooks/useKiosqueRegister';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/constants';

// ============ OWNER: Burin (UC3 - borne d'enregistrement) ============
// // TODO Burin: version "scan QR" prioritaire — encoder id_rdv dans l'URL (?id_rdv=).
export default function KiosquePanel() {
  const hook = useKiosqueRegister();

  if (hook.confirmed) {
    return (
      <Card className="w-full max-w-lg">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-soft">
            <CheckCircle2 className="h-9 w-9 text-primary" />
          </span>
          <h2 className="text-2xl font-bold">
            Bienvenue {hook.confirmed.patient_prenom} {hook.confirmed.patient_nom}
          </h2>
          <p className="text-muted-foreground">
            Votre présence est enregistrée pour le rendez-vous du{' '}
            <strong className="text-foreground">{formatDate(hook.confirmed.date_heure)}</strong>.
          </p>
          <p className="text-xs text-muted-foreground">Veuillez vous présenter à l&apos;accueil.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg">
      <CardContent className="pt-6">
        <Tabs value={hook.mode} onValueChange={hook.setMode}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="numero">
              <Hash className="mr-2 h-4 w-4" />
              N° de rendez-vous
            </TabsTrigger>
            <TabsTrigger value="recherche">
              <Search className="mr-2 h-4 w-4" />
              Recherche
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            {hook.mode === 'numero' ? (
              <form onSubmit={hook.handleNumeroSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="kiosk-numero">Numéro de rendez-vous</Label>
                  <Input
                    id="kiosk-numero"
                    inputMode="numeric"
                    placeholder="ex. 3"
                    value={hook.numero}
                    onChange={(e) => hook.setNumero(e.target.value)}
                    className="h-14 text-2xl text-center"
                    autoFocus
                  />
                </div>
                <Button type="submit" size="lg" className="w-full h-14 text-lg" disabled={hook.loading}>
                  {hook.loading ? 'Vérification…' : 'Je suis arrivé(e)'}
                </Button>
              </form>
            ) : (
              <form onSubmit={hook.handleSearchSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="kiosk-nom">Nom</Label>
                  <Input
                    id="kiosk-nom"
                    placeholder="ex. Dupont"
                    value={hook.search.nom}
                    onChange={(e) => hook.setSearch({ ...hook.search, nom: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kiosk-tel">Téléphone</Label>
                  <Input
                    id="kiosk-tel"
                    inputMode="tel"
                    placeholder="ex. 034 12 345 67"
                    value={hook.search.telephone}
                    onChange={(e) => hook.setSearch({ ...hook.search, telephone: e.target.value })}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full h-14 text-lg" disabled={hook.loading}>
                  <User className="mr-2 h-5 w-5" />
                  {hook.loading ? 'Recherche…' : 'Rechercher mon rendez-vous'}
                </Button>

                {hook.results.length > 0 && (
                  <div className="space-y-2">
                    {hook.results.map((r) => (
                      <button
                        key={r.id_rdv}
                        type="button"
                        onClick={() => hook.register(r.id_rdv)}
                        disabled={hook.loading}
                        className="w-full rounded-lg border p-3 text-left text-sm hover:bg-accent"
                      >
                        <span className="font-medium">
                          {r.patient_prenom} {r.patient_nom}
                        </span>
                        <span className="block text-muted-foreground">
                          {formatDate(r.date_heure)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </form>
            )}

            {hook.error && (
              <div className="mt-4">
                <Alert variant="destructive">
                  <AlertDescription>{hook.error}</AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
