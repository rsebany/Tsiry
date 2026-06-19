import { Link } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useBookAppointmentForm from '@/hooks/useBookAppointmentForm';
import { BookingSuccessBanner } from '@/components/appointments/AppointmentCard';

export default function BookAppointmentPage() {
  const hook = useBookAppointmentForm();
  const { success, error, initError, handleSubmit, form, specialites, medecins, loading, isFormValid, handleChange } = hook;

  function onSelectChange(name, value) {
    handleChange({ target: { name, value } });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prendre rendez-vous</CardTitle>
        <CardDescription>Sélectionnez une spécialité, un médecin et un créneau horaire.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {initError && (
          <Alert variant="destructive">
            <AlertDescription>{initError}</AlertDescription>
          </Alert>
        )}
        {success && <BookingSuccessBanner rdv={success} />}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div className="space-y-2">
            <Label>Spécialité</Label>
            <Select value={form.specialite} onValueChange={(v) => onSelectChange('specialite', v)} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une spécialité" />
              </SelectTrigger>
              <SelectContent>
                {specialites.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Médecin</Label>
            <Select
              value={form.id_medecin}
              onValueChange={(v) => onSelectChange('id_medecin', v)}
              disabled={loading || !form.specialite}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un médecin" />
              </SelectTrigger>
              <SelectContent>
                {medecins.map((m) => (
                  <SelectItem key={m.id_utilisateur} value={String(m.id_utilisateur)}>
                    Dr {m.prenom} {m.nom} — {m.specialite}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_heure">Date et heure</Label>
            <Input
              id="date_heure"
              name="date_heure"
              type="datetime-local"
              value={form.date_heure}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motif">Motif (optionnel)</Label>
            <Input
              id="motif"
              name="motif"
              value={form.motif}
              onChange={handleChange}
              placeholder="Consultation de contrôle"
              disabled={loading}
            />
          </div>

          <Button type="submit" disabled={loading || !isFormValid}>
            {loading ? 'Traitement…' : 'Confirmer le rendez-vous'}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground">
          <Link to="/patient/rendez-vous" className="text-primary hover:underline">
            Voir mes rendez-vous
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
