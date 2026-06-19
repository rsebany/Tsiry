import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, AlertTriangle } from 'lucide-react';
import AppSidebar, { PortalShell } from './AppSidebar';

const NAV_ITEMS = [
  { to: '/agent', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/agent/file-attente', label: "File d'attente", icon: Users },
  { to: '/agent/urgences', label: 'Urgences', icon: AlertTriangle },
];

export default function AgentLayout() {
  return (
    <PortalShell
      sidebar={
        <AppSidebar
          title="Espace Agent"
          subtitle="Gestion de la file d'attente et des urgences"
          items={NAV_ITEMS}
        />
      }
    >
      <Outlet />
    </PortalShell>
  );
}
