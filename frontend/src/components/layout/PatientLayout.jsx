import { Outlet } from 'react-router-dom';
import { LayoutDashboard, CalendarPlus, CalendarDays, Ticket } from 'lucide-react';
import AppSidebar, { PortalShell } from './AppSidebar';

const NAV_ITEMS = [
  { to: '/patient', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/patient/rendez-vous/nouveau', label: 'Prendre RDV', icon: CalendarPlus },
  { to: '/patient/rendez-vous', label: 'Mes rendez-vous', icon: CalendarDays },
  { to: '/patient/ticket', label: 'Statut ticket', icon: Ticket },
];

export default function PatientLayout() {
  return (
    <PortalShell
      sidebar={
        <AppSidebar
          title="Espace Patient"
          subtitle="Gérez vos rendez-vous et suivez votre file d'attente"
          items={NAV_ITEMS}
        />
      }
    >
      <Outlet />
    </PortalShell>
  );
}
