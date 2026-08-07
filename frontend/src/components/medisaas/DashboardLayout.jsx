import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, CalendarDays, CalendarPlus, LayoutDashboard, LogOut, Menu, Ticket, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROLE_LABELS } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/medisaas/Button';
import Background from '@/components/medisaas/Background';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

// ============ Medisaas Design System — DashboardLayout ============
// Disposition fixe (100vh), sidebar 280px, zone de contenu fluide,
// fond dynamique (blobs animés). Navigation limitée aux routes existantes.
const PATIENT_NAV = [
  { to: '/patient', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/patient/rendez-vous/nouveau', label: 'Nouveau rendez-vous', icon: CalendarPlus },
  { to: '/patient/rendez-vous', label: 'Mes rendez-vous', icon: CalendarDays, end: true },
  { to: '/patient/ticket', label: 'Mon ticket', icon: Ticket },
];

const AGENT_NAV = [
  { to: '/agent', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/agent/file-attente', label: "File d'attente", icon: Users },
  { to: '/agent/urgences', label: 'Déclarer une urgence', icon: AlertTriangle },
];

function initials(user) {
  if (!user) return '?';
  return `${user.prenom?.[0] ?? ''}${user.nom?.[0] ?? ''}`.toUpperCase() || '?';
}

// Barre latérale : PATIENT par défaut, AGENT selon le rôle ; surchargeable.
const NAV_BY_ROLE = {
  PATIENT: PATIENT_NAV,
  AGENT: AGENT_NAV,
};

const SCOPE_BY_ROLE = {
  PATIENT: 'Espace patient',
  AGENT: 'Espace accueil',
};

function Brand({ role }) {
  return (
    <div className="flex items-center gap-3 px-5 py-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
        <Activity className="h-5 w-5 text-emerald-600" />
      </div>
      <div className="min-w-0">
        <p className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-lg font-extrabold leading-none tracking-tight text-transparent">
          Tsiry
        </p>
        <p className="mt-1 text-xs font-medium text-slate-400">{SCOPE_BY_ROLE[role] || 'Espace'}</p>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children, nav, scopeLabel }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = user?.role;
  const items = nav || NAV_BY_ROLE[role] || PATIENT_NAV;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <Brand role={role} />
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors duration-200',
                isActive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-500 hover:bg-slate-100/70 hover:text-slate-800'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-emerald-500 to-teal-500" />
                )}
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0',
                    isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                  )}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50/80 px-3 py-2">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback className="bg-emerald-100 text-emerald-700">
              {initials(user)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">
              {user?.prenom} {user?.nom}
            </p>
            <p className="text-xs text-slate-400">{ROLE_LABELS[user?.role]}</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full justify-start text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#f4f7f9] font-sans text-slate-900">
      <Background />

      <aside className="relative z-10 hidden w-[280px] shrink-0 border-r border-white/60 bg-white/70 backdrop-blur-xl lg:block">
        {sidebar}
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="glass"
            size="icon"
            className="absolute left-4 top-4 z-20 lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[280px] border-r border-white/60 bg-white/90 p-0 backdrop-blur-xl"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          {sidebar}
        </SheetContent>
      </Sheet>

      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-6xl animate-fade-in-up p-6 pt-20 md:p-10 lg:pt-10">
          {children}
        </div>
      </main>
    </div>
  );
}