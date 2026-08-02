import { CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/constants';

// ============ OWNER: Nathan (UC1) ============
// // TODO Nathan: ajouter un bouton "Annuler" ici quand le backend l'exposera.
export default function BookingSuccessBanner({ rdv, onNewBooking }) {
  return (
    <Alert variant="success">
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle className="mb-1">Rendez-vous confirmé</AlertTitle>
      <AlertDescription>
        {rdv?.medecin_prenom || 'Votre'} rendez-vous est planifié le{' '}
        <strong>{formatDate(rdv?.date_heure)}</strong>
        {rdv?.medecin_nom ? ` avec Dr ${rdv.medecin_prenom} ${rdv.medecin_nom}` : ''}.
      </AlertDescription>
      {onNewBooking && (
        <div className="mt-3">
          <Button size="sm" variant="outline" onClick={onNewBooking}>
            Réserver un autre créneau
          </Button>
        </div>
      )}
    </Alert>
  );
}
