import PriorityBadge from '../queue/PriorityBadge.jsx';

export default function MoniteurCurrentCall({ current, flash = false }) {
  const currentNum = current?.numero;
  const box = current?.numero_box;

  return (
    <section className={`moniteur-current ${flash ? 'moniteur-flash' : ''}`}>
      <p className="moniteur-label">
        {current?.statut === 'EN_CONSULTATION' ? 'En consultation' : "En cours d'appel"}
      </p>
      <p className="moniteur-numero">{currentNum != null ? `#${currentNum}` : '—'}</p>
      {box && <p className="moniteur-box">Box {box}</p>}
      {current?.niveau_priorite && (
        <p className="moniteur-priority">
          <PriorityBadge level={current.niveau_priorite} />
        </p>
      )}
    </section>
  );
}
