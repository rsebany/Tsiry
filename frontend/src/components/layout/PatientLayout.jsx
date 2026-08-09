import { Outlet } from 'react-router-dom';
import AppShell from './AppShell';

// ============ Layout patient (Tsiry DS) ============
// Shell unique pour tous les rôles : sidebar 244 + header 60.
export default function PatientLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}