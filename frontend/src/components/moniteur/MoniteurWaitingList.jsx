export default function MoniteurWaitingList({ waiting }) {
  if (waiting.length === 0) {
    return <p className="moniteur-empty">Aucun patient en attente</p>;
  }

  return (
    <ul className="moniteur-list">
      {waiting.slice(0, 8).map((t) => (
        <li key={t.id_ticket}>
          #{t.numero}
          {t.niveau_priorite && (
            <span
              className={`moniteur-priority-dot moniteur-priority-dot--${t.niveau_priorite.toLowerCase()}`}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
