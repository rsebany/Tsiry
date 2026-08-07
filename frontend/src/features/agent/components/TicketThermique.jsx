import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/medisaas';
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

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-b from-emerald-500 to-emerald-600 text-3xl font-extrabold text-white shadow-[0_8px_20px_rgba(5,150,105,0.35)]">
          {String(ticket.numero).padStart(2, '0')}
        </div>

        <p className="text-sm text-slate-500">
          {dateFormatee} — {heureFormatee}
        </p>
        <p className="font-semibold text-slate-900">
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
