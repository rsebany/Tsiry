import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { AlertTriangle, Hash, Ticket, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getPatientsPresent, generateTicket } from '@/services/ticketService';
import { errorMessage } from '@/services/api';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import TicketThermique from '@/features/agent/components/TicketThermique';

const ticketSchema = z.object({
  patient_nom: z.string().trim().min(2, 'Nom requis (2 caractères min.)'),
  patient_prenom: z.string().trim().min(2, 'Prénom requis (2 caractères min.)'),
  id_patient: z.coerce.number().int().positive().nullish(),
});

// ============ Medisaas — Distribution de ticket (UC3 + UC4) ============
// // TODO Jess: réimprimer un ticket depuis la file (conserve l'ancien dernier ticket imprimé).
export default function TicketGenerator({ onTicketGenerated }) {
  const [patientsPresent, setPatientsPresent] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [selectedRdv, setSelectedRdv] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ticket, setTicket] = useState(null);

  const form = useForm({
    resolver: zodResolver(ticketSchema),
    defaultValues: { patient_nom: '', patient_prenom: '', id_patient: null },
  });

  useEffect(() => {
    let mounted = true;
    getPatientsPresent()
      .then((list) => {
        if (mounted) setPatientsPresent(list || []);
      })
      .catch(() => {
        if (mounted) setPatientsPresent([]);
      })
      .finally(() => {
        if (mounted) setLoadingPatients(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  function handleSelectPresent(idRdv) {
    setSelectedRdv(idRdv);
    if (!idRdv) {
      form.setValue('id_patient', null);
      return;
    }
    const found = patientsPresent.find((p) => String(p.id_rdv) === String(idRdv));
    if (found) {
      form.setValue('patient_nom', found.patient_nom || '');
      form.setValue('patient_prenom', found.patient_prenom || '');
      form.setValue('id_patient', found.id_patient || null);
    }
  }

  function breakLink() {
    if (selectedRdv) {
      setSelectedRdv('');
      form.setValue('id_patient', null);
    }
  }

  async function submit(values) {
    setSubmitting(true);
    setTicket(null);
    try {
      const res = await generateTicket(values);
      if (res.success) {
        toast.success(`Ticket #${res.data.numero} créé`);
        setTicket(res.data);
        form.reset({ patient_nom: '', patient_prenom: '', id_patient: null });
        setSelectedRdv('');
        onTicketGenerated?.(res.data);
      } else {
        toast.error(res.message || 'Création impossible');
      }
    } catch (err) {
      toast.error(errorMessage(err, 'Création du ticket impossible'));
    } finally {
      setSubmitting(false);
    }
  }

  const watchNom = form.watch('patient_nom');
  const watchPrenom = form.watch('patient_prenom');
  const manualEntry = !selectedRdv && (watchNom || watchPrenom);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-soft text-primary">
              <Ticket className="h-5 w-5" />
            </span>
            Distribuer un ticket
          </CardTitle>
          <CardDescription>
            Enregistrez un patient présent sur site ou saisissez manuellement (UC3 + UC4).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {patientsPresent.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="present-select">Patients présents (UC3)</Label>
              <Select value={selectedRdv} onValueChange={handleSelectPresent}>
                <SelectTrigger id="present-select" disabled={loadingPatients}>
                  <SelectValue placeholder="— Sélectionner un patient présent —" />
                </SelectTrigger>
                <SelectContent>
                  {patientsPresent.map((p) => (
                    <SelectItem key={p.id_rdv} value={String(p.id_rdv)}>
                      {p.patient_prenom} {p.patient_nom} (RDV #{p.id_rdv})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
              <FormField
                control={form.control}
                name="patient_nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du patient</FormLabel>
                    <FormControl>
                      <Input
                        icon={<User className="h-4 w-4 text-text-muted" />}
                        placeholder="ex. RABE"
                        value={field.value ?? ''}
                        onChange={(e) => {
                          field.onChange(e);
                          breakLink();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="patient_prenom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom du patient</FormLabel>
                    <FormControl>
                      <Input
                        icon={<User className="h-4 w-4 text-text-muted" />}
                        placeholder="ex. Jean"
                        value={field.value ?? ''}
                        onChange={(e) => {
                          field.onChange(e);
                          breakLink();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="id_patient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identifiant patient (optionnel)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        icon={<Hash className="h-4 w-4 text-text-muted" />}
                        placeholder="laisser vide pour un ticket sans liaison"
                        value={field.value ?? ''}
                        onChange={(e) => {
                          field.onChange(e);
                          breakLink();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {manualEntry && (
                <div className="rounded-lg border border-amber-border bg-amber-soft p-4 text-amber">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
                    <div className="space-y-1 text-sm">
                      <p className="font-bold">Patient saisi manuellement</p>
                      <p>
                        Le ticket ne sera pas lié à un patient enregistré : la priorité urgence (UC8)
                        ne pourra pas s&apos;appliquer. Sélectionnez le patient présent si possible.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting ? 'Génération en cours…' : 'Distribuer un ticket'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {ticket && <TicketThermique ticket={ticket} onClose={() => setTicket(null)} />}
    </>
  );
}