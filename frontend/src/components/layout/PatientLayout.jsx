import { Outlet } from 'react-router-dom';
import AppShell from './AppShell';

export default function PatientLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
