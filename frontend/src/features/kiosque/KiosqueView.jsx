import { Hospital } from 'lucide-react';
import { Link } from 'react-router-dom';
import FlagStripe from '@/components/FlagStripe';
import KiosquePanel from '@/features/kiosque/components/KiosquePanel';

// ============ OWNER: Burin (UC3 - borne publique) ============
export default function KiosqueView() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-900 to-emerald-950 text-white">
      <FlagStripe className="h-1.5 w-full" />
      <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6">
      <div className="mb-6 flex items-center gap-3 sm:mb-8">
        <Hospital className="h-10 w-10 sm:h-12 sm:w-12" />
        <h1 className="text-2xl font-bold text-center sm:text-3xl">
          Borne d&apos;enregistrement
        </h1>
      </div>

      <KiosquePanel />

      <p className="mt-8 text-sm text-white/60">
        Une difficulté ? Adressez-vous à l&apos;accueil ou{' '}
        <Link to="/login" className="underline hover:text-white">
          connectez-vous
        </Link>
        .
      </p>
      </div>
    </div>
  );
}
