import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ROLE_LABELS = {
  PATIENT: 'Patient',
  AGENT: "Agent d'accueil",
  MEDECIN: 'Médecin',
};

export default function AppSidebar({ title, subtitle, items }) {
  const { user, logout } = useAuth();

  return (
    <>
      <aside className="hidden w-64 flex-col border-r bg-card md:flex">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
          {user && (
            <div className="mt-3 space-y-1">
              <p className="text-sm font-medium">
                {user.prenom} {user.nom}
              </p>
              <Badge variant="secondary">{ROLE_LABELS[user.role] || user.role}</Badge>
            </div>
          )}
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t p-4">
          <Button variant="outline" className="w-full" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t bg-card md:hidden">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 py-2 text-xs',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}

export function PortalShell({ sidebar, children }) {
  return (
    <div className="flex min-h-screen bg-background">
      {sidebar}
      <main className="flex-1 overflow-auto p-4 pb-20 md:p-8 md:pb-8">{children}</main>
    </div>
  );
}
