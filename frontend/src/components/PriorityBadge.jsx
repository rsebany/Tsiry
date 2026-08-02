import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// ============ OWNER: Clova (UC8/UC9 - affichage priorité) ============
const VARIANT = {
  ROUGE: 'destructive',
  ORANGE: 'warning',
  JAUNE: 'warning',
  VERT: 'success',
};

export default function PriorityBadge({ level, className }) {
  if (!level) return null;
  return (
    <Badge variant={VARIANT[level] || 'outline'} className={cn('uppercase', className)}>
      {level}
    </Badge>
  );
}
