import { cn } from '@/lib/utils';
import PriorityBadge from '@/components/PriorityBadge';

// ============ OWNER: Clova (UC9 - file d'attente affichée) ============
export default function MoniteurWaitingList({ waiting = [] }) {
  if (waiting.length === 0) {
    return <p className="moniteur-empty">Tsy misy laharana miandry.</p>;
  }

  return (
    <ul className="moniteur-list">
      {waiting.slice(0, 8).map((t) => (
        <li key={t.id_ticket} className={cn('moniteur-list-item')}>
          <span className="moniteur-list-numero">#{t.numero}</span>
          {t.niveau_priorite && (
            <span className="moniteur-list-priority">
              <PriorityBadge level={t.niveau_priorite} />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
