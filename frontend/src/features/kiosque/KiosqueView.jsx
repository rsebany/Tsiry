import { DoorOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import FlagStripe from '@/components/FlagStripe';
import KiosquePanel from '@/features/kiosque/components/KiosquePanel';

// ============ Tsiry DS — Borne publique (UC3) ============
// Écran dédié sans shell : centré, sobre, ligne tricolore.
export default function KiosqueView() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <FlagStripe className="h-1.5 w-full" />
      <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6">
        <div className="mb-6 flex items-center gap-3 sm:mb-8">
          <span className="flex h-11 w-11 items-center justify-center rounded-[6px] bg-primary text-white">
            <DoorOpen className="h-6 w-6" />
          </span>
          <h1 className="text-2xl font-bold text-center text-foreground sm:text-3xl">
            Borne d&apos;enregistrement
          </h1>
        </div>

        <KiosquePanel />

        <p className="mt-8 text-sm text-text-muted">
          Une difficulté ? Adressez-vous à l&apos;accueil ou{' '}
          <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            connectez-vous
          </Link>
          .
        </p>
      </div>
    </div>
  );
}