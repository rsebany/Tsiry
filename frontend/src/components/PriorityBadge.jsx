import { Status } from '@/components/ui/status';
import { cn } from '@/lib/utils';

// ============ Tsiry DS — Priorité (UC8/UC9) ============
// Pill sémantique point + libellé : ROUGE → danger, ORANGE/JAUNE → warning, VERT → success.
const TONE = {
  ROUGE: 'danger',
  ORANGE: 'warning',
  JAUNE: 'warning',
  VERT: 'success',
};

export default function PriorityBadge({ level, className }) {
  if (!level) return null;
  return (
    <Status tone={TONE[level] || 'neutral'} className={cn('uppercase', className)}>
      {level}
    </Status>
  );
}