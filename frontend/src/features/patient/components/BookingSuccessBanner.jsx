import { CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/constants';

// // TODO Nathan: ajouter un bouton "Manao tsy mila" ao anatin'izany rehefa mbola tsy misy backend.
export default function BookingSuccessBanner({ rdv, onNewBooking }) {
  return (
    <Alert variant="success">
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle className="mb-1">Firafarisana voamarina</AlertTitle>
      <AlertDescription>
        Ny firafarisanao no nanorenana tamin'ny{' '}
        <strong>{formatDate(rdv?.date_heure)}</strong>
        {rdv?.medecin_nom ? ` amin'ny Dr ${rdv.medecin_prenom} ${rdv.medecin_nom}` : ''}.
      </AlertDescription>
      {onNewBooking && (
        <div className="mt-3">
          <Button size="sm" variant="outline" onClick={onNewBooking}>
            Manao firafarisana hafa
          </Button>
        </div>
      )}
    </Alert>
  );
}
