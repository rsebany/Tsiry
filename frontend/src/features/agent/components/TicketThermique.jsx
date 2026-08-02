import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Ticket } from 'lucide-react';

// ============ OWNER: Jess (UC4 - reçu thermique du ticket) ============
// // TODO Jess: proposer une impression (window.print) du reçu.
export default function TicketThermique({
  ticket,
  onClose,
  serviceName = 'Hôpital Central - Service Urgences',
}) {
  useEffect(() => {
    if (!ticket) return undefined;
    const timer = setTimeout(onClose, 10000);
    return () => clearTimeout(timer);
  }, [ticket, onClose]);

  const dateFormatee = new Date(ticket.heure_creation).toLocaleDateString('fr-FR');
  const heureFormatee = new Date(ticket.heure_creation).toLocaleTimeString('fr-FR');
  const statutUrl = ticket.id_ticket
    ? `${window.location.origin}/patient/ticket/${ticket.id_ticket}`
    : null;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm text-center">
        <DialogHeader>
          <DialogTitle>{serviceName}</DialogTitle>
          <DialogDescription>GUICHET D&apos;ACCUEIL</DialogDescription>
        </DialogHeader>

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-xl bg-primary text-3xl font-bold text-primary-foreground">
          {String(ticket.numero).padStart(2, '0')}
        </div>

        <p className="text-sm text-muted-foreground">
          {dateFormatee} — {heureFormatee}
        </p>
        <p className="font-medium">
          {ticket.patient_nom} {ticket.patient_prenom}
        </p>

        {statutUrl && (
          <div className="mx-auto rounded-lg border bg-white p-3">
            <QRCodeSVG value={statutUrl} size={120} />
          </div>
        )}

        {ticket.id_ticket && (
          <Button asChild variant="outline" onClick={onClose}>
            <Link to={`/patient/ticket/${ticket.id_ticket}`}>
              <Ticket className="h-4 w-4" />
              Suivre mon ticket en salle d&apos;attente
            </Link>
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
