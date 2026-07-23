export default function MoniteurWaitingList({ waiting }) {
  if (waiting.length === 0) {
    return <p className="moniteur-empty">Aucun patient en attente</p>;
  }

  return (
    <ul className="moniteur-list">
      {waiting.slice(0, 8).map((t) => {
        const isUrgent = t.niveau_priorite === 'ROUGE' || t.niveau_priorite === 'ORANGE';

        return (
          <li key={t.id_ticket}>
            #{t.numero}
            {t.niveau_priorite && (
              <span
                className={`moniteur-priority-dot moniteur-priority-dot--${t.niveau_priorite.toLowerCase()}`}
              />
            )}
            {/* Badge visuel pulsant d'urgence */}
            {isUrgent && (
              <span
                className="relative inline-flex h-3 w-3 ml-2 align-middle"
                title={`Urgence ${t.niveau_priorite}`}
              >
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    t.niveau_priorite === 'ROUGE' ? 'bg-red-500' : 'bg-orange-500'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    t.niveau_priorite === 'ROUGE' ? 'bg-red-600' : 'bg-orange-500'
                  }`}
                />
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}