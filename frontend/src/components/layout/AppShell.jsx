import { useState, Fragment } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarPlus,
  CalendarDays,
  Ticket,
  Users,
  AlertTriangle,
  Stethoscope,
  History,
  LogOut,
  Menu,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROLE_LABELS } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import FlagStripe from '@/components/FlagStripe';
import logo from '@/assets/image/logo.png';

// ============================================================ Tsiry DS — AppShell ============
// Fondation : sidebar (244px / 220px ≤1024), header 60px, contenu max 1180.
// Mobile (≤820) : menu dans un drawer. ≤520 : colonne seule.
const NAV_BY_ROLE = {
  PATIENT: [
    { to: '/patient', label: 'Tabilao', icon: LayoutDashboard, end: true },
    { to: '/patient/rendez-vous/nouveau', label: 'Misoratra fotoana', icon: CalendarPlus },
    { to: '/patient/rendez-vous', label: 'Ny fotoanako', icon: CalendarDays, end: true },
    { to: '/patient/ticket', label: 'Ny tiketo', icon: Ticket },
  ],
  AGENT: [
    { to: '/agent', label: 'Tabilao', icon: LayoutDashboard, end: true },
    { to: '/agent/file-attente', label: 'Filaharana', icon: Users },
    { to: '/agent/urgences', label: 'Manambara vonjy maika', icon: AlertTriangle },
  ],
  MEDECIN: [
    { to: '/medecin', label: 'Tabilao', icon: LayoutDashboard, end: true },
    { to: '/medecin/consultation', label: 'Fitsaboana', icon: Stethoscope },
    { to: '/medecin/historique', label: "Tantaran'ny marary", icon: History },
  ],
};

const SCOPE_LABEL = {
  PATIENT: 'Faritra marary',
  AGENT: 'Faritra fandraisana',
  MEDECIN: 'Faritra dokotera',
};

function initials(user) {
  if (!user) return '?';
  return `${user.prenom?.[0] ?? ''}${user.nom?.[0] ?? ''}`.toUpperCase() || '?';
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5 px-5 pt-5 pb-0">
      <img
        src={logo}
        alt="Tsiry"
        className="h-[34px] w-[34px] shrink-0 object-contain"
      />
      <span className="min-w-0">
        <span className="block text-[15px] font-bold leading-tight tracking-tight text-foreground">
          Tsiry
        </span>
        <span className="block text-[11px] font-medium text-text-muted">Fitantanana hopitaly</span>
      </span>
    </Link>
  );
}

function NavItems({ items, onNavigate }) {
  return (
    <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-5">
      <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-text-faint">
        Menio fototra
      </p>
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-[13.5px] font-medium transition-colors duration-150 ease-soft',
              isActive
                ? 'bg-green-soft text-green-deep'
                : 'text-text-2 hover:bg-surface-2 hover:text-foreground'
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                className={cn('h-[18px] w-[18px] shrink-0', isActive ? 'text-primary' : 'text-text-muted')}
              />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

function SidebarFooter({ user, onLogout }) {
  return (
    <div className="border-t border-border px-3 py-3">
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full">
          <button className="flex w-full items-center gap-2.5 rounded-[6px] px-2 py-2 text-left transition-colors duration-150 ease-soft hover:bg-surface-2">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback>{initials(user)}</AvatarFallback>
            </Avatar>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium leading-tight text-foreground">
                {user?.prenom} {user?.nom}
              </span>
              <span className="block text-[11.5px] text-text-muted">{ROLE_LABELS[user?.role]}</span>
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top" className="w-52">
          <DropdownMenuLabel>Ny kaontiko</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            Hivoaka
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = user?.role;
  const items = NAV_BY_ROLE[role] || [];
  const current = items.find((i) => (i.end ? location.pathname === i.to : location.pathname.startsWith(i.to)));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeTimeline = () => setMobileOpen(false);

  const sidebar = (
    <div className="flex h-full flex-col bg-surface">
      <Brand />
      <NavItems items={items} onNavigate={closeTimeline} />
      <SidebarFooter user={user} onLogout={handleLogout} />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Bande tricolore visible en haut de toutes les pages */}
      <FlagStripe className="fixed inset-x-0 top-0 z-[100] h-[3px]" />

      {/* Sidebar desk / tablette (≥821) */}
      <aside className="sticky top-0 hidden h-screen w-[220px] shrink-0 border-r border-border bg-surface min-[821px]:block min-[1025px]:w-[244px]">
        {sidebar}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header 60px */}
        <header className="sticky top-0 z-30 flex h-[60px] shrink-0 items-center gap-2 border-b border-border bg-surface px-4 md:px-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="min-[821px]:hidden" aria-label="Hampidirina ny menio">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Fitsiriana</SheetTitle>
              </SheetHeader>
              {sidebar}
            </SheetContent>
          </Sheet>

          {/* Fil d'Ariane */}
          <div className="flex min-w-0 items-center gap-1.5 text-[13px]">
            <span className="hidden text-text-muted sm:inline">{SCOPE_LABEL[role]}</span>
            <ChevronRight className="hidden h-3.5 w-3.5 text-text-faint sm:inline" />
            <span className="truncate font-semibold text-foreground">{current?.label || 'Trano'}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials(user)}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Contenu */}
        <main className="flex-1">
          <div className="mx-auto w-full max-w-[1180px] px-4 py-6 md:px-7 md:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}