import { CalendarDays, Hash, Stethoscope } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, RDV_STATUTS } from '@/lib/constants';

const STATUT_VARIANT = {
  PLANIFIE: 'default',
  PRESENT: 'success',
  ANNULE: 'destructive',
};

export default function AppointmentCard({ rdv }) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
            <Hash className="h-3.5 w-3.5 text-primary" />
            Fotoana n° {rdv.id_rdv}
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
          {rdv.motif && <p className="text-sm text-muted-foreground">{rdv.motif}</p>}
        </div>
        <Badge variant={STATUT_VARIANT[rdv.statut] || 'outline'}>
          {RDV_STATUTS[rdv.statut] || rdv.statut}
        </Badge>
      </CardContent>
    </Card>
  );
}
