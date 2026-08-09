import { cn } from '@/lib/utils';

// =========================================================== Tsiry D — Status (Point)
// Pills sémantiques réservées aux Statut / Priorité / État / Catégorie.
// Toujours point + libellé — jamais la couleur seule.
const TONES = {
  success: { dot: 'bg-primary', cls: 'bg-green-soft text-green-deep' },
  info: { dot: 'bg-info', cls: 'bg-info-soft text-[#1d4f8f]' },
  warning: { dot: 'bg-amber', cls: 'bg-amber-soft text-[#8a5a12]' },
  danger: { dot: 'bg-red', cls: 'bg-red-soft text-red-dark' },
  neutral: { dot: 'bg-text-faint', cls: 'bg-surface-2 text-text-2' },
};

function Status({ tone = 'info', className, children, ...props }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[12.5px] font-medium leading-none',
        t.cls,
        className
      )}
      {...props}
    >
      <span className={cn('h-[6px] w-[6px] shrink-0 rounded-full', t.dot)} aria-hidden="true" />
      {children}
    </span>
  );
}

// Variante sans pilule : point + texte (métadonnées).
function DotText({ tone = 'info', className, children, ...props }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-[13px]', className)} {...props}>
      <span className={cn('h-2 w-2 shrink-0 rounded-full', t.dot)} aria-hidden="true" />
      {children}
    </span>
  );
}

export { Status, DotText, TONES };