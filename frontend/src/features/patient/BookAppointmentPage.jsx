import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarPlus } from 'lucide-react';
import { rdvSchema, minDatetime } from '@/features/patient/validation/rdvSchema';
import useBookAppointment from '@/features/patient/hooks/useBookAppointment';
import BookingSuccessBanner from '@/features/patient/components/BookingSuccessBanner';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';

// ============ OWNER: Nathan (UC1 - prendre rendez-vous) ============
// // TODO Nathan: gérer la recherche de créneaux par médecin (backend renvoie 409 en conflit).
export default function BookAppointmentPage() {
  const { specialites, medecins, loadingMedecins, bookingError, conflict, lastRdv, loadSpecialites, loadMedecins, submit } = useBookAppointment();
  const [specialite, setSpecialite] = useState('');

  const form = useForm({
    resolver: zodResolver(rdvSchema),
    defaultValues: { id_medecin: '', date_heure: '', motif: '' },
  });

  useEffect(() => {
    loadSpecialites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(values) {
    const result = await submit(values);
    if (result.success) {
      form.reset();
    }
  }

  async function handleSpecialiteChange(value) {
    setSpecialite(value);
    await loadMedecins(value || undefined);
    form.setValue('id_medecin', '');
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prendre rendez-vous"
        description="Réservez un créneau avec un médecin de l'établissement."
      />

      {lastRdv && (
        <BookingSuccessBanner
          rdv={lastRdv}
          onNewBooking={() => form.reset()}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Nouveau rendez-vous</CardTitle>
          <CardDescription>Un email de confirmation sera disponible dans votre historique.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormItem>
                <FormLabel>Spécialité</FormLabel>
                <Select value={specialite} onValueChange={handleSpecialiteChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les spécialités" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Toutes les spécialités</SelectItem>
                    {specialites.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>

              <FormField
                control={form.control}
                name="id_medecin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Médecin</FormLabel>
                    {loadingMedecins ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Select onValueChange={field.onChange} value={String(field.value || '')}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un médecin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {medecins.length === 0 && (
                            <SelectItem value="" disabled>Aucun médecin</SelectItem>
                          )}
                          {medecins.map((m) => (
                            <SelectItem key={m.id_utilisateur} value={String(m.id_utilisateur)}>
                              Dr {m.prenom} {m.nom} {m.specialite ? `— ${m.specialite}` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date_heure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date et heure</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        min={minDatetime()}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Du lundi au samedi, entre 8h et 18h.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="motif"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motif (optionnel)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Décrivez le motif de la consultation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {conflict && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Ce créneau est déjà réservé pour ce médecin. Choisissez un autre horaire.
                  </AlertDescription>
                </Alert>
              )}
              {bookingError && !conflict && (
                <Alert variant="destructive">
                  <AlertDescription>{bookingError}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                <CalendarPlus className="h-4 w-4" />
                {form.formState.isSubmitting ? 'Réservation…' : 'Confirmer le rendez-vous'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
