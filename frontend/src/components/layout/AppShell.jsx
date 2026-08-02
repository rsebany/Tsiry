import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
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
  Hospital,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROLE_LABELS } from '@/lib/constants';
import { getRoleHome } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

// // ============ OWNER: Jess (fondation / nav) ============
// // TODO Jess: ajouter le lien "Statut ticket" côté médecin si nécessaire.

const NAV_BY_ROLE = {
  PATIENT: [
    { to: '/patient', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
    { to: '/patient/rendez-vous/nouveau', label: 'Prendre un RDV', icon: CalendarPlus },
    { to: '/patient/rendez-vous', label: 'Mes rendez-vous', icon: CalendarDays, end: true },
    { to: '/patient/ticket', label: 'Mon ticket', icon: Ticket },
  ],
  AGENT: [
    { to: '/agent', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
    { to: '/agent/file-attente', label: 'File d\'attente', icon: Users },
    { to: '/agent/urgences', label: 'Déclarer urgence', icon: AlertTriangle },
  ],
  MEDECIN: [
    { to: '/medecin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
    { to: '/medecin/consultation', label: 'Consultation', icon: Stethoscope },
    { to: '/medecin/historique', label: 'Historique patient', icon: History },
  ],
};

function initials(user) {
  if (!user) return '?';
  return `${user.prenom?.[0] ?? ''}${user.nom?.[0] ?? ''}`.toUpperCase() || '?';
}

function NavItems({ items, collapsed, onNavigate }) {
  return (
    <nav className="space-y-1">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          title={collapsed ? label : undefined}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              collapsed && 'justify-center px-0',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )
          }
        >
          <Icon className="h-4 w-4 shrink-0" />
          {!collapsed && label}
        </NavLink>
      ))}
    </nav>
  );
}

function Brand({ collapsed }) {
  return (
    <Link
      to="/"
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2',
        collapsed && 'justify-center px-0'
      )}
    >
      <Hospital className="h-6 w-6 shrink-0 text-primary" />
      {!collapsed && (
        <div className="min-w-0">
          <p className="text-sm font-bold leading-none">Tsiry</p>
          <p className="text-[11px] text-muted-foreground">Gestion Hospitalière</p>
        </div>
      )}
    </Link>
  );
}

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const items = NAV_BY_ROLE[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebar = (
    <div className={cn('flex h-full flex-col gap-4', collapsed ? 'p-3' : 'p-4')}>
      <Brand collapsed={collapsed} />
      <NavItems items={items} collapsed={collapsed} onNavigate={() => setMobileOpen(false)} />
      <div className={cn('mt-auto space-y-3', collapsed && 'flex flex-col items-center')}>
        <Button
          variant="ghost"
          size={collapsed ? 'icon' : 'default'}
          className={cn('w-full justify-start', collapsed && 'justify-center')}
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Agrandir la barre latérale' : 'Réduire la barre latérale'}
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          {!collapsed && 'Réduire'}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-accent',
                collapsed && 'justify-center px-0'
              )}
            >
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback>{initials(user)}</AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{user?.prenom} {user?.nom}</p>
                  <Badge variant="secondary" className="mt-0.5">{ROLE_LABELS[user?.role]}</Badge>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <aside
        className={cn(
          'hidden shrink-0 border-r bg-card transition-[width] duration-300 md:block',
          collapsed ? 'w-[68px]' : 'w-64'
        )}
      >
        {sidebar}
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="absolute left-4 top-4 z-10 md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          {sidebar}
        </SheetContent>
      </Sheet>

      <main className="flex-1 p-6 pt-16 md:p-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
