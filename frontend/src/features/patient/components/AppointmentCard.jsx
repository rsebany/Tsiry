import { ArrowRight, CalendarDays, Hash, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  formatDate,
  isSameDay,
  kiosqueUrl,
  RDV_STATUTS,
} from '@/lib/constants';

// ============ OWNER: Nathan (UC2) ============
// QR UC3 (Burin) : proposé uniquement pour un RDV PLANIFIE du jour (enregistrement à la borne).
const STATUT_VARIANT = {
  PLANIFIE: 'default',
  PRESENT: 'success',
  ANNULE: 'destructive',
};

export default function AppointmentCard({ rdv }) {
  const showKiosk =
    rdv.statut === 'PLANIFIE' &&
    rdv.id_rdv != null &&
    isSameDay(rdv.date_heure);

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
              <Hash className="h-3.5 w-3.5 text-primary" />
              Rendez-vous n° {rdv.id_rdv}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              {formatDate(rdv.date_heure)}
            </div>

            <div className="flex items-center gap-2 font-medium">
              <Stethoscope className="h-4 w-4 text-primary" />
              Dr {rdv.medecin_prenom} {rdv.medecin_nom}

              {rdv.specialite && (
                <Badge variant="secondary">{rdv.specialite}</Badge>
              )}
            </div>

            {rdv.motif && (
              <p className="text-sm text-muted-foreground">
                {rdv.motif}
              </p>
            )}
          </div>

          <Badge variant={STATUT_VARIANT[rdv.statut] || 'outline'}>
            {RDV_STATUTS[rdv.statut] || rdv.statut}
          </Badge>
        </div>

        {showKiosk && (
          <div className="flex items-center gap-3 border-t pt-3">
            <div className="rounded-lg border bg-white p-2">
              <QRCodeSVG value={kiosqueUrl(rdv.id_rdv)} size={80} />
            </div>

            <div className="space-y-1 text-sm">
              <p className="font-medium">
                Rendez-vous aujourd&apos;hui
              </p>

              <p className="text-xs text-muted-foreground">
                Scannez le QR à la borne ou saisissez le n°{' '}
                <strong className="text-foreground">
                  {rdv.id_rdv}
                </strong>
                .
              </p>

              <Button asChild size="sm" variant="outline">
                <Link to={`/kiosque?id_rdv=${rdv.id_rdv}`}>
                  M&apos;enregistrer à la borne
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
