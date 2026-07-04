import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { QRCodeSVG } from 'qrcode.react';

export default function TicketThermique({ ticket, onClose, serviceName = 'Service Hospitalier' }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 10000);
    return () => clearTimeout(timer);
  }, [onClose]);
  const dateFormatee = new Date(ticket.heure_creation).toLocaleDateString('fr-FR');
  const heureFormatee = new Date(ticket.heure_creation).toLocaleTimeString('fr-FR');
  const statutUrl = ticket.id_ticket
    ? `${window.location.origin}/patient/ticket/${ticket.id_ticket}`
    : null;
  return createPortal(
    <div className="ticket-modal-overlay" onClick={onClose} role="presentation">
      <div className="ticket-modal" onClick={(e) => e.stopPropagation()} role="dialog">
        <button type="button" className="ticket-modal-close" onClick={onClose} aria-label="Fermer">
          ✕
        </button>
        <h2>{serviceName}</h2>
        <p className="ticket-modal-sub">GUICHET D&apos;ACCUEIL</p>
        <div className="ticket-modal-numero">{String(ticket.numero).padStart(2, '0')}</div>
        <p>
          {dateFormatee} — {heureFormatee}
        </p>
        <p>
          {ticket.patient_nom} {ticket.patient_prenom}
        </p>
        {statutUrl && (
          <div className="ticket-modal-qrcode">
            <QRCodeSVG value={statutUrl} size={120} />
          </div>
        )}
        {ticket.id_ticket && (
          <Link
            to={`/patient/ticket/${ticket.id_ticket}`}
            className="booking-success-link"
            onClick={onClose}
          >
            Suivre mon ticket en salle d&apos;attente
          </Link>
        )}
      </div>
    </div>,
    document.body
  );
}
