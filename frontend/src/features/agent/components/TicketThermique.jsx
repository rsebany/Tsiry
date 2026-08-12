import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Ticket } from 'lucide-react';

// ============ OWNER: Jess (UC4 - reçu thermique du ticket) ============
// Impression (window.print) du reçu + réimpression depuis la file (autoCloseMs=null).
export default function TicketThermique({
  ticket,
  onClose,
  serviceName = 'Hopitaly Foibe - Sampan-draharaha vonjy maika',
  autoCloseMs = 10000,
}) {
  useEffect(() => {
    if (!ticket || autoCloseMs == null) return undefined;
    const timer = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(timer);
  }, [ticket, autoCloseMs, onClose]);

  const dateFormatee = new Date(ticket.heure_creation).toLocaleDateString('fr-FR');
  const heureFormatee = new Date(ticket.heure_creation).toLocaleTimeString('fr-FR');
  const statutUrl = ticket.id_ticket
    ? `${window.location.origin}/patient/ticket/${ticket.id_ticket}`
    : null;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm text-center">
        <div id="ticket-receipt">
          <DialogHeader>
            <DialogTitle>{serviceName}</DialogTitle>
            <DialogDescription>FANDRAISANA</DialogDescription>
          </DialogHeader>

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-xl bg-primary text-3xl font-bold text-white">
            {String(ticket.numero).padStart(2, '0')}
          </div>

          <p className="text-sm text-text-muted">
            {dateFormatee} — {heureFormatee}
          </p>
          <p className="font-semibold text-foreground">
            {ticket.patient_nom} {ticket.patient_prenom}
          </p>

          {statutUrl && (
            <div className="mx-auto rounded-lg border bg-white p-3">
              <QRCodeSVG value={statutUrl} size={120} />
            </div>
          )}
        </div>

        <div className="no-print space-y-2">
          {ticket.id_ticket && (
            <Button asChild variant="outline" onClick={onClose}>
              <Link to={`/patient/ticket/${ticket.id_ticket}`}>
                <Ticket className="h-4 w-4" />
                Araho ny tiketoko eo amin'ny efitra fiandrasana
              </Link>
            </Button>
          )}
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Hanonta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
