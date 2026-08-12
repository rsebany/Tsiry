import { cn } from '@/lib/utils';
import PriorityBadge from '@/components/PriorityBadge';

// ============ OWNER: Clova (UC9 - numéro en cours) ============
export default function MoniteurCurrentCall({ current, flash = false }) {
  const currentNum = current?.numero;
  const box = current?.numero_box;

  return (
    <section className={cn('moniteur-current', flash && 'moniteur-flash')}>
      <p className="moniteur-label">
        {current?.statut === 'EN_CONSULTATION' ? 'Am-pitsaboana' : 'Antso mitohy'}
      </p>
      <p className="moniteur-numero">{currentNum != null ? `#${currentNum}` : '—'}</p>
      {box && <p className="moniteur-box">Trano {box}</p>}
      {current?.niveau_priorite && <PriorityBadge level={current.niveau_priorite} />}
    </section>
  );
}
