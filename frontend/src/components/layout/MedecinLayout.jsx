import { Outlet } from 'react-router-dom';
import AppShell from './AppShell';

export default function MedecinLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
