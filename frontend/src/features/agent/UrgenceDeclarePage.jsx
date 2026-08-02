import { AlarmClock } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import useUrgenceDeclare from '@/features/agent/hooks/useUrgenceDeclare';
import UrgenceResultPanel from '@/features/agent/components/UrgenceResultPanel';

// ============ OWNER: Jess (UC1/UC8 - formulaire d'urgence) ============
// // TODO Jess: afficher les constantes vitales du dernier cas du patient.
export default function UrgenceDeclarePage() {
  const { form, medecins, result, loading, submit } = useUrgenceDeclare();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Déclaration d'urgence"
        description="Saisie des constantes vitales pour triage automatique (UC7 / UC8)."
      />

      {result && <UrgenceResultPanel result={result} />}

      <Card>
        <CardHeader>
          <CardTitle>Constantes vitales</CardTitle>
          <CardDescription>
            Le score de gravité est calculé automatiquement côté serveur.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
              <FormField
                control={form.control}
                name="id_patient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID patient</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="id_medecin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Médecin référent (optionnel)</FormLabel>
                    <Select onValueChange={field.onChange} value={String(field.value || '')}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="— Aucun —" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">— Aucun —</SelectItem>
                        {medecins.map((m) => (
                          <SelectItem key={m.id_utilisateur} value={String(m.id_utilisateur)}>
                            Dr {m.prenom} {m.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="pouls"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pouls (bpm)</FormLabel>
                      <FormControl>
                        <Input type="number" min={30} max={200} placeholder="ex. 88" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tension_systolique"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tension syst. (mmHg)</FormLabel>
                      <FormControl>
                        <Input type="number" min={60} max={250} placeholder="ex. 120" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="saturation_o2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Saturation O₂ (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min={70} max={100} placeholder="ex. 96" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Alert variant="warning">
                <AlarmClock className="h-4 w-4" />
                <AlertTitle>Triage automatique</AlertTitle>
                <AlertDescription>
                  ROUGE/ORANGE activent une alerte et priorisent le patient dans la file.
                </AlertDescription>
              </Alert>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Analyse en cours…' : 'Déclarer le cas'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
