import { DoorOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import FlagStripe from '@/components/FlagStripe';
import KiosquePanel from '@/features/kiosque/components/KiosquePanel';
import logo from '@/assets/image/logo.png';

// Écran dédié sans shell : centré, sobre, ligne tricolore.
export default function KiosqueView() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <FlagStripe className="h-1.5 w-full" />
      <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6">
        <div className="mb-6 flex items-center gap-3 sm:mb-8">
          <img src={logo} alt="Tsiry" className="h-11 w-11 rounded-[6px] object-contain" />
          <h1 className="text-2xl font-bold text-center text-foreground sm:text-3xl">
            Kioska fisoratana
          </h1>
        </div>

        <KiosquePanel />

        <p className="mt-8 text-sm text-text-muted">
          Olana? Mankanesa any amin'ny fandraisana na{' '}
          <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            mifidira
          </Link>
          .
        </p>
      </div>
    </div>
  );
}