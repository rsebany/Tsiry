import { cn } from '@/lib/utils';

// ============ Medisaas Design System — Background ============
// Fond : #f4f7f9 + texture en grille radiale fine (40px) + 3 blobs colorés
// (Emerald / Blue / Teal) floutés, animés via @keyframes blob (7s).
export default function Background({ className }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#f4f7f9]',
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(203,213,225,0.5)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute -left-24 -top-24 h-96 w-96 animate-blob rounded-full bg-emerald-400/30 blur-[100px]" />
      <div className="absolute -right-32 top-1/3 h-[28rem] w-[28rem] animate-blob rounded-full bg-blue-400/25 blur-[100px] [animation-delay:2.3s]" />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 animate-blob rounded-full bg-teal-400/25 blur-[100px] [animation-delay:4.6s]" />
    </div>
  );
}