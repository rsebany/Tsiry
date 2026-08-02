import { Outlet } from 'react-router-dom';
import AppShell from './AppShell';

export default function AgentLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
