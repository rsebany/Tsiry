import { Outlet } from 'react-router-dom';
import AppShell from './AppShell';

// ============ Layout agent (Tsiry DS) ============
// Shell unique : mêmes navigation, même fond que le patient — le triage ne se distingue pas.
export default function AgentLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}