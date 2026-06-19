const PRIORITY_LABELS = {
  ROUGE: 'Critique — prise en charge immédiate',
  ORANGE: 'Urgent — surveillance rapprochée',
  JAUNE: 'Modéré',
  VERT: 'Stable',
};

export default function UrgenceResultPanel({ result }) {
  if (!result) return null;

  const priority = result.niveau_priorite;
  const isAlert = priority === 'ROUGE' || priority === 'ORANGE';

  return (
    <div className={`urgence-result urgence-result--${priority?.toLowerCase()}`}>
      <p className="urgence-result-title">
        Priorité : <strong>{priority}</strong> (score {result.score_gravite}/4)
      </p>
      <p>{PRIORITY_LABELS[priority]}</p>
      {isAlert && (
        <p className="urgence-alert">
          Alerte activée — le patient sera priorisé dans la file d&apos;attente.
        </p>
      )}
    </div>
  );
}
