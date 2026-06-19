import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Stethoscope } from 'lucide-react';
import AppSidebar, { PortalShell } from './AppSidebar';

const NAV_ITEMS = [
  { to: '/medecin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/medecin/appel', label: 'Appel consultation', icon: Stethoscope },
];

export default function MedecinLayout() {
  return (
    <PortalShell
      sidebar={
        <AppSidebar
          title="Espace Médecin"
          subtitle="Consultation et appel des patients"
          items={NAV_ITEMS}
        />
      }
    >
      <Outlet />
    </PortalShell>
  );
}
