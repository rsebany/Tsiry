import { Outlet } from 'react-router-dom';
import DashboardLayout from '@/components/medisaas/DashboardLayout';

// ============ Layout patient (Medisaas) ============
// Migration progressive : le shell patient utilise le nouveau design system.
// Agent / Médecin conservent AppShell (migration ultérieure).
export default function PatientLayout() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}