import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const PRIORITY_LABELS = {
  ROUGE: 'Critique — prise en charge immédiate',
  ORANGE: 'Urgent — surveillance rapprochée',
  JAUNE: 'Modéré',
  VERT: 'Stable',
};

// ============ OWNER: Jess (UC8 - résultat du triage) ============
// // TODO Jess: ajouter un lien vers le ticket du patient une fois généré.
export default function UrgenceResultPanel({ result }) {
  if (!result) return null;

  const priority = result.niveau_priorite;
  const isAlert = priority === 'ROUGE' || priority === 'ORANGE';

  return (
    <Alert variant={isAlert ? 'destructive' : 'default'}>
      {isAlert && <AlertTriangle className="h-4 w-4" />}
      <AlertTitle>
        Priorité : <strong>{priority}</strong> (score {result.score_gravite}/4)
      </AlertTitle>
      <AlertDescription>
        {PRIORITY_LABELS[priority]}
        {isAlert && ' — Alerte activée, le patient sera priorisé dans la file d\'attente.'}
      </AlertDescription>
    </Alert>
  );
}
