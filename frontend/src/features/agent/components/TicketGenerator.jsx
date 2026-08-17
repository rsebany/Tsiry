import { AlertTriangle, Hash, Ticket, User } from 'lucide-react';
import useTicketGenerator from '@/features/agent/hooks/useTicketGenerator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import TicketThermique from '@/features/agent/components/TicketThermique';

// Toute la logique vit dans useTicketGenerator (réimpression gérée par la file).
export default function TicketGenerator({ onTicketGenerated }) {
  const {
    form,
    patientsPresent,
    loadingPatients,
    submitting,
    ticket,
    selectedRdv,
    manualEntry,
    handleSelectPresent,
    handleManualChange,
    submit,
    closeTicket,
  } = useTicketGenerator();

  function handleSubmit(values) {
    return submit(values, (t) => onTicketGenerated?.(t));
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-soft text-primary">
              <Ticket className="h-5 w-5" />
            </span>
            Mizara tiketo
          </CardTitle>
          <CardDescription>
            Sorato ny marary tonga eto an-toerana na ampidiro an-tanana.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {patientsPresent.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="present-select">Marary tonga</Label>
              <Select value={selectedRdv} onValueChange={handleSelectPresent}>
                <SelectTrigger id="present-select" disabled={loadingPatients}>
                  <SelectValue placeholder="— Mifidiana marary tonga —" />
                </SelectTrigger>
                <SelectContent>
                  {patientsPresent.map((p) => (
                    <SelectItem key={p.id_rdv} value={String(p.id_rdv)}>
                      {p.patient_prenom} {p.patient_nom} (Fotoana #{p.id_rdv})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="patient_nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anaran'ny marary</FormLabel>
                    <FormControl>
                      <Input
                        icon={<User className="h-4 w-4 text-text-muted" />}
                        placeholder="ohatra. RABE"
                        value={field.value ?? ''}
                        onChange={(e) => {
                          field.onChange(e);
                          handleManualChange();
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
                    <FormLabel>Fanampin'anaran'ny marary</FormLabel>
                    <FormControl>
                      <Input
                        icon={<User className="h-4 w-4 text-text-muted" />}
                        placeholder="ohatra. Jean"
                        value={field.value ?? ''}
                        onChange={(e) => {
                          field.onChange(e);
                          handleManualChange();
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
                    <FormLabel>ID ny marary (tsy voatery)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        icon={<Hash className="h-4 w-4 text-text-muted" />}
                        placeholder="avelao foana raha tsy misy fifamatorana"
                        value={field.value ?? ''}
                        onChange={(e) => {
                          field.onChange(e);
                          handleManualChange();
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
                      <p className="font-bold">Marary soratana an-tanana</p>
                      <p>
                        Tsy ho voarohirohy amin'ny marary voasoratra ity tiketo ity : ny laharam-pahamehana
                        vonjy maika dia tsy azo ampiharina. Fidio ny marary tonga raha azo atao.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting ? 'Famoronana mitohy…' : 'Mizara tiketo'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {ticket && <TicketThermique ticket={ticket} onClose={closeTicket} />}
    </>
  );
}
