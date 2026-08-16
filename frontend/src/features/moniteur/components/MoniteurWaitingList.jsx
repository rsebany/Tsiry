import PriorityBadge from '@/components/PriorityBadge';

// ============ OWNER: Clova (UC9 - file d'attente affichée) ============
export default function MoniteurWaitingList({ waiting = [] }) {
  if (waiting.length === 0) {
    return <p className="moniteur-empty">Tsy misy laharana miandry.</p>;
  }

  return (
    <ul className="moniteur-list">
      {waiting.slice(0, 8).map((t) => (
        <li key={t.id_ticket} className="moniteur-list-item" data-priorite={t.niveau_priorite || undefined}>
          <span className="moniteur-list-numero">#{t.numero}</span>
          {t.niveau_priorite && <PriorityBadge level={t.niveau_priorite} />}
        </li>
      ))}
    </ul>
  );
}
