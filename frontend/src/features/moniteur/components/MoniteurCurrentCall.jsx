import { Megaphone, Stethoscope, DoorOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import PriorityBadge from '@/components/PriorityBadge';

export default function MoniteurCurrentCall({ current, flash = false }) {
  const currentNum = current?.numero;
  const box = current?.numero_box;
  const enConsultation = current?.statut === 'EN_CONSULTATION';

  return (
    <section className={cn('moniteur-current', flash && 'moniteur-flash')}>
      <p className="moniteur-label">
        {enConsultation ? <Stethoscope size={17} aria-hidden="true" /> : <Megaphone size={17} aria-hidden="true" />}
        {enConsultation ? 'Eo amin\'ny fitsaboana' : "Eo amin'ny antsoina"}
      </p>
      <p className="moniteur-numero">{currentNum != null ? `#${currentNum}` : '—'}</p>

      {box && (
        <>
          <hr className="moniteur-perforation" />
          <p className="moniteur-box">
            <DoorOpen size={26} aria-hidden="true" />
            Box {box}
          </p>
          <p className="moniteur-box-hint">Mankasitraka mankany ao amin'ny box voafaritra</p>
        </>
      )}

      {current?.niveau_priorite && (
        <div className="moniteur-priority-slot">
          <PriorityBadge level={current.niveau_priorite} />
        </div>
      )}
    </section>
  );
}
