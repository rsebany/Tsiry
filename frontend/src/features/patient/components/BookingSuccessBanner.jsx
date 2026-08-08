import { CheckCircle2, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { formatDate, kiosqueUrl } from '@/lib/constants';

// ============ OWNER: Nathan (UC1) ============
// QR UC3 (Burin) : le patient scanne ce code à la borne pour s'enregistrer sans saisie.
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

      {rdv?.id_rdv && (
        <div className="mt-4 flex items-center gap-3">
          <div className="rounded-lg border bg-white p-2">
            <QRCodeSVG value={kiosqueUrl(rdv.id_rdv)} size={104} />
          </div>
          <div className="space-y-1 text-sm">
            <p className="flex items-center gap-1 font-medium text-foreground">
              <QrCode className="h-4 w-4" />
              Enregistrement à la borne
            </p>
            <p className="text-xs text-muted-foreground">
              Scannez ce code à la borne d&apos;accueil le jour J (ou notez votre n° de RDV :{' '}
              <strong className="text-foreground">{rdv.id_rdv}</strong>).
            </p>
          </div>
        </div>
      )}

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
